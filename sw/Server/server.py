from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
import time
import threading
import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
sys.path.insert(0, project_root)

from Scripts.core.vehicle import *

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['key'] = 'code'
socketio = SocketIO(app)

# probably move this out of server logic
vehicle = Vehicle()

@app.route('/arm', methods=['POST'])
def arm_vehicle():
    vehicle.arm_vehicle()
    return jsonify({'message': 'Vehicle armed successfully'}), 200

@app.route('/disarm', methods=['POST'])
def disarm_vehicle():
    vehicle.disarm_vehicle()
    return jsonify({'message': 'Vehicle disarmed successfully'}), 200


def telemetry_thread():
    while True:
        msg_type = "GPS_RAW_INT"
        data = {"roll": 10, "pitch": 10, "yaw": 10}

        if data:
            socketio.emit("vehicle_state", {"type": msg_type, "data": data})

        time.sleep(0.1)

threading.Thread(target=telemetry_thread, daemon=True).start()

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000)