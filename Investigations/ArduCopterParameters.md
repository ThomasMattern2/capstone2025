###  ArduCopter Parameters investigation

- PILOT_THR_FILT https://ardupilot.org/copter/docs/parameters.html#pilot-thr-filt-throttle-filter-cutoff
brief: Smooths out sudden throttle changes, marking drone easier to control. 


- RTL Parameters

- RTL_ALT https://ardupilot.org/copter/docs/parameters.html#rtl-alt-rtl-altitude
brief: sets the rtl flight mode altitude. Could be useful if we decide to RTL for our failsafes

- RTL_SPEED https://ardupilot.org/copter/docs/parameters.html#rtl-speed-rtl-speed
brief: Defines the speed in cm/s which the aircraft will attempt to maintain horizontally while flying home

- RTL_ALT_FINAL https://ardupilot.org/copter/docs/parameters.html#rtl-alt-final-rtl-final-altitude
brief: Defines the altitude vehicle will move to as the final stage of RTL, set to 0 to land.

- FS_GCS_ENABLE https://ardupilot.org/copter/docs/parameters.html#fs-gcs-enable-ground-station-failsafe-enable
brief: Defines which failsafe will be invoked when connection with GCS is lost for 5 seconds.
DISCUSS THIS WITH TEAM, since we are in manual mode, this might not be needed
note: FS_OPTIONS defines a few things to ignore failsafe if we are in manual mode.

- FS_THR_ENABLE https://ardupilot.org/copter/docs/parameters.html#fs-thr-enable-throttle-failsafe-enable
brief: If that signal drops below a certain threshold (FS_THR_VALUE), it assumes RC signal loss and failsafes
MUST INCLUDE

- LOG_BITMASK https://ardupilot.org/copter/docs/parameters.html#log-bitmask-log-bitmask
brief: Defines what on board log types to enable, all basic logs  set it to 65535
MUST INCLUDE

- FRAME_TYPE https://ardupilot.org/copter/docs/parameters.html#frame-type-frame-type-x-v-etc
brief: Defines the frame type of drone, use "X" 
MUST INCLUDE

- FS_EKF_ACTION https://ardupilot.org/copter/docs/parameters.html#fs-ekf-action-ekf-failsafe-action
brief: Defines action for EKF failsafe, use FS_EKF_THRESH to define tresh 
MUST INCLUDE

- FS_CRASH_CHECK https://ardupilot.org/copter/docs/parameters.html#fs-crash-check-crash-check-enable
brief: Safety feature to detect a crash, if true the drone will disarm
MUST INCLUDE

- RC_SPEED https://ardupilot.org/copter/docs/parameters.html#rc-speed-esc-update-speed
brief: controls how aggressively the drone responds to stick inputs
MUST INCLUDE

#### IMPORTANT , PILOT FIRST CLASS LSMALLWOOD PLEASE READ 

# Usually set to 0, but could set a small value for beginer to get used to 
- ACRO_BAL_ROLL https://ardupilot.org/copter/docs/parameters.html#acro-bal-roll-acro-balance-roll
brief: How much self-leveling the drone applies on roll when sticks are near center
scenario:
- You are flying in ACRO
- ACRO_BAL_ROLL = 20%
- You gently tilt the drone to the left by moving the roll stick slightly
- When stick is released the drone will try to correct and self level

- ACRO_BAL_PITCH https://ardupilot.org/copter/docs/parameters.html#acro-bal-pitch-acro-balance-pitch
Same as above but for pitch

- ACRO_TRAINER https://ardupilot.org/copter/docs/parameters.html#acro-trainer-acro-trainer
brief: Provides partial self-leveling (angle limit) assistance in ACRO mode to help pilots transition from stabilized flight to full acro
How it works: 
- When enabled, the drone behaves like a hybrid between ACRO and Stabilize modes:
- Near center stick, the drone self-levels like Stabilize mode.
- At full stick deflection, the drone gives full ACRO control.
- Essentially, it reduces the risk of flipping while you’re learning manual acro maneuvers.

