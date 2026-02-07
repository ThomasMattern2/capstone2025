from flask import Flask
from flask_socketio import SocketIO
import threading
import os
import sys
import asyncio

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
sys.path.insert(0, project_root)

from Scripts.core.vehicle import TelemetryHandler

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

vehicle = TelemetryHandler(port="COM5", baudrate=420000)


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
    socketio.run(app, host="0.0.0.0", port=5000)
