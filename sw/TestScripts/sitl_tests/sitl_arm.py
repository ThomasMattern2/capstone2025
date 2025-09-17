import sys
import os
import time

script_dir = os.path.abspath('./../..')
sys.path.append(script_dir)

import Scripts.core.initialize as initialize
import Scripts.core.arm as arm

vehicle_connection = initialize.connect_to_vehicle('udpin:172.25.176.1:14550')

arm.arm(vehicle_connection)
time.sleep(3)
arm.disarm(vehicle_connection)

