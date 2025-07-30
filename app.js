
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

let timeLeft;
let timerInterval = null;
let running = false;
let totalRounds = 0;
let currentRound = 1;
let roundDuration = 60;

function updateDisplay() {
  if (timeLeft >= 0) {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
  }
}

function initializeTimer() {
  if (timerInterval) clearInterval(timerInterval); // Reset if already running

  totalRounds = parseInt(document.getElementById('rounds').value);
  roundDuration = parseInt(document.getElementById('duration').value);
  currentRound = 1;
  //document.getElementById('round-counter').textContent = `Round: ${currentRound}`;

  timeLeft = roundDuration;
  running = true;

  // Set initial round display
  document.getElementById('round-counter').textContent = `Round: ${currentRound}`;
  updateDisplay();
  updateDisplay();

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
      if (timeLeft <= 5 && timeLeft > 0) {
        playSoftBeep();
      }
    } else {
      playLoudBeep();
      currentRound++;
      document.getElementById('round-counter').textContent = `Round: ${currentRound}`;


      if (currentRound > totalRounds) {
        clearInterval(timerInterval);
        running = false;
        document.getElementById('timer').textContent = "DONE!";
      } else {
        timeLeft = roundDuration;
        updateDisplay();
      }
    }
  }, 1000);
}


//function pauseTimer() {
//  running = false;
//  clearInterval(timerInterval);
//}

//document.getElementById('start').onclick = startTimer;
//document.getElementById('pause').onclick = pauseTimer;

//updateDisplay();
