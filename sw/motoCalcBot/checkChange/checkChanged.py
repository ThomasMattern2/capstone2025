from PIL import ImageGrab
import numpy as np

class ScreenChangeDetector:
    def __init__(self, threshold=0.01):
        """
        Initialize detector.
        threshold: fraction of pixels that must change to count as 'changed'
        """
        self.threshold = threshold
        self.before = None
        self.after = None

    def capture_before(self):
        """Capture the current screen as the 'before' reference."""
        self.before = np.array(ImageGrab.grab())
        print("✅ Captured 'before' screen.")

    def capture_after(self):
        """Capture the current screen as the 'after' state."""
        self.after = np.array(ImageGrab.grab())
        print("✅ Captured 'after' screen.")

    def has_changed(self):
        """
        Compare before and after screenshots.
        Returns True if more than threshold fraction of pixels changed.
        """
        if self.before is None or self.after is None:
            raise ValueError("You must call capture_before() and capture_after() first.")

        if self.before.shape != self.after.shape:
            return True  # Different resolutions definitely changed

        diff = np.mean(self.before != self.after)
        print(f"🧩 Pixel difference: {diff:.4f}")
        return diff > self.threshold


if __name__ == "__main__":
    detector = ScreenChangeDetector(threshold=0.01)

    # Step 1: Capture the initial screen
    detector.capture_before()

    input("Make a visible change on your screen, then press Enter...")

    # Step 2: Capture the updated screen
    detector.capture_after()

    # Step 3: Compare
    if detector.has_changed():
        print("✅ Screen has changed!")
    else:
        print("❌ Screen has not changed.")
