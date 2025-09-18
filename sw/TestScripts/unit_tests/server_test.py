import sys
import os
import pytest

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "../.."))
sys.path.insert(0, project_root)

from Server import server
from flask_socketio import SocketIO
from unittest.mock import patch


@pytest.fixture()
def app():
    app = server.app
    app.config.update({
        "TESTING": True,
    })
    yield app

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()

def test_arm(client):
    response = client.post("/arm")
    assert response.status_code == 200
    assert b"Vehicle armed successfully" in response.data

def test_disarm(client):
    response = client.post("/disarm")
    assert response.status_code == 200
    assert b"Vehicle disarmed successfully" in response.data

# Helper
def run_telemetry_once():
    # Dummy Data
    msg_type = "GPS_RAW_INT"
    data = {"roll": 10, "pitch": 10, "yaw": 10}
    if data:
        # Emit vehicle state
        server.socketio.emit("vehicle_state", {"type": msg_type, "data": data})

def test_telemetry_emit():
    with patch.object(server.socketio, 'emit') as emit_mock:
        run_telemetry_once()
        emit_mock.assert_called_once_with(
            "vehicle_state",
            {"type": "GPS_RAW_INT", "data": {"roll": 10, "pitch": 10, "yaw": 10}}
        )