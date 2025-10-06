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
CORS(app, supports_credentials=True)
app.config["key"] = "code"
socketio = SocketIO(app, cors_allowed_origins="*")

vehicle = Vehicle(socketio)


@app.route("/arm", methods=["POST"])
def arm_vehicle():
    vehicle.arm_vehicle()
    return jsonify({"message": "Vehicle armed successfully"}), 200


@app.route("/disarm", methods=["POST"])
def disarm_vehicle():
    vehicle.disarm_vehicle()
    return jsonify({"message": "Vehicle disarmed successfully"}), 200


def start_vehicle_loop():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    vehicle.start_mavlink_thread(loop)

    loop.create_task(vehicle.multiplexing_layer(loop))
    loop.create_task(vehicle.telemetry_consumer())

    loop.run_forever()


if __name__ == "__main__":
    threading.Thread(target=start_vehicle_loop, daemon=True).start()

    socketio.run(app, host="0.0.0.0", port=5000)
