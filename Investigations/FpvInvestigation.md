### Possibility of using Luke's fpv hardware
The air units outputs signals from the dji remote. So to use it with ArduPilot, connect the airunit into ardupulot flight controllers SBUS/RC-in port (or any UART TX set for SBUS/"Serial rx" input). ArduPilot will then treat it just like any SBUS reveiver. This should also be autodetected by ArduPilot. So we should be able to utilize his googles.

### config 
- In Mission Planner:
  - Calibrate radio (DJI RC channels pass through SBUS).  
  - Configure RC input as SBUS.  
- Mission Planner connects via USB/telemetry radio (not through DJI).

## Limitations
- DJI goggles/OSD show limited ArduPilot fields (no flight mode text).  
- Video + RC share same link (link loss = loss of both).  
- DJI has some proprietary functionality.