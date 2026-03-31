import pyautogui
import time

class ImageClicker:
    def __init__(self, image_path="maximizeSubscreen.png", confidence=0.8):
        """
        Handles locating and clicking a specific part on the screen.

        Args:
            image_path (str): Default image file to search for.
            confidence (float): Default confidence level for matching.
        """
        self.image_path = image_path
        self.confidence = confidence

    def click_if_found(self, delay=0):
        """Search for the image on the screen and click it if found."""
        time.sleep(delay)
        location = pyautogui.locateCenterOnScreen(self.image_path, confidence=self.confidence)

        if location:
            pyautogui.click(location)
            print(f"✅ Clicked '{self.image_path}' at {location}")
            return True
        else:
            print(f"❌ '{self.image_path}' not found on screen.")
            return False





if __name__ == "__main__":
    time.sleep(2)
    clicker = ImageClicker()
    clicker.click_if_found()
