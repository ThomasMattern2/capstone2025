from pymavlink import mavutil

def verify_connection(vehicle_connection):
    try:
        vehicle_connection.wait_heartbeat()
        return True
    except Exception as e:
        print(f"Error in verify_connection()! -> {e}")
        return False

def connect_to_vehicle(port='172.23.192.1:14500'):
    try:
        vehicle_connection = mavutil.mavlink_connection(port)
        if verify_connection(vehicle_connection):
            return vehicle_connection
        else:
            print("Invalid connection! Exiting...")
            exit(1)
    except Exception as e:
        print(f"Error in function: connect_to_vehicle()! -> {e}")