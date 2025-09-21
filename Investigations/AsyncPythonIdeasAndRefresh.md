async = defines a coroutine (a function that can be run by event loop).
await = pauses the current coroutine until the awaited coroutine is finished
get_event_loop = grabs main event loop
telemetry_queue.put = submits a coroutine

```
async def main();
    await task() # waits for task to finish before main is ran
```


```
# will have to handle all messages from AP 
def mavlink_thread_producer():
    loop = asyncio.get_event_loop()
    while True:
        msg = master.recv_match(blocking=True)
        if msg:
            asyncio.run_coroutine_threadsafe(telemetry_queue.put(msg), loop)
```


will go in vehicle.py


```
async def dispatcher(self, msg):
    """Send every message to all relevant queues."""
    # Put the message in each consumer's queue
    await asyncio.gather(
        self.attitude_queue.put(msg),
        self.position_queue.put(msg),
        self.logging_queue.put(msg),
        self.websocket_queue.put(msg)
    )

    # Update shared state (snapshot) for quick readers
    if msg.get_type() == "ATTITUDE":
        self.state["attitude"] = (msg.roll, msg.pitch, msg.yaw)
        self.state["timestamp"] = msg._timestamp
    elif msg.get_type() == "GLOBAL_POSITION_INT":
        self.state["position"] = (msg.lat, msg.lon, msg.alt)
        self.state["timestamp"] = msg._timestamp


async def attitude_consumer():
    latest = None
    while True:
        msg = await telemetry_queue.get()
        if msg.get_type() == "ATTITUDE":
            roll, pitch, yaw = msg.roll, msg.pitch, msg.yaw
            latest = (roll, pitch, yaw)
        telemetry_queue.task_done()

async def position_consumer():
    latest = None
    while True:
        msg = await telemetry_queue.get()
        if msg.get_type() == "GLOBAL_POSITION_INT":
            lat, lon, alt = msg.lat, msg.lon, msg.alt
            # use for failsafe checks
            latest = (lat, lon, alt)
        telemetry_queue.task_done()

async def logging_consumer():
    latest = None
    while True:
        msg = await telemetry_queue.get()
        if msg.get_type() == "GLOBAL_POSITION_INT":
            lat, lon, alt = msg.lat, msg.lon, msg.alt
            # add to logs
            latest = (lat, lon, alt)
        telemetry_queue.task_done()
```
