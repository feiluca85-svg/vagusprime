// --- BREATHING.JS (VISUALIZER RESPIRAZIONE VAGALE & COERENZA CARDIACA) ---

let breathingActive = false;
let breathingInterval = null;
let currentMode = '478'; // '478' or '55'
let currentPhaseIndex = 0;
let phaseSecondsLeft = 0;
let completedCycles = 0;
let audioEnabled = true;

// Web Audio API Synth per Chime rilassante (Zero dipendenze esterne!)
let audioCtx = null;

function playSoftChime(freq = 432) {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 1.3);
  } catch (e) {
    console.warn('Audio non supportato o bloccato:', e);
  }
}

// Configurazione Fasi
const PHASES = {
  '478': [
    { name: 'Inspira', duration: 4, scale: 1.35, color: '#06b6d4', freq: 432 },
    { name: 'Trattieni', duration: 7, scale: 1.35, color: '#8b5cf6', freq: 528 },
    { name: 'Espira', duration: 8, scale: 1.0, color: '#10b981', freq: 396 }
  ],
  '55': [
    { name: 'Inspira', duration: 5, scale: 1.3, color: '#06b6d4', freq: 432 },
    { name: 'Espira', duration: 5, scale: 1.0, color: '#10b981', freq: 396 }
  ]
};

function setBreathingMode(mode) {
  currentMode = mode;
  stopBreathing();
  
  const btn478 = document.getElementById('btn-mode-478');
  const btn55 = document.getElementById('btn-mode-55');

  if (mode === '478') {
    btn478.className = 'px-4 py-2 text-xs font-bold rounded-lg bg-violet-600 text-white transition';
    btn55.className = 'px-4 py-2 text-xs font-medium text-gray-400 hover:text-white rounded-lg transition';
  } else {
    btn55.className = 'px-4 py-2 text-xs font-bold rounded-lg bg-violet-600 text-white transition';
    btn478.className = 'px-4 py-2 text-xs font-medium text-gray-400 hover:text-white rounded-lg transition';
  }

  document.getElementById('breathingPhase').textContent = 'Pronto';
  document.getElementById('breathingTimer').textContent = PHASES[mode][0].duration;
}

function toggleBreathing() {
  if (breathingActive) {
    stopBreathing();
  } else {
    startBreathing();
  }
}

function startBreathing() {
  breathingActive = true;
  currentPhaseIndex = 0;
  const phases = PHASES[currentMode];
  phaseSecondsLeft = phases[0].duration;
  
  const btn = document.getElementById('btnBreathingToggle');
  btn.innerHTML = `<i data-lucide="pause" class="w-4 h-4"></i> Pausa Sessione`;
  btn.classList.replace('bg-violet-600', 'bg-rose-600');
  btn.classList.replace('hover:bg-violet-500', 'hover:bg-rose-500');
  if (window.lucide) lucide.createIcons();

  applyPhaseUI(phases[0]);
  playSoftChime(phases[0].freq);

  breathingInterval = setInterval(() => {
    phaseSecondsLeft--;
    document.getElementById('breathingTimer').textContent = phaseSecondsLeft;

    if (phaseSecondsLeft <= 0) {
      currentPhaseIndex++;
      if (currentPhaseIndex >= phases.length) {
        currentPhaseIndex = 0;
        completedCycles++;
        document.getElementById('completedCyclesCount').textContent = completedCycles;
      }
      const nextPhase = phases[currentPhaseIndex];
      phaseSecondsLeft = nextPhase.duration;
      applyPhaseUI(nextPhase);
      playSoftChime(nextPhase.freq);
    }
  }, 1000);
}

function stopBreathing() {
  breathingActive = false;
  clearInterval(breathingInterval);
  
  const btn = document.getElementById('btnBreathingToggle');
  if (btn) {
    btn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i> Inizia Sessione`;
    btn.classList.replace('bg-rose-600', 'bg-violet-600');
    btn.classList.replace('hover:bg-rose-500', 'hover:bg-violet-500');
    if (window.lucide) lucide.createIcons();
  }

  const ring = document.getElementById('breathingRing');
  if (ring) {
    ring.style.transform = 'scale(1)';
    ring.style.borderColor = 'rgba(139, 92, 246, 0.3)';
    ring.style.boxShadow = '0 0 40px rgba(139, 92, 246, 0.2)';
  }
  document.getElementById('breathingPhase').textContent = 'Pronto';
  document.getElementById('breathingTimer').textContent = PHASES[currentMode][0].duration;
}

function applyPhaseUI(phase) {
  const ring = document.getElementById('breathingRing');
  const phaseLabel = document.getElementById('breathingPhase');
  const timerLabel = document.getElementById('breathingTimer');

  phaseLabel.textContent = phase.name;
  phaseLabel.style.color = phase.color;
  timerLabel.textContent = phase.duration;

  ring.style.transition = `transform ${phase.duration}s cubic-bezier(0.4, 0, 0.2, 1), box-shadow ${phase.duration}s ease, border-color ${phase.duration}s ease`;
  ring.style.transform = `scale(${phase.scale})`;
  ring.style.borderColor = phase.color;
  ring.style.boxShadow = `0 0 50px ${phase.color}40`;
}

function toggleAudioChime() {
  audioEnabled = !audioEnabled;
  const btn = document.getElementById('btnAudioToggle');
  btn.innerHTML = audioEnabled 
    ? `<i data-lucide="volume-2" class="w-4 h-4 text-emerald-400"></i>`
    : `<i data-lucide="volume-x" class="w-4 h-4 text-gray-500"></i>`;
  if (window.lucide) lucide.createIcons();
}
