import sys
import os
import time
import pytest

script_dir = os.path.abspath('./../..')
sys.path.append(script_dir)

from Scripts.core.vehicle import *

# SITL tests rely on valid connection to a vehicle
@pytest.fixture()
def vehicle():
    vehicle = Vehicle()
    yield vehicle

def test_arm_disarm_vehicle(vehicle):
    assert vehicle.arm_vehicle(), "Command ACK is true"
    assert vehicle.disarm_vehicle(), "Command ACK is true"
