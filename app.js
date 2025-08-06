
   // Option 2: Using Web Audio API for beeps (no files required)
let audioCtx;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}
function playSoftBeep() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 880;
  osc.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function playLoudBeep() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 1760;
  osc.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
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
    console.log(`timeLeft: ${timeLeft}, currentRound: ${currentRound}, totalRounds: ${totalRounds}`);

    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
      if (timeLeft <= 5 && timeLeft > 0) {
        console.log("Playing soft beep");
        playSoftBeep();
      }
    } else {
      console.log("Playing loud beep");
      playLoudBeep();
      currentRound++;
      document.getElementById('round-counter').textContent = `Round: ${currentRound}`;

      if (currentRound > totalRounds) {
        clearInterval(timerInterval);
        running = false;
        document.getElementById('timer').textContent = "DONE!";
        console.log("Timer done");
      } else {
        timeLeft = roundDuration;
        updateDisplay();
      }
    }
  }, 1000);

}

document.getElementById('start-btn').addEventListener('click', () => {
  initAudioContext();    // Unlock audio on mobile
  initializeTimer();     // Start timer
});



//function pauseTimer() {
//  running = false;
//  clearInterval(timerInterval);
//}

//document.getElementById('start').onclick = startTimer;
//document.getElementById('pause').onclick = pauseTimer;

//updateDisplay();
