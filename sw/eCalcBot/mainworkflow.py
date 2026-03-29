import pyautogui
import time

class ScrollController:
    def __init__(self, step: int = -100, pause_time: float = 0.5):
        """
        Scroll automation using mouse wheel actions.

        :param step: Amount to scroll each step (negative = down, positive = up)
        :param pause_time: Time to wait between scrolls in seconds
        """
        self.step = step
        self.pause_time = pause_time

    def scroll_down(self, steps: int = 10):
        """
        Scroll down the page by simulating mouse wheel movement.

        :param steps: Number of scroll actions to perform
        """
        for _ in range(steps):
            pyautogui.scroll(self.step)
            time.sleep(self.pause_time)

    def scroll_up(self, steps: int = 10):
        """
        Scroll up the page.
        """
        for _ in range(steps):
            pyautogui.scroll(-self.step)
            time.sleep(self.pause_time)

    def continuous_scroll(self, duration: float = 10.0):
        """
        Continuously scroll down for a given duration.

        :param duration: Total scroll time in seconds
        """
        start_time = time.time()
        while time.time() - start_time < duration:
            pyautogui.scroll(self.step)
            time.sleep(self.pause_time)


if __name__ == "__main__":
    time.sleep(4)
    scroller = ScrollController(step=-200, pause_time=0.3)

    print("Scrolling down for 5 seconds...")
    scroller.continuous_scroll(duration=5)

    print("Scrolling up...")
    scroller.scroll_up(steps=5)
