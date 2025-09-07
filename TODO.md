- Ramp software devs on what basics are needed for ardupilot development
  - Mission planner, mavlink, sitl, etcs, wire shark
- Software technologies? pymavlink, python gui?, react?
- Software design?
- tuning investigation (very high level and will take significant time)
- Plan mvp

BARE MINIMUM TO START DEVELOPMENT OF REGULAR FEATURES
- Get a custom script sending messages to sitl
 - Add an example test script
- Get mavproxy working with custom script and gcs
- Get basic GUI hooked up to test script. This should now be a simulated end to end 
END BARE MINIMUM TO START DEVELOPMENT OF REGULAR FEATURES

- Implement flight monitoring. This will unblock alot of things below
- Start implementing flight envelop
- Start implementing arducopter failsafes
- start implementing parameter management

Done:
- Research MavProxy
- General Design of how we are going to interface with autopilots
- flight control and Safety features high level investigation
  - Emergency recovery systems
  - flight envelope
  - situational awarness
- flight mode investigation