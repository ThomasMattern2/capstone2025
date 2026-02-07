import asyncio
import struct
import serial
import threading
import time


def crc8_crsf(data):
    """Poly 0xD5 CRC calculation (Standard CRSF)"""
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
        try:
            self.ser = serial.Serial(port, baudrate, timeout=0.1)
            print(f"DEBUG: Connected to {port}. Full CRSF Parser Active.")
        except Exception as e:
            print(f"DEBUG: Connection Error: {e}")
            self.ser = None

        self.telemetry_queue = asyncio.Queue()

        # Comprehensive State Dictionary
        self.state = {
            "battery": {"voltage": 0, "current": 0, "capacity": 0, "remaining": 0},
            "attitude": {"pitch": 0, "roll": 0, "yaw": 0},
            "gps": {"lat": 0, "lon": 0, "alt": 0, "sats": 0, "gs": 0, "hdg": 0},
            "link": {"rssi": 0, "lq": 0, "tx_power": 0},
            "channels": [0] * 16,  # 16 RC Channels
            "flight_mode": "UNKNOWN",  # Current Flight Mode (String)
            "device_ping": {},  # Device Info
        }

    def start(self, loop):
        thread = threading.Thread(
            target=self._receiver_thread, args=(loop,), daemon=True
        )
        thread.start()

    def _receiver_thread(self, loop):
        buffer = bytearray()
        while self.ser and self.ser.is_open:
            try:
                data = self.ser.read(100)
                if data:
                    buffer.extend(data)

                while len(buffer) >= 2:
                    # 1. Sync Byte Check (Accepts 0xC8=FlightController, 0xEA=Radio, 0xEE=TX)
                    if buffer[0] not in [0xC8, 0xEA, 0xEE]:
                        buffer.pop(0)
                        continue

                    # 2. Length Check
                    length = buffer[1]
                    if length > 64 or length < 2:
                        buffer.pop(0)
                        continue

                    # 3. Wait for full frame
                    if len(buffer) < length + 2:
                        break

                    # 4. Extract Frame
                    frame = buffer[: length + 2]
                    payload = frame[2:-1]
                    frame_type = payload[0]
                    frame_data = payload[1:]

                    # 5. Verify CRC
                    if crc8_crsf(payload) == frame[-1]:
                        self._parse_frame(frame_type, frame_data, loop)
                        del buffer[: length + 2]
                    else:
                        print(f"DEBUG: CRC Fail on type {hex(frame_type)}")
                        buffer.pop(0)
            except Exception as e:
                print(f"DEBUG: Loop Error: {e}")
                break

    def _parse_frame(self, frame_type, data, loop):
        try:
            # --- 0x08: BATTERY ---
            if frame_type == 0x08:
                if len(data) == 8:
                    v = (data[0] << 8) | data[1]
                    i = (data[2] << 8) | data[3]
                    cap = (data[4] << 16) | (data[5] << 8) | data[6]
                    rem = data[7]
                    self.state["battery"] = {
                        "voltage": v / 10.0,
                        "current": i / 10.0,
                        "capacity": cap,
                        "remaining": rem,
                    }
                    self._queue_update("BATTERY", self.state["battery"], loop)

            # --- 0x1E: ATTITUDE ---
            elif frame_type == 0x1E:
                p, r, y = struct.unpack(">hhh", data)
                self.state["attitude"] = {
                    "pitch": p / 10000.0,
                    "roll": r / 10000.0,
                    "yaw": y / 10000.0,
                }
                self._queue_update("ATTITUDE", self.state["attitude"], loop)

            # --- 0x02: GPS ---
            elif frame_type == 0x02:
                lat, lon, gs, hdg, alt, sats = struct.unpack(">iiHHHB", data)
                self.state["gps"] = {
                    "lat": lat / 1e7,
                    "lon": lon / 1e7,
                    "gs": gs,  # Ground Speed
                    "hdg": hdg / 100.0,  # Heading
                    "alt": alt - 1000,
                    "sats": sats,
                }
                self._queue_update("GPS", self.state["gps"], loop)

            # --- 0x14: LINK STATISTICS ---
            elif frame_type == 0x14:
                # Uplink RSSI: Ant1, Ant2 (if avail).
                # Basic parsing for standard CRSF Link stats:
                # Byte 0: Uplink RSSI 1 (dBm, signed)
                # Byte 1: Uplink RSSI 2
                # Byte 2: Uplink Link Quality (%)
                # Byte 3: Uplink SNR (dB)
                # ... (Active Antenna, RF Mode, TX Power etc)

                uplink_rssi = data[0] if data[0] < 128 else data[0] - 256
                lq = data[2]
                tx_power = 0  # Parse further if needed

                self.state["link"] = {"rssi": uplink_rssi, "lq": lq, "raw": data.hex()}
                print(f"DEBUG: Link RSSI: {uplink_rssi}dBm LQ: {lq}%")
                self._queue_update("LINK", self.state["link"], loop)

            # --- 0x16: RC CHANNELS (11-bit packed) ---
            elif frame_type == 0x16:
                # Payload is 22 bytes (16 channels * 11 bits / 8)
                if len(data) == 22:
                    channels = [0] * 16
                    # 11-bit unpacking logic
                    bits_merged = int.from_bytes(data, byteorder="little")
                    for i in range(16):
                        channels[i] = (bits_merged >> (i * 11)) & 0x7FF

                    self.state["channels"] = channels
                    # print(f"DEBUG: RC Channels: {channels[:4]}") # Print first 4
                    self._queue_update("RC_CHANNELS", {"channels": channels}, loop)

            # --- 0x29: FLIGHT MODE ---
            elif frame_type == 0x29:
                # Null-terminated ASCII string
                mode_str = data.decode("utf-8", errors="ignore").strip("\x00")
                self.state["flight_mode"] = mode_str
                print(f"DEBUG: Flight Mode: {mode_str}")
                self._queue_update("FLIGHT_MODE", {"mode": mode_str}, loop)

            # --- 0x21: DEVICE PING (Device Info) ---
            elif frame_type == 0x21:
                # Usually contains dest, src, and device name
                print(f"DEBUG: Device Ping (Type 0x21) detected")

            else:
                print(f"DEBUG: Unknown Frame {hex(frame_type)} | Data: {data.hex()}")
                self._queue_update(
                    "UNKNOWN", {"type": hex(frame_type), "hex": data.hex()}, loop
                )

        except Exception as e:
            print(f"DEBUG: Parse Error on {hex(frame_type)}: {e}")

    def _queue_update(self, msg_type, data, loop):
        asyncio.run_coroutine_threadsafe(
            self.telemetry_queue.put({"type": msg_type, "data": data}), loop
        )
