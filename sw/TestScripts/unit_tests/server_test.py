import sys
import os
import pytest

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "../.."))
sys.path.insert(0, project_root)

from Server import server

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