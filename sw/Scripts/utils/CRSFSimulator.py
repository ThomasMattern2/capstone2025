import serial
import struct
import time
import random


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


def send_crsf_frame(ser, frame_type, payload):
    length = len(payload) + 2
    header = bytearray([0xC8, length, frame_type])
    frame = header + payload
    frame.append(crc8_crsf(frame[2:]))
    ser.write(frame)


def run_simulator(port):
    ser = serial.Serial(port, 420000, timeout=1)
    print(f"Simulating random CRSF data on {port}...")

    try:
        while True:
            vbat = random.randint(100, 126)
            curr = random.randint(10, 150)
            cap = random.randint(500, 1500)
            rem = random.randint(0, 100)
            bat_payload = struct.pack(">HHIB", vbat, curr, cap, rem)
            send_crsf_frame(ser, 0x08, bat_payload)

            pitch = random.randint(-500, 500)
            roll = random.randint(-500, 500)
            yaw = random.randint(0, 3600)
            att_payload = struct.pack(">hhh", pitch, roll, yaw)
            send_crsf_frame(ser, 0x1E, att_payload)

            lat = int(34.0522 * 1e7) + random.randint(-1000, 1000)
            lon = int(-118.2437 * 1e7) + random.randint(-1000, 1000)
            gs = random.randint(0, 50)
            hdg = random.randint(0, 36000)
            alt = random.randint(100, 500)
            sats = random.randint(8, 18)
            gps_payload = struct.pack(">iiHHHB", lat, lon, gs, hdg, alt, sats)
            send_crsf_frame(ser, 0x02, gps_payload)

            time.sleep(0.1)
    except KeyboardInterrupt:
        ser.close()


# run_simulator('COM10') # Change to your Virtual Port
