# Overview  
MAVProxy is a lightweight, command-line ground control station (GCS) for MAVLink-compatible vehicles. It is designed to be portable, extendable, and developer-friendly. MAVProxy can be extended with add-on modules and has the ability to forward messages from a UAV to multiple GCS instances simultaneously.  

# Integration with Other GCS  
MAVProxy can be used alongside multiple ground stations.  
- Done by forwarding telemetry using the `--out` option, multiple GCS can receive the same data stream in real time.  
- This makes it possible to use one GCS for mission planning and another for visualization or monitoring.
   - If there is a need for visualization we can add visualization 

# Use in Our Capstone  
For our project, MAVProxy provides two key benefits:  
1. Message Multiplexing – It allows us to forward MAVLink messages to multiple endpoints (e.g., Mission Planner, our custom GUI, logging tools).  
2. Custom Extensions – We can easily implement and load custom Python modules or scripts to support our specific needs.  

# Possible Downsides  
- Command-line interface can be less intuitive than GUI-based GCS.  
- Requires careful configuration when multiple GCS are sending commands, will need to coordinate with pilots when in use.
- If joystick control is used, TCP forwarding is not recommended due to potential network lag. UDP should be used instead.  

# Implementation / Usage  

MAVProxy only requires the network or serial address of the UAV to connect. Common options include:  

- `--master`: Specifies the UAV connection (serial device, UDP, or TCP).  
- `--baudrate`: Sets baud rate for serial connections (e.g., 57600 or 115200). Check hardware documentation.  
- `--logfile`: Sets or renames the MAVLink log file.  
- `--console`: Launches the MAVProxy console view.  
- `--map`: Opens the built-in moving map.  
- `--load-module`: Loads additional modules (built-in or custom).  
- `--out`: Specifies an output stream for a GCS or GUI.  

### Example Command  
```bash
mavproxy.py --master= uav address \
            --out=gcs #1 \
            --out=gcs #2
