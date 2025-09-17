from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['key'] = 'code'
socketio = SocketIO(app)

@app.route('/arm', methods=['POST'])
def arm_vehicle():
    return jsonify({'message': 'Vehicle armed successfully'}), 200

@app.route('/disarm', methods=['POST'])
def disarm_vehicle():
    return jsonify({'message': 'Vehicle disarmed successfully'}), 200


if __name__ == '__main__':

    # print(f"Attempting to connect to port: {vehicle_port}")
    # vehicle_connection = initialize.connect_to_vehicle(vehicle_port, BAUD)
    # print("Vehicle connection established.")
    # retVal = initialize.verify_connection(vehicle_connection)
    # print("Vehicle connection verified.")
    
    # if retVal != True:
        # print("Connection failed. Exiting application.")
        # exit(1)
        
    socketio.run(app, host="0.0.0.0", port=5000)