- ACRO_RP_RATE https://ardupilot.org/copter/docs/parameters.html#acro-rp-rate-acro-roll-and-pitch-rate
brief: Sets the maximum angular rate (degrees per second) for roll and pitch in ACRO mode
How fast the drone can rotate
MUST INCLUDE

- ACRO_RP_EXPO https://ardupilot.org/copter/docs/parameters.html#acro-rp-expo-acro-roll-pitch-expo
brief: allow faster rotation when stick at edges, softening small stick inputs while keeping full control at the extremes

- ACRO_Y_EXPO - https://ardupilot.org/copter/docs/parameters.html#acro-y-expo-acro-yaw-expo
brief: allow faster rotation when stick at edges, softening small stick inputs while keeping full control at the extremes

- ACRO_Y_RATE_TC - https://ardupilot.org/copter/docs/parameters.html#acro-y-rate-tc-acro-yaw-rate-control-input-time-constant
brief: control input time, smooths the yaw commands so that the drone doesnt snap to max rate

- FRAME_CLASS https://ardupilot.org/copter/docs/parameters.html#frame-class-frame-class
brief: set to quad
MUST INCLUDE

- FS_VIBE_ENABLE https://ardupilot.org/copter/docs/parameters.html#fs-vibe-enable-vibration-failsafe-enable
brief: Vibration failsafe
MUST INCLUDE

### ADVANCED FAIL SAFES TODO


### ATC parameters


ATC_RAT_RLL_P
ATC_RAT_PIT_P
ATC_RAT_YAW_P

ATC_RAT_RLL_D
ATC_RAT_PIT_D

ATC_ACCEL_R_MAX
ATC_ACCEL_P_MAX
ATC_ACCEL_Y_MAX


ATC_INPUT_TC

MOT_SPIN_MAX
MOT_SPIN_MIN

PILOT_THR_FILT

MOT_THST_EXPO




- INS_GYRO_FILTER  https://ardupilot.org/copter/docs/parameters-Copter-stable-V4.1.0.html?utm_source=chatgpt.com#ins-gyro-filter-gyro-filter-cutoff-frequency
brief: Cuttoff frequency for gyroscoptes, set lower for high level of vibration

- INS_ACCEL_FILTER https://ardupilot.org/copter/docs/parameters-Copter-stable-V4.1.0.html?utm_source=chatgpt.com#ins-accel-filter-accel-filter-cutoff-frequency
brief: Cuttoff frequency for accelorometers, set lower for high level of vibration


### battery parameters 
- BATT_MONITOR https://ardupilot.org/copter/docs/parameters-Copter-stable-V4.1.0.html?utm_source=chatgpt.com#batt-monitor-battery-monitoring
brief: enables battery voltage and current

- BATT_VOLT_PIN https://ardupilot.org/copter/docs/parameters-Copter-stable-V4.1.0.html?utm_source=chatgpt.com#batt-volt-pin-battery-voltage-sensing-pin
brief: sets input for voltage monitoring

- BATT_CURR_PIN https://ardupilot.org/copter/docs/parameters-Copter-stable-V4.1.0.html?utm_source=chatgpt.com#batt-curr-pin-battery-current-sensing-pin
brief: set pin for current monitoring

- BATT_CAPACITY https://ardupilot.org/copter/docs/parameters-Copter-stable-V4.1.0.html?utm_source=chatgpt.com#batt-capacity-battery-capacity
brief: Capacity of the battery in mAh

brief: failsafe' for low batteries
- BATT_LOW_VOLT
BATT_LOW_MAH 
BATT_CRT_VOLT
BATT_CRT_MAH
MUST INCLUDE 

- BATT_ARM_VOLT https://ardupilot.org/copter/docs/parameters-Copter-stable-V4.1.0.html?utm_source=chatgpt.com#batt-arm-volt-required-arming-voltage
brief: required arming voltage 

- BATT_ARM_MAH https://ardupilot.org/copter/docs/parameters-Copter-stable-V4.1.0.html?utm_source=chatgpt.com#batt-arm-mah-required-arming-remaining-capacity
brief: required arming mah


MOT_BAT_VOLT_MAX
MOT_BAT_VOLT_MIN

