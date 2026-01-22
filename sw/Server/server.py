from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
import time
import threading
import os
import sys
import asyncio

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
sys.path.insert(0, project_root)

from Scripts.core.vehicle import *

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

vehicle = Vehicle(socketio, port="COM3", baudrate=420000)


def start_vehicle_loop():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    vehicle.start_crsf_thread(loop)
    loop.create_task(vehicle.telemetry_consumer())
    loop.run_forever()


if __name__ == "__main__":
    threading.Thread(target=start_vehicle_loop, daemon=True).start()
    socketio.run(app, host="0.0.0.0", port=5000)
