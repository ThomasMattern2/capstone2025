# Vehicle Report Design

## Design Considerations
- Needs to relatively performant
  - Attitude data comes every at 10hz
  - Data needs to be as fresh as possible since it will be used for potentially flight saving operations
  - Telemetry readings need to be as up to date as possible
- Past data needs to persisted and eventually displayed
  - Graphs, logs etc
- Need to think how change detection will work
  - Need to look into the best way to do this
  - Some sort of priority could be best, ie we will likely care more about vehicle attitude vs the vehicle position and shouldn't waste time dealing with lat lon fail-safes
- Not high priority, but should work with multiple vehicles, could be cool to swarm
- Hysteresis 

## Ideas

### Loop on main thread checking the most up to date data, do operation, sleep
   - Easiest to implement
   - Blocking
   - Data could be out of date
   - Only one vehicle can realistically work
   - easy to log

#### Pros
    - Simple, easiest to implement
    - Deterministic, know exactly where and when pieces are called
    - Easy to debug
#### Cons
    - Waiting for just one message could cause delays in getting other messages
    - Outdated data could be use due to slow downs in logging/reports
    - Every piece of logic needs to be in the loop, ugly design
    - Single vehicle

### Each Vehicle object is on its own thread with a loop
   - Easiest multi vehicle solution to implement
   - Blocking
   - Data could be out of date
   - easy to log

#### Pros
    - Same as above
#### Cons
    - Same as above
    - poor scaling, for each new vehicle need new thread


### async producer/consumer pattern
   - Producer get vehicle data from vehicle and puts it into memory
   - consumer analysis data and passes it onto other services (custom failsafe)
   - Have thread which takes data and puts it onto memory
   - Have a queue which producer adds and consumer processes (last 2 seconds worth of data)
   - Have another consumer which logs data
   - Have shared state which will have the most recent reports

#### Pros   
    - Can handle attitude changes, position handling, failsafes, and logging in own consumers
    - non-blocking
    - scales well, easily add new consumers
    - cleaner architecture
    - Learn new technology
#### Cons
    - Complex
    - Little experience
    - Debugging
    - Thread safety
