to run a script 

1. Boot up a WSL terminal and start sitl using this command `python3 sim_vehicle.py -v ArduCopter --console --out=udp:172.25.183.136:14551 --no-mavproxy`
2. In another WSL terminal Run `mavproxy.py --retries 5 --out 172.25.176.1:14550 --master tcp:127.0.0.1:5760 --sitl 127.0.0.1:5501 --out udp:172.25.183.136:14551 --console`
3. Open mission planner, default configuration will work
4. Run custom python script