import pyautogui
import time
import cv2

class CheckPropeller:
    def __init__(self, confidence=0.8, check_interval=1.0):
        """
        Initializes the Propeller checker and clicker.

        :param confidence: Match confidence (0–1). Higher = stricter match.
        :param check_interval: Time between retries (seconds).
        """
        self.confidence = confidence
        self.check_interval = check_interval

    def click_propeller(self, image_path: str, timeout: float = 10.0):
        """
        Searches for the Propeller dropdown image on screen and clicks it if found.

        :param image_path: File path to reference image (.png, .jpg)
        :param timeout: Max seconds to search before giving up
        :return: True if clicked, False if not found
        """
        start_time = time.time()

        while time.time() - start_time < timeout:
            location = pyautogui.locateOnScreen(image_path, confidence=self.confidence)
            if location:
                center = pyautogui.center(location)
                
                center = (center.x + 100, center.y)  # make a new tuple
                pyautogui.moveTo(center)
                pyautogui.click()
                print(f"✅ Clicked Propeller at {center}")
                return True

            time.sleep(self.check_interval)

        print(f"❌ Propeller not found within {timeout}s")
        return False
    
    def select_next_and_confirm(self, delay: float = 0.2):
        """
        Presses the down arrow key once, then Enter.

        :param delay: Delay between key presses (seconds)
        """
        pyautogui.press('down')
        time.sleep(delay)
        pyautogui.press('enter')
        print("⬇️ Pressed Down + Enter")


if __name__ == "__main__":
    time.sleep(4)
    checker = CheckPropeller(confidence=0.85)
    checker.click_propeller("propeller.png", timeout=10)
    checker.select_next_and_confirm()
