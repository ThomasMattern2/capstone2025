import sys
import os
import asyncio
import threading

script_dir = os.path.abspath("./../..")
sys.path.append(script_dir)

import Scripts.core.initialize as initialize
import Scripts.core.arm as arm


class Vehicle:
    def __init__(
        self, socketio=None, vehicle_connection_address="udpin:172.25.176.1:14550"
    ):
        self.vehicle_connection = initialize.connect_to_vehicle(
            vehicle_connection_address
        )
        self.verify_connection = initialize.verify_connection(self.vehicle_connection)

        self.message_queue = asyncio.Queue()
        self.telemetry_queue = asyncio.Queue()
        self.socket = socketio

        # shared state
        self.lat = 0
        self.lon = 0
        self.alt = 0
        self.rel_alt = 0

        self.pitch = 0
        self.yaw = 0
        self.roll = 0

        self.dlat = 0
        self.dlon = 0
        self.dalt = 0
        self.heading = 0
        self.airspeed = 0
        self.groundspeed = 0
        self.throttle = 0
        self.climb = 0
        self.rollspeed = 0
        self.pitchspeed = 0
        self.yawspeed = 0

        self.num_satellites = 0
        self.position_uncertainty = 0
        self.alt_uncertainty = 0
        self.speed_uncertainty = 0
        self.heading_uncertainty = 0

        self.flight_mode = 0

        self.battery_voltage = 0
        self.battery_current = 0
        self.battery_remaining = 0

    def arm_vehicle(self):
        return arm.arm(self.vehicle_connection)

    def disarm_vehicle(self):
        return arm.disarm(self.vehicle_connection)

    # Thead which places messages on various queues and populates
    def start_mavlink_thread(self, loop: asyncio.AbstractEventLoop):
        thread = threading.Thread(
            target=self.mavlink_reports_thread_producer, args=(loop,), daemon=True
        )
        thread.start()

    def mavlink_reports_thread_producer(self, loop: asyncio.AbstractEventLoop):
        while True:
            msg = self.vehicle_connection.recv_match(blocking=True)
            if msg:
                asyncio.run_coroutine_threadsafe(self.message_queue.put(msg), loop)

    async def multiplexing_layer(self, loop: asyncio.AbstractEventLoop):
        while True:
            msg = await self.message_queue.get()
            msg_type = msg.get_type()

            if msg_type == "GLOBAL_POSITION_INT":
                self.lat = msg.lat * 1.0e-7
                self.lon = msg.lon * 1.0e-7
                self.alt = msg.alt / 1000
                self.rel_alt = msg.relative_alt / 1000
                self.dlat = msg.vx / 100
                self.dlon = msg.vy / 100
                self.dalt = msg.vz / 100
                self.heading = msg.hdg / 100
                self.time_boot_ms = msg.time_boot_ms

            elif msg_type == "ATTITUDE":
                self.roll = msg.roll
                self.pitch = msg.pitch
                self.yaw = msg.yaw
                self.rollspeed = msg.rollspeed
                self.pitchspeed = msg.pitchspeed
                self.yawspeed = msg.yawspeed
                self.time_boot_ms = msg.time_boot_ms

            elif msg_type == "VFR_HUD":
                self.airspeed = msg.airspeed
                self.groundspeed = msg.groundspeed
                self.heading = msg.heading
                self.throttle = msg.throttle
                self.alt = msg.alt
                self.climb = msg.climb

            elif msg_type == "HEARTBEAT":
                self.flight_mode = msg.custom_mode

            elif msg_type == "SYS_STATUS":
                self.battery_voltage = msg.voltage_battery
                self.battery_current = msg.current_battery
                self.battery_remaining = msg.battery_remaining

            if msg:
                # add various consumer threads here
                asyncio.run_coroutine_threadsafe(self.telemetry_queue.put(msg), loop)

            self.message_queue.task_done()

    # Telemetry consumer that sends vehicle data through websocket
    async def telemetry_consumer(self):
        while True:
            msg = await self.telemetry_queue.get()
            print(msg)
            msg_type = msg.get_type()
            data = None

            if msg_type == "GLOBAL_POSITION_INT":
                data = {
                    "time_boot_ms": msg.time_boot_ms,
                    "lat": msg.lat * 1.0e-7,
                    "lon": msg.lon * 1.0e-7,
                    "alt": msg.alt / 1000,
                    "relative_alt": msg.relative_alt / 1000,
                    "vx": msg.vx / 100,
                    "vy": msg.vy / 100,
                    "vz": msg.vz / 100,
                    "hdg": msg.hdg / 100,
                }

            elif msg_type == "ATTITUDE":
                data = {
                    "time_boot_ms": msg.time_boot_ms,
                    "roll": msg.roll,
                    "pitch": msg.pitch,
                    "yaw": msg.yaw,
                    "rollspeed": msg.rollspeed,
                    "pitchspeed": msg.pitchspeed,
                    "yawspeed": msg.yawspeed,
                }

            elif msg_type == "VFR_HUD":
                data = {
                    "airspeed": msg.airspeed,
                    "groundspeed": msg.groundspeed,
                    "heading": msg.heading,
                    "throttle": msg.throttle,
                    "alt": msg.alt,
                    "climb": msg.climb,
                }

            elif msg_type == "HEARTBEAT":
                data = {"flight_mode": msg.custom_mode}
                self.flight_mode = msg.custom_mode

            elif msg_type == "SYS_STATUS":
                data = {
                    "battery_voltage": msg.voltage_battery,
                    "battery_current": msg.current_battery,
                    "battery_remaining": msg.battery_remaining,
                }

            if data and self.socket:
                self.socket.emit("vehicle_state", {"type": msg_type, "data": data})

            self.telemetry_queue.task_done()
