from pymavlink import mavutil

def arm(vehicle_connection):
    # PROMISES: The vehicle will be armed
    # REQUIRES: Vehicle connection
    try:
        vehicle_connection.mav.command_long_send( # Specify COMMAND_LONG
            target_system=vehicle_connection.target_system, # Specify vehicle target system
            target_component=vehicle_connection.target_component, # Specify the vehicle target component
            command=mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, # Specify arm/disarm command
            confirmation=0, # Confirmation - 0: First transmission of this cmd, 1-255: Confirmation transmissions (e.g. kill)
            param1=1, # Param 1 - Arm/Disarm Control [0: Disarm, 1: Arm]
            param2=0, # Param 2 - Force Arm [0: Arm-disarm unless prevented  by safety checks (i.e. when landed), 21196: Force arm/disarm to override preflight check and disarm during flight]
            param3=0, # Param 3 - Unused, set to zero to populate all 7 parameters
            param4=0, # Param 4 - Unused, set to zero to populate all 7 parameters
            param5=0, # Param 5 - Unused, set to zero to populate all 7 parameters
            param6=0, # Param 6 - Unused, set to zero to populate all 7 parameters
            param7=0 # Param 7 - Unused, set to zero to populate all 7 parameters
        )

        msg = vehicle_connection.recv_match(type='COMMAND_ACK', blocking=True, timeout=5) # Print ACK to confirm successful execution
        print(msg)
    except Exception as e:
        print(f"Error in function: arm() from file: General/Operations/arm.py -> {e}")

def disarm(vehicle_connection):
    # PROMISES: The vehicle will be disarmed
    # REQUIRES: Vehicle connection
    try:
        vehicle_connection.mav.command_long_send( # Specify COMMAND_LONG
            target_system=vehicle_connection.target_system, # Specify vehicle target system
            target_component=vehicle_connection.target_component, # Specify the vehicle target component
            command=mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, # Command ID (or enum of command) - In this case, arm/disarm command
            confirmation=0, # Confirmation - 0: First transmission of this cmd, 1-255: Confirmation transmissions (e.g. kill)
            param1=0, # Param 1 - Arm/Disarm Control [0: Disarm, 1: Arm]
            param2=0, # Param 2 - Force [0: Arm-disarm unless prevented  by safety checks (i.e. when landed), 21196: Force arm/disarm to override preflight checks and disarm during flight]
            param3=0, # Param 3 - Unused, set to zero to populate all 7 parameters
            param4=0, # Param 4 - Unused, set to zero to populate all 7 parameters
            param5=0, # Param 5 - Unused, set to zero to populate all 7 parameters
            param6=0, # Param 6 - Unused, set to zero to populate all 7 parameters
            param7=0 # Param 7 - Unused, set to zero to populate all 7 parameters
        )

        msg = vehicle_connection.recv_match(type='COMMAND_ACK', blocking=True, timeout=5) # Print command ACK to confirm successful execution
        print(msg)
    except Exception as e:
        print(f"Error in function: disarm() from file: General/Operations/arm.py -> {e}")