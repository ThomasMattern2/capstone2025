# Periodic messages supported in ArduCopter

## HEARTBEAT
https://mavlink.io/en/messages/common.html#HEARTBEAT
- Sent at 1hz (1s), no useful information other than showing autopilot is available

## ATTITUDE
https://mavlink.io/en/messages/common.html#ATTITUDE
- Sent at 10hz (0.1s), provides vehicles roll, pitch, yaw, rollspeed, pitchspeed, yawspeed
- Will be essential for flight envelope and custom fail safes
- Need to design software around these values

## GLOBAL_POSITION_INT
https://mavlink.io/en/messages/common.html#GLOBAL_POSITION_INT
- Sent at 1hz (1s), gps position in lat/lon and altitude
- Will also need to capture these values in the software and keep them succinct 

## SYS_STATUS
https://mavlink.io/en/messages/common.html#SYS_STATUS
- Various electrical data, voltage, current , battery
- Will be useful for graphing 

## Investigation actions
- Create github issues to create a system which holds up to date state of attitude, heartbeat, global position int, sys status