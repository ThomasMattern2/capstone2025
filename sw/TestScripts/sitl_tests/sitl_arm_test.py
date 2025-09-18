import sys
import os
import time
import pytest

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "../.."))
sys.path.insert(0, project_root)

from Scripts.core.vehicle import *

# SITL tests rely on valid connection to a vehicle
@pytest.fixture()
def vehicle():
    vehicle = Vehicle()
    yield vehicle

def test_arm_disarm_vehicle(vehicle):
    assert vehicle.arm_vehicle(), "Command ACK is true"
    assert vehicle.disarm_vehicle(), "Command ACK is true"
