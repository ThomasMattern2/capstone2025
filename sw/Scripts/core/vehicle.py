import sys
import os
import asyncio
import threading
import serial
import struct


def crc8_crsf(data):
    crc = 0
    for byte in data:
        crc ^= byte
        for _ in range(8):
            if crc & 0x80:
                crc = (crc << 1) ^ 0xD5
            else:
                crc <<= 1
            crc &= 0xFF
    return crc


class Vehicle:
    def __init__(self, socketio=None, port="COM3", baudrate=420000):
        try:
            self.ser = serial.Serial(port, baudrate, timeout=0.1)
            print(f"Connected to Zorro on {port}")
        except Exception as e:
            print(f"Serial Error: {e}")
            self.ser = None

        self.telemetry_queue = asyncio.Queue()
        self.socket = socketio

        self.lat, self.lon, self.alt = 0, 0, 0
        self.pitch, self.yaw, self.roll = 0, 0, 0
        self.battery_voltage, self.battery_current = 0, 0
        self.link_quality, self.rssi = 0, 0

    def start_crsf_thread(self, loop: asyncio.AbstractEventLoop):
        thread = threading.Thread(
            target=self.crsf_receiver_thread, args=(loop,), daemon=True
        )
        thread.start()

    def crsf_receiver_thread(self, loop: asyncio.AbstractEventLoop):
        buffer = bytearray()
        while True:
            if not self.ser:
                break
            data = self.ser.read(100)
            if data:
                buffer.extend(data)

            while len(buffer) >= 3:
                if buffer[0] == 0xC8:
                    length = buffer[1]
                    if len(buffer) < length + 2:
                        break

                    frame = buffer[: length + 2]
                    payload = frame[2:-1]
                    frame_type = payload[0]

                    if crc8_crsf(frame[2:-1]) == frame[-1]:
                        self.process_crsf_frame(frame_type, payload[1:], loop)

                    del buffer[: length + 2]
                else:
                    buffer.pop(0)

    def process_crsf_frame(self, frame_type, data, loop):
        if frame_type == 0x08:
            v, i, cap, rem = struct.unpack(">HHIB", data)
            self.battery_voltage = v / 10.0
            self.battery_current = i / 10.0
            asyncio.run_coroutine_threadsafe(
                self.telemetry_queue.put(
                    {
                        "type": "BATTERY",
                        "data": {
                            "voltage": self.battery_voltage,
                            "current": self.battery_current,
                        },
                    }
                ),
                loop,
            )

        elif frame_type == 0x1E:
            p, r, y = struct.unpack(">hhh", data)
            self.pitch, self.roll, self.yaw = p / 10000, r / 10000, y / 10000
            asyncio.run_coroutine_threadsafe(
                self.telemetry_queue.put(
                    {
                        "type": "ATTITUDE",
                        "data": {
                            "pitch": self.pitch,
                            "roll": self.roll,
                            "yaw": self.yaw,
                        },
                    }
                ),
                loop,
            )

    async def telemetry_consumer(self):
        while True:
            msg = await self.telemetry_queue.get()
            if self.socket:
                self.socket.emit("vehicle_state", msg)
            self.telemetry_queue.task_done()
