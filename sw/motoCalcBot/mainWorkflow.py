import pyautogui
import time
import platform


class ClickBot:
    def __init__(self, delay: float = 4.0):
        """
        Initialize the ClickBot.
        :param delay: Delay before performing actions (in seconds)
        """
        self.delay = delay

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


# Example usage
if __name__ == "__main__":
    time.sleep(6)
    bot = ClickBot(delay=1)
    bot.click_after_delay(50, 50)        # center the mouse
    bot.right_click_after_delay(10, 12)  # left-click on the name
    bot.click_after_delay(12, 14)        # open motor browser
    bot.press_down_after_delay()         # go to next motor
    bot.press_enter_after_delay()        # confirm next motor
    bot.highlight_and_copy(10, 12, 2, 12) # highligt and save motor
    bot.click_after_delay(25, 62)        # Compute report 
    bot.click_after_delay(44, 54)        # click ok
    bot.press_enter_after_delay()        # press Enter on report
