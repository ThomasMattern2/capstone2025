import sys
import os

script_dir = os.path.abspath('./../..')
sys.path.append(script_dir)

import Scripts.core.initialize as initialize
import Scripts.core.arm as arm

class Vehicle:
    def __init__(self, vehicle_connection_address='udpin:172.25.176.1:14550'):
        self.vehicle_connection = initialize.connect_to_vehicle(vehicle_connection_address)
        self.verify_connection = initialize.verify_connection(self.vehicle_connection)

    def arm_vehicle(self):
        return arm.arm(self.vehicle_connection)

    def disarm_vehicle(self):
        return arm.disarm(self.vehicle_connection)