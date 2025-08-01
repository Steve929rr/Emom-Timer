import tkinter as tk
import time
import threading
import winsound

# Settings
ROUND_DURATION = 60
BEEP_START = 55
ROUND_DISPLAY_TIME = 5

class EMOMTimer:
    def __init__(self, root):
        self.root = root
        self.root.attributes('-fullscreen', True)
        self.root.configure(bg='black')

        self.running = False
        self.round = 0

        self.label = tk.Label(root, text="", font=("Courier", 180), fg="green", bg="black")
        self.label.pack(expand=True)

        self.pause_button = tk.Button(root, text="Pause/Resume", font=("Courier", 20),
                                      command=self.toggle_pause, bg="gray", fg="white")
        self.pause_button.pack(side=tk.BOTTOM, pady=20)

        self.root.bind("<Escape>", lambda e: self.root.destroy())
        self.paused = False

    def toggle_pause(self):
        self.paused = not self.paused

    def start_timer(self):
        def run():
            self.running = True
            while self.running:
                self.round += 1
                self.show_round()
                for second in range(ROUND_DURATION):
                    if not self.running:
                        break
                    while self.paused:
                        time.sleep(0.1)

                    if second < ROUND_DISPLAY_TIME:
                        continue

                    remaining = ROUND_DURATION - second
                    color = "green" if second < 45 else "red"
                    self.update_display(str(remaining), color)

                    if second >= BEEP_START:
                        threading.Thread(target=self.beep).start()

                    time.sleep(1)

        threading.Thread(target=run).start()

    def show_round(self):
        self.update_display(f"Round {self.round}", "white")
        time.sleep(ROUND_DISPLAY_TIME)

    def update_display(self, text, color):
        self.label.config(text=text, fg=color)
        self.root.update()

    def beep(self):
        winsound.Beep(1000, 200)

# Run the timer
if __name__ == "__main__":
    root = tk.Tk()
    app = EMOMTimer(root)
    app.start_timer()
    root.mainloop()

# This is my first Git commit!
