// app.js
// Option 1: Using audio files
//const softBeep = new Audio('soft-beep.mp3');
//const loudBeep = new Audio('loud-beep.mp3');

// Option 2: Using Web Audio API for beeps (no files required)
function playSoftBeep() {
    const ctx = new(window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 880;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
}
function playLoudBeep() {
    const ctx = new(window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 1760;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
}

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

  // Ensure timeLeft is set to duration if starting fresh
  if (typeof timeLeft === "undefined" || timeLeft <= 0) {
    timeLeft = duration;
    updateDisplay();
  }

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();

      if (timeLeft <= 5 && timeLeft > 0) {
        playSoftBeep();
      }
    } else if (timeLeft === 0) {
      playLoudBeep();

      setTimeout(() => {
        // Optional: increment round count here
        timeLeft = duration;
        updateDisplay();
      }, 500);
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
