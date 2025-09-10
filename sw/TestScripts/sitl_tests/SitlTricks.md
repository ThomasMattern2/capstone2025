In the console out put when you run sitl 

```
'build' finished successfully (2.307s)
SIM_VEHICLE: Using defaults from (default_params/copter.parm)
SIM_VEHICLE: Run ArduCopter
SIM_VEHICLE: "/home/tmattern/ardupilot/Tools/autotest/run_in_terminal_window.sh" "ArduCopter" "/home/tmattern/ardupilot/build/sitl/bin/arducopter" "--model" "+" "--speedup" "1" "--slave" "0" "--defaults" "default_params/copter.parm" "--sim-address=127.0.0.1" "-I0"
RiTW: Starting ArduCopter : /home/tmattern/ardupilot/build/sitl/bin/arducopter --model + --speedup 1 --slave 0 --defaults default_params/copter.parm --sim-address=127.0.0.1 -I0
SIM_VEHICLE: Run MavProxy
SIM_VEHICLE: "mavproxy.py" "--retries" "5" "--out" "172.25.176.1:14550" "--master" "tcp:127.0.0.1:5760" "--sitl" "127.0.0.1:5501" "--out" "udp:127.0.0.1:14551" "--console"
```

use this "--out" "172.25.176.1:14550" address when attempting to initialize.connect_to_vehicle in these scripts
run scripts as administrator 