from pymavlink import mavutil

def arm(vehicle_connection) -> bool:
    try:
        vehicle_connection.mav.command_long_send(
            target_system=vehicle_connection.target_system,
            target_component=vehicle_connection.target_component,
            command=mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            confirmation=0,
            param1=1,
            param2=0,
            param3=0,
            param4=0,
            param5=0,
            param6=0,
            param7=0
        )

        msg = vehicle_connection.recv_match(type='COMMAND_ACK', blocking=False, timeout=3)
        return msg and msg.command == 400 and msg.result == 0

    except Exception as e:
        print(f"Error in function: arm() = {e}")
        return False

def disarm(vehicle_connection) -> bool:
    try:
        vehicle_connection.mav.command_long_send(
            target_system=vehicle_connection.target_system,
            target_component=vehicle_connection.target_component,
            command=mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            confirmation=0,
            param1=0,
            param2=0,
            param3=0,
            param4=0,
            param5=0,
            param6=0,
            param7=0
        )

        msg = vehicle_connection.recv_match(type='COMMAND_ACK', blocking=False, timeout=3)
        print(msg)
        return msg and msg.command == 400 and msg.result == 0

    except Exception as e:
        print(f"Error in function: disarm() = {e}")
        return False