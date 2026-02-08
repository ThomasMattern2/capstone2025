from flask import Flask
from flask_socketio import SocketIO
import threading
import os
import sys
import asyncio
import json

# Setup path to find Scripts directory
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
sys.path.insert(0, project_root)

# Import the TelemetryHandler
from Scripts.core.vehicle import TelemetryHandler

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

config = {"port": "COM5", "baudrate": 420000}

config_path = os.path.join(script_dir, "config.json")

if os.path.exists(config_path):
    try:
        with open(config_path, "r") as f:
            user_config = json.load(f)
            config.update(user_config)
            print(f"Configuration loaded from {config_path}")
    except Exception as e:
        print(f"Warning: Could not load config.json, using defaults. Error: {e}")
else:
    print(f"No config.json found at {config_path}, using default settings.")

vehicle = TelemetryHandler(port=config["port"], baudrate=config["baudrate"])
# ---------------------------


async def bridge():
    while True:
        try:
            msg = await vehicle.telemetry_queue.get()
            socketio.emit("vehicle_state", msg)
            vehicle.telemetry_queue.task_done()
        except Exception:
            await asyncio.sleep(0.1)


def start_loop():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    vehicle.start(loop)
    loop.create_task(bridge())
    loop.run_forever()


if __name__ == "__main__":
    threading.Thread(target=start_loop, daemon=True).start()
    # Updated to fix RuntimeError
    socketio.run(app, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)
