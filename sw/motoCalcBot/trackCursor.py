import pyautogui
from screeninfo import get_monitors
import keyboard

# Get screen resolution
monitor = get_monitors()[0]
screen_width = monitor.width
screen_height = monitor.height

print("Press 'p' to log the current cursor position (Ctrl+C to quit)\n")

try:
    while True:
        if keyboard.is_pressed('p'):
            x, y = pyautogui.position()
            percent_x = (x / screen_width) * 100
            percent_y = (y / screen_height) * 100
            print(f"Clicked at ({x}, {y})  =>  {percent_x:.1f}% , {percent_y:.1f}%")
            # Wait until 'p' is released to avoid multiple logs
            keyboard.wait('p', suppress=False)
except KeyboardInterrupt:
    print("\nStopped tracking.")
