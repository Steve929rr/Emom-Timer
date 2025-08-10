import tkinter as tk
from tkinter import messagebox
import threading
import time
import winsound

ROUND_DURATION = 60
BEEP_START = ROUND_DURATION - 5
ROUND_DISPLAY_TIME = 5

WORKOUTS = {
    "HYROX EMOM": ["Jump Squat", "Push Up", "RDL", "Push, Press", "Farmers Walk", "Tempo Squat"],
    "Mobility/Core": ["Dead Bug", "Glute Bridge", "Side Steps", "Step-ups", "RDLs", "Prone Y Raises", "OHP"],
}

class EMOMTimer:
    def __init__(self, root, selected_workouts_with_rounds):
        self.root = root
        self.root.attributes('-fullscreen', True)
        self.root.configure(bg='black')
        self.running = False
        self.paused = False

        self.label = tk.Label(root, text="", font=("Courier", 120), fg="green", bg="black", wraplength=1000, justify="center")
        self.label.pack(expand=True)

        self.pause_button = tk.Button(root, text="Pause/Resume", font=("Courier", 20),
                                      command=self.toggle_pause, bg="gray", fg="white")
        self.pause_button.pack(side=tk.BOTTOM, pady=20)

        self.root.bind("<Escape>", lambda e: self.root.destroy())

        # List of tuples: (workout_name, rounds)
        self.workouts_with_rounds = selected_workouts_with_rounds

        self.current_workout_index = 0
        self.current_round_in_workout = 0
        self.exercise_index = 0

    def toggle_pause(self):
        self.paused = not self.paused

    def start_timer(self):
        def run():
            self.running = True
            while self.running and self.current_workout_index < len(self.workouts_with_rounds):
                workout_name, rounds = self.workouts_with_rounds[self.current_workout_index]
                workout = WORKOUTS[workout_name]

                if self.current_round_in_workout >= rounds:
                    # Move to next workout
                    self.current_workout_index += 1
                    self.current_round_in_workout = 0
                    self.exercise_index = 0
                    continue

                # Get current exercise
                exercise = workout[self.exercise_index]

                display_text = f"{workout_name}\nRound {self.current_round_in_workout + 1}\n{exercise}"
                self.update_display(display_text, "white")
                time.sleep(ROUND_DISPLAY_TIME)

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

                # Move to next exercise or next round
                self.exercise_index += 1
                if self.exercise_index >= len(workout):
                    self.exercise_index = 0
                    self.current_round_in_workout += 1

            # Finished all workouts
            self.update_display("Workout Complete!", "yellow")

        threading.Thread(target=run).start()

    def update_display(self, text, color):
        self.label.config(text=text, fg=color)
        self.root.update()

    def beep(self):
        winsound.Beep(1000, 200)

class WorkoutSelector:
    def __init__(self, root):
        self.root = root
        self.root.title("Select Workouts")
        self.root.geometry("450x350")

        self.vars = {}
        self.round_vars = {}

        tk.Label(root, text="Select workouts and rounds:", font=("Arial", 16)).pack(pady=10)

        for workout_name in WORKOUTS.keys():
            frame = tk.Frame(root)
            frame.pack(anchor="w", padx=20, pady=5)

            var = tk.BooleanVar()
            chk = tk.Checkbutton(frame, text=workout_name, variable=var, font=("Arial", 14))
            chk.pack(side=tk.LEFT)

            rounds_var = tk.StringVar(value="1")
            rounds_entry = tk.Entry(frame, textvariable=rounds_var, width=3, font=("Arial", 14))
            rounds_entry.pack(side=tk.LEFT, padx=10)

            rounds_label = tk.Label(frame, text="round(s)", font=("Arial", 12))
            rounds_label.pack(side=tk.LEFT)

            self.vars[workout_name] = var
            self.round_vars[workout_name] = rounds_var

        btn_frame = tk.Frame(root)
        btn_frame.pack(pady=20)

        start_btn = tk.Button(btn_frame, text="Start Timer", command=self.start_timer, font=("Arial", 14), bg="green", fg="white")
        start_btn.pack(side=tk.LEFT, padx=10)

        quit_btn = tk.Button(btn_frame, text="Quit", command=root.destroy, font=("Arial", 14), bg="red", fg="white")
        quit_btn.pack(side=tk.LEFT, padx=10)

    def start_timer(self):
        selected = []
        for name, var in self.vars.items():
            if var.get():
                rounds_str = self.round_vars[name].get()
                try:
                    rounds = int(rounds_str)
                    if rounds < 1:
                        raise ValueError
                except ValueError:
                    messagebox.showerror("Invalid input", f"Rounds for {name} must be a positive integer.")
                    return
                selected.append((name, rounds))

        if not selected:
            messagebox.showwarning("No selection", "Please select at least one workout.")
            return

        self.root.destroy()

        timer_root = tk.Tk()
        app = EMOMTimer(timer_root, selected)
        app.start_timer()
        timer_root.mainloop()

if __name__ == "__main__":
    root = tk.Tk()
    selector = WorkoutSelector(root)
    root.mainloop()

