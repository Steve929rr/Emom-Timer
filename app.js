// app.js
let duration = 60; // seconds per round
let timeLeft = duration;
let timerInterval = null;
let running = false;

function updateDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (running) return;
  running = true;
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
      if (timeLeft === 0) {
        // Optional: beep or alert
        alert('Next round!');
        timeLeft = duration;
      }
    }
  }, 1000);
}

function pauseTimer() {
  running = false;
  clearInterval(timerInterval);
}

document.getElementById('start').onclick = startTimer;
document.getElementById('pause').onclick = pauseTimer;

updateDisplay();
