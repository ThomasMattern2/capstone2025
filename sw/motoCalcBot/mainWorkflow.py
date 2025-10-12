import pyautogui
import time
import platform
import random
import uuid

from maximizeSubscreen import ImageClicker

class ClickBot:
    def __init__(self, delay: float = 4.0):
        """
        Initialize the ClickBot.
        :param delay: Delay before performing actions (in seconds)
        """
        self.delay = delay
        self.maximize = ImageClicker()

    def type(self, text, delay=3):
        """Types the given string after an optional delay."""
        time.sleep(delay)
        print("typing name")
        pyautogui.typewrite(text, interval=0.05)  # interval adds slight realism


    def click_after_delay(self, x_percent: float, y_percent: float):
        """
        Waits for a delay, then left-clicks at the specified percentage position on the screen.
        :param x_percent: Horizontal click position as a percentage of screen width (0–100)
        :param y_percent: Vertical click position as a percentage of screen height (0–100)
        """
        if not (0 <= x_percent <= 100 and 0 <= y_percent <= 100):
            raise ValueError("x_percent and y_percent must be between 0 and 100")

        print(f"Waiting {self.delay} seconds before clicking...")
        time.sleep(self.delay)

        width, height = pyautogui.size()
        x = int(width * (x_percent / 100))
        y = int(height * (y_percent / 100))

        pyautogui.moveTo(x, y)
        pyautogui.click()
        print(f"Left-clicked at ({x}, {y}) — ({x_percent}% x, {y_percent}% y).")

    def right_click_after_delay(self, x_percent: float, y_percent: float):
        """
        Waits for a delay, then right-clicks at the specified percentage position.
        """
        if not (0 <= x_percent <= 100 and 0 <= y_percent <= 100):
            raise ValueError("x_percent and y_percent must be between 0 and 100")

        print(f"Waiting {self.delay} seconds before right-clicking...")
        time.sleep(self.delay)

        width, height = pyautogui.size()
        x = int(width * (x_percent / 100))
        y = int(height * (y_percent / 100))

        pyautogui.moveTo(x, y)
        pyautogui.click(button='right')
        print(f"Right-clicked at ({x}, {y}) — ({x_percent}% x, {y_percent}% y).")

    def press_enter_after_delay(self):
        """
        Waits for a delay, then presses the Enter key.
        """
        print(f"Waiting {self.delay} seconds before pressing Enter...")
        time.sleep(self.delay)
        pyautogui.press('enter')
        print("Pressed Enter key.")

    def press_down_after_delay(self):
        """
        Waits for a delay, then presses the Down Arrow key.
        """
        print(f"Waiting {self.delay} seconds before pressing Down Arrow...")
        time.sleep(self.delay)
        pyautogui.press('down')
        print("Pressed Down Arrow key.")

    # ---------------- Helper methods ---------------- #

    def _to_coordinates(self, x_percent: float, y_percent: float):
        width, height = pyautogui.size()
        x = int(width * (x_percent / 100))
        y = int(height * (y_percent / 100))
        return x, y

    def _validate_percentages(self, x_percent: float, y_percent: float):
        if not (0 <= x_percent <= 100 and 0 <= y_percent <= 100):
            raise ValueError("x_percent and y_percent must be between 0 and 100")
    
    def highlight_and_copy(self, start_x_percent: float, start_y_percent: float,
                           end_x_percent: float, end_y_percent: float):
        """
        Highlights text by clicking and dragging from start to end position, then copies to clipboard.
        :param start_x_percent: X coordinate (percent of screen width) for start of selection
        :param start_y_percent: Y coordinate (percent of screen height) for start of selection
        :param end_x_percent: X coordinate (percent of screen width) for end of selection
        :param end_y_percent: Y coordinate (percent of screen height) for end of selection
        """
        for p in (start_x_percent, start_y_percent, end_x_percent, end_y_percent):
            if not (0 <= p <= 100):
                raise ValueError("All percentage inputs must be between 0 and 100")

        print(f"Waiting {self.delay}s before highlighting text...")
        time.sleep(self.delay)

        start_x, start_y = self._to_coordinates(start_x_percent, start_y_percent)
        end_x, end_y = self._to_coordinates(end_x_percent, end_y_percent)

        pyautogui.moveTo(start_x, start_y)
        pyautogui.mouseDown()
        pyautogui.moveTo(end_x, end_y, duration=0.3)
        pyautogui.mouseUp()

        # Copy to clipboard
        if platform.system() == "Darwin":  # macOS
            pyautogui.hotkey('command', 'c')
        else:
            pyautogui.hotkey('ctrl', 'c')

        print(f"Highlighted from ({start_x}, {start_y}) to ({end_x}, {end_y}) and copied to clipboard.")

    def _delete_current_page(self):
        """delete the page after a delay"""
        self.click_after_delay(98.3, 1.2)

    def complete_static_analysis(self):
        """Use to complete the static analysis page"""
        self.maximize.click_if_found()

    def save_to_csv(self, index=None):
        """Use this to save the report to a csv"""
        print("Use to save the csv to the machine")
        self.maximize.click_if_found()
        self.click_after_delay(3.2, 91.5)
        self.click_after_delay(45, 48.1)
        time.sleep(3)
        if True:
            print("TYPING")
            self.type(f"{uuid.uuid4()}")
        else:
            print("TODO add the configurations here")
        #self.click_after_delay(60.6, 48.1)
        self.press_enter_after_delay() 
        #self._delete_current_page()


    def run_motor_sequence(self):
        """Runs the predefined sequence of clicks and key presses."""
        self.click_after_delay(50, 50)         # center the mouse
        self.right_click_after_delay(10, 12)   # left-click on the name
        self.click_after_delay(12, 14)         # open motor browser
        self.press_down_after_delay()          # go to next motor
        self.press_enter_after_delay()         # confirm next motor
        self.highlight_and_copy(10, 12, 2, 12) # highlight and save motor
        self.click_after_delay(25, 62)         # Compute report
        self.click_after_delay(44, 54)         # click ok
        time.sleep(2)
        print("Needs to maximize")
        self.maximize.click_if_found() # Maximize the static analysis page
        time.sleep(6)
        self.click_after_delay(50, 50)
        self.press_enter_after_delay()         # press Enter on report

    def reset_modo_calc(self):
        """Reset the modo calc by clicking on the side."""
        self.click_after_delay(90, 50)         # center the mouse




# Example usage
if __name__ == "__main__":
    time.sleep(6)
    bot = ClickBot(delay=1)
    #bot.type("test")
    for i in range(10):
        bot.run_motor_sequence()        # center the mouse
        time.sleep(2)
        bot.save_to_csv(i)
        #break
        bot._delete_current_page()
        bot._delete_current_page()

   
