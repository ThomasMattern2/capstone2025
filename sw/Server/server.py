from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit

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


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000)