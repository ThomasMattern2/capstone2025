import asyncio
import struct
import serial
import threading
import time
import csv
import os
from datetime import datetime


def crc8_crsf(data):
    """Poly 0xD5 CRC calculation"""
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


class TelemetryHandler:
    def __init__(self, port="COM5", baudrate=420000):
        # --- LOGGING SETUP ---
        self.log_dir = "logs"
        if not os.path.exists(self.log_dir):
            os.makedirs(self.log_dir)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.csv_filename = f"{self.log_dir}/crsf_log_{timestamp}.csv"

        # Create CSV file with headers
        with open(self.csv_filename, mode="w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["Timestamp", "Type", "Data"])

        print(f"DEBUG: Logging to {self.csv_filename}")

        # --- SERIAL CONFIG ---
        self.port = port
        self.baudrate = baudrate
        self.ser = None
        self.telemetry_queue = asyncio.Queue()

        # AGL Logic: Store home altitude
        self.home_altitude = None

        self.state = {
            "battery": {"voltage": 0, "current": 0, "capacity": 0, "remaining": 0},
            "attitude": {"pitch": 0, "roll": 0, "yaw": 0},
            "gps": {"lat": 0, "lon": 0, "alt": 0, "sats": 0, "gs": 0, "hdg": 0},
            "link": {"rssi": 0, "lq": 0},
            "channels": [0] * 16,
            "flight_mode": "UNKNOWN",
        }

    def _log_to_csv(self, msg_type, data_dict):
        """Helper to append data to CSV"""
        try:
            with open(self.csv_filename, mode="a", newline="") as f:
                writer = csv.writer(f)
                writer.writerow([datetime.now().isoformat(), msg_type, str(data_dict)])
        except Exception:
            pass

    def start(self, loop):
        thread = threading.Thread(
            target=self._receiver_thread, args=(loop,), daemon=True
        )
        thread.start()

    def _receiver_thread(self, loop):
        buffer = bytearray()
        while True:
            # 1. Try to Connect
            if self.ser is None or not self.ser.is_open:
                try:
                    self.ser = serial.Serial(self.port, self.baudrate, timeout=0.1)
                    print(f"DEBUG: Successfully connected to {self.port}")
                    buffer = bytearray()
                except Exception as e:
                    time.sleep(2)  # Wait before retrying
                    continue

            # 2. Read and Parse
            try:
                if self.ser.in_waiting > 0:
                    data = self.ser.read(100)
                    if data:
                        buffer.extend(data)

                    while len(buffer) >= 2:
                        if buffer[0] not in [0xC8, 0xEA, 0xEE]:
                            buffer.pop(0)
                            continue

                        length = buffer[1]
                        if length > 64 or length < 2:
                            buffer.pop(0)
                            continue

                        if len(buffer) < length + 2:
                            break

                        frame = buffer[: length + 2]
                        payload = frame[2:-1]
                        frame_type = payload[0]
                        frame_data = payload[1:]

                        if crc8_crsf(payload) == frame[-1]:
                            self._parse_frame(frame_type, frame_data, loop)
                            del buffer[: length + 2]
                        else:
                            buffer.pop(0)
                else:
                    time.sleep(0.01)

            except Exception as e:
                print(f"DEBUG: Serial Error (Disconnecting): {e}")
                if self.ser:
                    self.ser.close()
                self.ser = None
                time.sleep(1)

    def _parse_frame(self, frame_type, data, loop):
        try:
            # 0x08: BATTERY
            if frame_type == 0x08 and len(data) == 8:
                v = (data[0] << 8) | data[1]
                i = (data[2] << 8) | data[3]
                cap = (data[4] << 16) | (data[5] << 8) | data[6]
                rem = data[7]
                payload = {
                    "voltage": v / 10.0,
                    "current": i / 10.0,
                    "capacity": cap,
                    "remaining": rem,
                }
                self.state["battery"] = payload
                self._log_to_csv("BATTERY", payload)
                self._queue_update("BATTERY", payload, loop)

            # 0x1E: ATTITUDE
            elif frame_type == 0x1E:
                p, r, y = struct.unpack(">hhh", data)
                payload = {
                    "pitch": p / 10000.0,
                    "roll": r / 10000.0,
                    "yaw": y / 10000.0,
                }
                self.state["attitude"] = payload
                self._queue_update("ATTITUDE", payload, loop)

            # 0x14: LINK STATISTICS
            elif frame_type == 0x14:
                uplink_rssi = data[0] if data[0] < 128 else data[0] - 256
                lq = data[2]
                payload = {"rssi": uplink_rssi, "lq": lq}
                self.state["link"] = payload
                self._log_to_csv("LINK", payload)
                self._queue_update("LINK", payload, loop)

            # 0x02: GPS
            elif frame_type == 0x02:
                lat, lon, gs, hdg, alt, sats = struct.unpack(">iiHHHB", data)

                # AGL LOGIC
                if self.home_altitude is None and sats >= 4:
                    self.home_altitude = alt
                    print(f"DEBUG: Home Altitude Set: {alt}m")

                agl = (
                    (alt - self.home_altitude) if self.home_altitude is not None else 0
                )

                payload = {
                    "lat": lat / 1e7,
                    "lon": lon / 1e7,
                    "alt": agl,  # Sending AGL
                    "sats": sats,
                    "gs": gs,
                    "hdg": hdg / 100.0,
                }
                self.state["gps"] = payload
                self._log_to_csv("GPS", payload)
                self._queue_update("GPS", payload, loop)

            # 0x29: FLIGHT MODE
            elif frame_type == 0x29:
                mode_str = data.decode("utf-8", errors="ignore").strip("\x00")
                self.state["flight_mode"] = mode_str
                self._queue_update("FLIGHT_MODE", {"mode": mode_str}, loop)

        except Exception as e:
            print(f"Parse Error: {e}")

    def _queue_update(self, msg_type, data, loop):
        asyncio.run_coroutine_threadsafe(
            self.telemetry_queue.put({"type": msg_type, "data": data}), loop
        )
