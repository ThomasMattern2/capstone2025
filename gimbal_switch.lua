local RC_CHANNEL = 6
local MOUNT_INSTANCE = 0
local PITCH_HORIZONTAL = 0
local PITCH_VERTICAL = -90
local PWM_THRESHOLD = 1500
local current_state = -1 

function update()
    local pwm = rc:get_pwm(RC_CHANNEL)

    if not pwm then
        return update, 200
    end

    local desired_state = 0
    if pwm > PWM_THRESHOLD then
        desired_state = 1
    else
        desired_state = 0
    end

    if desired_state ~= current_state then
        local target_pitch = PITCH_HORIZONTAL
        if desired_state == 1 then
            target_pitch = PITCH_VERTICAL
        end

        local success = mount:set_angle_target(MOUNT_INSTANCE, 0, target_pitch, 0, false)
        
        if success then
            gcs:send_text(6, "Gimbal: Switched to " .. tostring(target_pitch) .. " deg")
            current_state = desired_state
        else
            gcs:send_text(4, "Gimbal Script: Failed to command mount. Check config.")
        end
    end
    return update, 100
end

gcs:send_text(6, "ELRS Gimbal Switch Script Initialized")
return update, 1000