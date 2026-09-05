// --- VAGUSPRIME: APP.JS (VERSION v1.2.1 - REAL BIOMETRIC HARDWARE SENSOR AUTH) ---

const APP_VERSION = 'v1.2.1';
const APP_BUILD_DATE = '30 Agosto 2026';
const STORAGE_KEY = 'vagusprime_blueprint_db';
const BIOMETRIC_ENABLED_KEY = 'vagusprime_biometric_active';
const BIOMETRIC_CRED_ID_KEY = 'vagusprime_biometric_credential_id';

window.AppState = {
  db: null,
  activeTab: 'dashboard'
};

function setTxt(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val !== null && val !== undefined ? val : '--';
}

function getDefaultDatabase() {
  return {
    user: {
      subjectId: 'VP-01',
      targetWeight: 70.0,
      targetVisceralFat: 5.0,
      targetBodyFat: 14.0,
      targetMuscleMass: 58.0,
      targetRestingHR: 54,
      targetDeepSleepPercent: 25
    },
    days: [
      {
        date: "2026-08-24",
        weighTime: "07:15",
        weight: 72.9,
        bmi: 23.5,
        bodyFat: 17.2,
        skeletalMuscle: 53.5,
        fatFreeWeight: 59.8,
        subcutaneousFat: 15.0,
        visceralFat: 6.5,
        bodyWater: 59.7,
        muscleMass: 56.8,
        boneMass: 3.0,
        protein: 18.8,
        bmr: 1664,
        metabolicAge: 38,
        sleepScore: 78,
        sleepDurationHours: 7.2,
        deepSleepPercent: 18,
        remSleepPercent: 21,
        lightSleepPercent: 61,
        restingHR: 60,
        stressScore: 35,
        gelSemiLino: true,
        breakfastType: "salata",
        ruscovenPomeriggio: true,
        dinnerTime: "20:30",
        dinnerWithin20: false,
        dinnerType: "proteina_solida",
        tisanaSera: true,
        digestioneScore: 3,
        emorroidiScore: 3,
        energiaMentaleScore: 3,
        stressUmoreScore: 3,
        notes: "Inizio protocollo."
      },
      {
        date: "2026-08-25",
        weighTime: "07:12",
        weight: 72.7,
        bmi: 23.4,
        bodyFat: 17.1,
        skeletalMuscle: 53.6,
        fatFreeWeight: 59.9,
        subcutaneousFat: 14.9,
        visceralFat: 6.5,
        bodyWater: 59.8,
        muscleMass: 56.9,
        boneMass: 3.0,
        protein: 18.9,
        bmr: 1666,
        metabolicAge: 38,
        sleepScore: 80,
        sleepDurationHours: 7.4,
        deepSleepPercent: 19.5,
        remSleepPercent: 22,
        lightSleepPercent: 58.5,
        restingHR: 58,
        stressScore: 33,
        gelSemiLino: true,
        breakfastType: "dolce",
        ruscovenPomeriggio: true,
        dinnerTime: "20:10",
        dinnerWithin20: true,
        dinnerType: "proteina_solida",
        tisanaSera: true,
        digestioneScore: 4,
        emorroidiScore: 3,
        energiaMentaleScore: 4,
        stressUmoreScore: 4,
        notes: "Porridge e mele cotte."
      },
      {
        date: "2026-08-26",
        weighTime: "07:18",
        weight: 72.6,
        bmi: 23.4,
        bodyFat: 17.0,
        skeletalMuscle: 53.6,
        fatFreeWeight: 60.0,
        subcutaneousFat: 14.8,
        visceralFat: 6.0,
        bodyWater: 59.9,
        muscleMass: 57.0,
        boneMass: 3.01,
        protein: 18.9,
        bmr: 1667,
        metabolicAge: 37,
        sleepScore: 82,
        sleepDurationHours: 7.5,
        deepSleepPercent: 21,
        remSleepPercent: 22,
        lightSleepPercent: 57,
        restingHR: 56,
        stressScore: 31,
        gelSemiLino: true,
        breakfastType: "salata",
        ruscovenPomeriggio: true,
        dinnerTime: "19:55",
        dinnerWithin20: true,
        dinnerType: "uova_solida",
        tisanaSera: true,
        digestioneScore: 4,
        emorroidiScore: 4,
        energiaMentaleScore: 4,
        stressUmoreScore: 4,
        notes: "Brodo caldo e pesce bianco."
      },
      {
        date: "2026-08-27",
        weighTime: "07:14",
        weight: 72.5,
        bmi: 23.4,
        bodyFat: 17.0,
        skeletalMuscle: 53.7,
        fatFreeWeight: 60.0,
        subcutaneousFat: 14.8,
        visceralFat: 6.0,
        bodyWater: 60.0,
        muscleMass: 57.0,
        boneMass: 3.01,
        protein: 19.0,
        bmr: 1667,
        metabolicAge: 37,
        sleepScore: 83,
        sleepDurationHours: 7.6,
        deepSleepPercent: 22,
        remSleepPercent: 23,
        lightSleepPercent: 55,
        restingHR: 55,
        stressScore: 29,
        gelSemiLino: true,
        breakfastType: "dolce",
        ruscovenPomeriggio: true,
        dinnerTime: "20:00",
        dinnerWithin20: true,
        dinnerType: "proteina_solida",
        tisanaSera: true,
        digestioneScore: 4,
        emorroidiScore: 4,
        energiaMentaleScore: 4,
        stressUmoreScore: 4,
        notes: "Addome sgonfio."
      },
      {
        date: "2026-08-28",
        weighTime: "07:16",
        weight: 72.4,
        bmi: 23.3,
        bodyFat: 16.9,
        skeletalMuscle: 53.7,
        fatFreeWeight: 60.1,
        subcutaneousFat: 14.7,
        visceralFat: 6.0,
        bodyWater: 60.0,
        muscleMass: 57.1,
        boneMass: 3.01,
        protein: 19.0,
        bmr: 1668,
        metabolicAge: 37,
        sleepScore: 85,
        sleepDurationHours: 7.7,
        deepSleepPercent: 23.5,
        remSleepPercent: 23,
        lightSleepPercent: 53.5,
        restingHR: 54,
        stressScore: 27,
        gelSemiLino: true,
        breakfastType: "salata",
        ruscovenPomeriggio: true,
        dinnerTime: "19:50",
        dinnerWithin20: true,
        dinnerType: "proteina_solida",
        tisanaSera: true,
        digestioneScore: 5,
        emorroidiScore: 5,
        energiaMentaleScore: 5,
        stressUmoreScore: 5,
        notes: "Focus mentale ottimo."
      },
      {
        date: "2026-08-29",
        weighTime: "21:08",
        weight: 72.2,
        bmi: 23.3,
        bodyFat: 16.8,
        skeletalMuscle: 53.8,
        fatFreeWeight: 60.1,
        subcutaneousFat: 14.7,
        visceralFat: 6.0,
        bodyWater: 60.1,
        muscleMass: 57.1,
        boneMass: 3.01,
        protein: 19.0,
        bmr: 1669,
        metabolicAge: 37,
        sleepScore: 86,
        sleepDurationHours: 7.8,
        deepSleepPercent: 24,
        remSleepPercent: 24,
        lightSleepPercent: 52,
        restingHR: 54,
        stressScore: 25,
        gelSemiLino: true,
        breakfastType: "dolce",
        ruscovenPomeriggio: true,
        dinnerTime: "19:45",
        dinnerWithin20: true,
        dinnerType: "uova_solida",
        tisanaSera: true,
        digestioneScore: 5,
        emorroidiScore: 5,
        energiaMentaleScore: 5,
        stressUmoreScore: 5,
        notes: "Pesata bioimpedenza serale."
      },
      {
        date: "2026-08-30",
        weighTime: "08:15",
        weight: 72.1,
        bmi: 23.2,
        bodyFat: 16.7,
        skeletalMuscle: 53.9,
        fatFreeWeight: 60.2,
        subcutaneousFat: 14.6,
        visceralFat: 6.0,
        bodyWater: 60.2,
        muscleMass: 57.2,
        boneMass: 3.01,
        protein: 19.1,
        bmr: 1670,
        metabolicAge: 36,
        sleepScore: 88,
        sleepDurationHours: 7.77,
        deepSleepPercent: 23,
        remSleepPercent: 23,
        lightSleepPercent: 54,
        restingHR: 53,
        stressScore: 22,
        gelSemiLino: true,
        breakfastType: "salata",
        ruscovenPomeriggio: true,
        dinnerTime: "20:00",
        dinnerWithin20: true,
        dinnerType: "proteina_solida",
        tisanaSera: true,
        digestioneScore: 5,
        emorroidiScore: 5,
        energiaMentaleScore: 5,
        stressUmoreScore: 5,
        notes: "Punteggio sonno 88, Profondo 23%, RHR 53 bpm (42-65 bpm notturno)."
      }
    ],
    lastUpdated: new Date().toISOString()
  };
}

function loadLocalDB() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Errore lettura LocalStorage:', e);
    }
  }
  const defaultDB = getDefaultDatabase();
  saveLocalDB(defaultDB);
  return defaultDB;
}

function saveLocalDB(db) {
  db.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  window.AppState.db = db;
}

// Convert string to base64 buffer helper
function bufferToBase64(buf) {
  let bin = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return window.btoa(bin);
}

function base64ToBuffer(b64) {
  const bin = window.atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

document.addEventListener('DOMContentLoaded', () => {
  setupPullToRefresh();
  setupGlobalDragDrop();

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayDate = new Date();
  const dateFormatted = todayDate.toLocaleDateString('it-IT', options);
  setTxt('currentDateDisplay', dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1));
  setTxt('appVersionDisplay', APP_VERSION);
  setTxt('optionsVersionBadge', `${APP_VERSION} (Build ${APP_BUILD_DATE})`);

  const todayIso = todayDate.toISOString().split('T')[0];
  const pDate = document.getElementById('protocolDate');
  if (pDate) pDate.value = todayIso;
  const mDate = document.getElementById('manualDate');
  if (mDate) mDate.value = todayIso;

  window.AppState.db = loadLocalDB();
  renderAll();

  // Check and trigger biometric lock on boot
  checkBiometricLockOnStart();

  if (window.lucide) lucide.createIcons();
});

// --- HARDWARE BIOMETRIC (FINGERPRINT / TOUCH ID) AUTHENTICATION ---

async function checkBiometricLockOnStart() {
  const isEnabled = localStorage.getItem(BIOMETRIC_ENABLED_KEY) === 'true';
  const modal = document.getElementById('biometricLockModal');
  if (isEnabled && modal) {
    modal.classList.remove('hidden');
    // Prompt native hardware sensor
    setTimeout(() => {
      promptHardwareFingerprint();
    }, 300);
  }
}

window.promptHardwareFingerprint = async function() {
  const errEl = document.getElementById('biometricError');
  if (errEl) errEl.classList.add('hidden');

  if (!window.PublicKeyCredential) {
    alert('Il sensore di impronte digitali non è supportato da questo browser.');
    document.getElementById('biometricLockModal')?.classList.add('hidden');
    return;
  }

  const storedCredId = localStorage.getItem(BIOMETRIC_CRED_ID_KEY);

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    // If no credential registered yet on this device, register it first with user's fingerprint
    if (!storedCredId) {
      const userHandle = new Uint8Array(16);
      window.crypto.getRandomValues(userHandle);

      const createOptions = {
        publicKey: {
          challenge: challenge,
          rp: { name: "VagusPrime Health" },
          user: {
            id: userHandle,
            name: "vagusprime_user",
            displayName: "VagusPrime Subject VP-01"
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },  // ES256
            { alg: -257, type: "public-key" } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Native device sensor (Android Fingerprint / Touch ID)
            userVerification: "required"
          },
          timeout: 60000
        }
      };

      const credential = await navigator.credentials.create(createOptions);
      if (credential) {
        const credIdB64 = bufferToBase64(credential.rawId);
        localStorage.setItem(BIOMETRIC_CRED_ID_KEY, credIdB64);
        localStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
        document.getElementById('biometricLockModal')?.classList.add('hidden');
        updateBiometricButtonUI();
        if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
      }
    } else {
      // Prompt fingerprint for verification
      const rawIdBuffer = base64ToBuffer(storedCredId);
      const getOptions = {
        publicKey: {
          challenge: challenge,
          allowCredentials: [{
            id: rawIdBuffer,
            type: 'public-key',
            transports: ['internal']
          }],
          userVerification: 'required',
          timeout: 60000
        }
      };

      const assertion = await navigator.credentials.get(getOptions);
      if (assertion) {
        // Fingerprint verified by OS hardware!
        document.getElementById('biometricLockModal')?.classList.add('hidden');
        if (navigator.vibrate) navigator.vibrate(50);
      }
    }
  } catch (err) {
    console.error('Biometric authentication error:', err);
    if (errEl) {
      errEl.textContent = 'Impronta non riconosciuta o annullata. Tocca per riprovare.';
      errEl.classList.remove('hidden');
    }
  }
};

window.toggleBiometricAuth = async function() {
  const current = localStorage.getItem(BIOMETRIC_ENABLED_KEY) === 'true';
  if (!current) {
    // Setup and test fingerprint now
    const ok = confirm('Vuoi abilitare la protezione con IMPRONTA DIGITALE / TOUCH ID?');
    if (ok) {
      document.getElementById('biometricLockModal')?.classList.remove('hidden');
      await promptHardwareFingerprint();
    }
  } else {
    if (confirm('Vuoi disattivare il blocco con impronta digitale?')) {
      localStorage.setItem(BIOMETRIC_ENABLED_KEY, 'false');
      localStorage.removeItem(BIOMETRIC_CRED_ID_KEY);
      updateBiometricButtonUI();
      alert('Protezione con impronta digitale disattivata.');
    }
  }
};

function updateBiometricButtonUI() {
  const isEnabled = localStorage.getItem(BIOMETRIC_ENABLED_KEY) === 'true';
  const badge = document.getElementById('biometricStatusBadge');
  if (badge) {
    badge.textContent = isEnabled ? 'Attiva' : 'Disattivata';
    badge.className = isEnabled ? 'text-emerald-400 font-bold' : 'text-gray-400';
  }
}

// --- PULL TO REFRESH & SYNC GESTURE ---
function setupPullToRefresh() {
  let touchStartY = 0;
  let touchDiffY = 0;
  const indicator = document.getElementById('pullToRefreshIndicator');
  const spinner = document.getElementById('pullSpinner');
  const text = document.getElementById('pullText');

  window.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (touchStartY > 0 && window.scrollY === 0) {
      touchDiffY = e.touches[0].clientY - touchStartY;
      if (touchDiffY > 0) {
        const height = Math.min(touchDiffY * 0.45, 80);
        if (indicator) {
          indicator.style.height = `${height}px`;
          indicator.classList.add('pulling');
          if (height > 55) {
            text.textContent = 'Rilascia per sincronizzare';
            spinner.style.transform = `rotate(${height * 4}deg)`;
          } else {
            text.textContent = 'Trascina verso il basso per sincronizzare...';
          }
        }
      }
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (touchDiffY > 70 && window.scrollY === 0) {
      triggerAppSync();
    }
    if (indicator) {
      indicator.style.height = '0px';
      indicator.classList.remove('pulling');
    }
    touchStartY = 0;
    touchDiffY = 0;
  });
}

window.triggerAppSync = function() {
  const syncToast = document.getElementById('syncToast');
  if (syncToast) {
    syncToast.classList.remove('hidden');
    setTimeout(() => syncToast.classList.add('hidden'), 2200);
  }
  window.AppState.db = loadLocalDB();
  renderAll();
  if (navigator.vibrate) navigator.vibrate(50);
};

// --- GLOBAL DRAG AND DROP ANYWHERE ON PAGE ---
function setupGlobalDragDrop() {
  const overlay = document.getElementById('globalDropOverlay');
  let dragCounter = 0;

  window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    if (overlay) overlay.classList.add('active');
  });

  window.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter <= 0 && overlay) {
      overlay.classList.remove('active');
      dragCounter = 0;
    }
  });

  window.addEventListener('dragover', (e) => e.preventDefault());

  window.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    if (overlay) overlay.classList.remove('active');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const name = file.name.toLowerCase();
      if (name.includes('renpho') || name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv')) {
        if (window.handleRenphoClient) window.handleRenphoClient(file);
      } else {
        if (window.handleHuaweiClient) window.handleHuaweiClient(file);
      }
    }
  });
}

// --- OPTIONS MODAL & VERSION INFO ---
window.openOptionsModal = function() {
  updateBiometricButtonUI();
  document.getElementById('optionsModal')?.classList.remove('hidden');
};

window.closeOptionsModal = function() {
  document.getElementById('optionsModal')?.classList.add('hidden');
};

window.renderAll = function() {
  const db = window.AppState.db;
  if (!db || !db.days || db.days.length === 0) return;

  const days = db.days;
  const latestDay = days[days.length - 1];

  updateKPIs(latestDay, days);
  updateRenphoMatrix(latestDay);

  if (window.initCharts) {
    try { window.initCharts(days); } catch(e) { console.error('Errore grafici:', e); }
  }

  if (window.renderCorrelations) {
    try { window.renderCorrelations(days); } catch(e) { console.error('Errore correlazioni:', e); }
  }

  updateMedicalReport(latestDay, days);
  populateTodayForms(latestDay);

  if (window.lucide) lucide.createIcons();
};

function updateKPIs(latest, days) {
  setTxt('kpi-sleep-score', latest.sleepScore || 85);
  setTxt('kpi-deep-sleep', `${latest.deepSleepPercent || 22}%`);
  setTxt('kpi-sleep-duration', `${latest.sleepDurationHours || 7.5} h`);
  setTxt('kpi-resting-hr', latest.restingHR || 53);
  setTxt('kpi-stress', `${latest.stressScore || 22} / 100`);

  setTxt('kpi-weight', (latest.weight || 72.1).toFixed(1));
  setTxt('kpi-visceral', `Liv. ${latest.visceralFat !== undefined ? latest.visceralFat : 6.0}`);
  setTxt('kpi-muscle-kg', `${(latest.muscleMass || 57.2).toFixed(1)} kg`);

  const avgSymptom = (((latest.digestioneScore || 5) + (latest.emorroidiScore || 5)) / 2).toFixed(1);
  setTxt('kpi-symptom-score', avgSymptom);
  setTxt('kpi-mental-energy', `${latest.energiaMentaleScore || 5} / 5`);

  const hemoLabel = document.getElementById('kpi-hemorrhoid-status');
  if (hemoLabel) {
    const score = latest.emorroidiScore || 5;
    if (score >= 4) {
      hemoLabel.textContent = 'Sfiammato / Ottimo';
      hemoLabel.className = 'font-semibold text-emerald-400';
    } else if (score === 3) {
      hemoLabel.textContent = 'Leggero Fastidio';
      hemoLabel.className = 'font-semibold text-amber-400';
    } else {
      hemoLabel.textContent = 'Infiammato';
      hemoLabel.className = 'font-semibold text-rose-400';
    }
  }
}

function updateRenphoMatrix(latest) {
  setTxt('rf-date-time', `${latest.date} ${latest.weighTime ? 'ore ' + latest.weighTime : ''}`);
  setTxt('rf-weight', (latest.weight || 72.1).toFixed(2));
  setTxt('rf-bmi', (latest.bmi || 23.2).toFixed(1));
  setTxt('rf-fat-percent', (latest.bodyFat || 16.7).toFixed(1));
  setTxt('rf-sub-fat', (latest.subcutaneousFat || 14.6).toFixed(1));
  setTxt('rf-visceral', (latest.visceralFat || 6.0).toFixed(1));
  setTxt('rf-muscle-kg', (latest.muscleMass || 57.2).toFixed(2));
  setTxt('rf-skel-muscle', (latest.skeletalMuscle || 53.9).toFixed(1));
  setTxt('rf-fat-free', (latest.fatFreeWeight || 60.2).toFixed(2));
  setTxt('rf-water', (latest.bodyWater || 60.2).toFixed(1));
  setTxt('rf-protein', (latest.protein || 19.1).toFixed(1));
  setTxt('rf-bone', (latest.boneMass || 3.01).toFixed(2));
  setTxt('rf-bmr', latest.bmr || 1670);
  setTxt('rf-met-age', latest.metabolicAge || 36);
}

function populateTodayForms(todayData) {
  if (!todayData) return;

  if (document.getElementById('chk-lino')) document.getElementById('chk-lino').checked = !!todayData.gelSemiLino;
  if (todayData.breakfastType === 'salata' && document.getElementById('rad-salata')) document.getElementById('rad-salata').checked = true;
  if (todayData.breakfastType === 'dolce' && document.getElementById('rad-dolce')) document.getElementById('rad-dolce').checked = true;
  if (document.getElementById('chk-ruscoven')) document.getElementById('chk-ruscoven').checked = !!todayData.ruscovenPomeriggio;
  if (todayData.dinnerTime && document.getElementById('dinnerTimeInput')) document.getElementById('dinnerTimeInput').value = todayData.dinnerTime;
  if (todayData.dinnerType === 'proteina_solida' && document.getElementById('rad-proteina')) document.getElementById('rad-proteina').checked = true;
  if (todayData.dinnerType === 'uova_solida' && document.getElementById('rad-uova')) document.getElementById('rad-uova').checked = true;
  if (document.getElementById('chk-sedivitax')) document.getElementById('chk-sedivitax').checked = !!todayData.tisanaSera;

  if (todayData.digestioneScore && document.getElementById('range-digestione')) {
    document.getElementById('range-digestione').value = todayData.digestioneScore;
    updateSliderLabel('digestione');
  }
  if (todayData.emorroidiScore && document.getElementById('range-emorroidi')) {
    document.getElementById('range-emorroidi').value = todayData.emorroidiScore;
    updateSliderLabel('emorroidi');
  }
  if (todayData.energiaMentaleScore && document.getElementById('range-energia')) {
    document.getElementById('range-energia').value = todayData.energiaMentaleScore;
    updateSliderLabel('energia');
  }
  if (todayData.stressUmoreScore && document.getElementById('range-stress')) {
    document.getElementById('range-stress').value = todayData.stressUmoreScore;
    updateSliderLabel('stress');
  }
  if (todayData.notes && document.getElementById('symptomNotes')) {
    document.getElementById('symptomNotes').value = todayData.notes;
  }
}

function updateSliderLabel(id) {
  const range = document.getElementById(`range-${id}`);
  const label = document.getElementById(`val-${id}`);
  if (range && label) {
    label.textContent = `${range.value} / 5`;
  }
}

window.saveProtocolData = function() {
  const date = document.getElementById('protocolDate')?.value || new Date().toISOString().split('T')[0];
  const gelSemiLino = document.getElementById('chk-lino')?.checked || false;
  const breakfastType = document.querySelector('input[name="breakfastType"]:checked')?.value || 'salata';
  const ruscovenPomeriggio = document.getElementById('chk-ruscoven')?.checked || false;
  const dinnerTime = document.getElementById('dinnerTimeInput')?.value || '20:00';
  const dinnerType = document.querySelector('input[name="dinnerType"]:checked')?.value || 'proteina_solida';
  const tisanaSera = document.getElementById('chk-sedivitax')?.checked || false;
  const dinnerWithin20 = dinnerTime <= '20:15';

  const db = window.AppState.db;
  let day = db.days.find(d => d.date === date);
  if (!day) {
    day = { date };
    db.days.push(day);
  }
  Object.assign(day, { gelSemiLino, breakfastType, ruscovenPomeriggio, dinnerTime, dinnerType, dinnerWithin20, tisanaSera });
  db.days.sort((a, b) => a.date.localeCompare(b.date));
  saveLocalDB(db);
  alert('✅ Protocollo registrato con successo nel tuo dispositivo!');
  renderAll();
};

window.saveSymptomsData = function() {
  const date = document.getElementById('protocolDate')?.value || new Date().toISOString().split('T')[0];
  const digestioneScore = parseInt(document.getElementById('range-digestione')?.value || 5);
  const emorroidiScore = parseInt(document.getElementById('range-emorroidi')?.value || 5);
  const energiaMentaleScore = parseInt(document.getElementById('range-energia')?.value || 5);
  const stressUmoreScore = parseInt(document.getElementById('range-stress')?.value || 5);
  const notes = document.getElementById('symptomNotes')?.value || '';

  const db = window.AppState.db;
  let day = db.days.find(d => d.date === date);
  if (!day) {
    day = { date };
    db.days.push(day);
  }
  Object.assign(day, { digestioneScore, emorroidiScore, energiaMentaleScore, stressUmoreScore, notes });
  db.days.sort((a, b) => a.date.localeCompare(b.date));
  saveLocalDB(db);
  alert('✅ Diario sintomi salvato con successo!');
  renderAll();
};

function updateMedicalReport(latest, days) {
  setTxt('reportDate', new Date().toLocaleDateString('it-IT'));

  const avgRhr = Math.round(days.reduce((a, b) => a + (b.restingHR || 53), 0) / days.length);
  const avgDeep = (days.reduce((a, b) => a + (b.deepSleepPercent || 22), 0) / days.length).toFixed(1);
  const visc = latest.visceralFat !== undefined ? latest.visceralFat : 6.0;

  setTxt('rep-rhr', `${avgRhr} bpm`);
  setTxt('rep-deep-sleep', `${avgDeep} %`);
  setTxt('rep-visceral', `Liv. ${visc}`);
}

window.switchTab = function(tabId) {
  window.AppState.activeTab = tabId;

  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.className = 'tab-btn px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg flex items-center gap-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 whitespace-nowrap';
  });

  const activeBtn = document.getElementById(`nav-${tabId}`);
  if (activeBtn) {
    activeBtn.className = 'tab-btn active-tab px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 whitespace-nowrap';
  }

  setTimeout(() => {
    if (window.sleepChartInstance) window.sleepChartInstance.resize();
    if (window.heartRateChartInstance) window.heartRateChartInstance.resize();
    if (window.weightChartInstance) window.weightChartInstance.resize();
    if (window.symptomsChartInstance) window.symptomsChartInstance.resize();
    if (window.fatCompartmentsChartInstance) window.fatCompartmentsChartInstance.resize();
    if (window.leanQualityChartInstance) window.leanQualityChartInstance.resize();
  }, 100);

  if (window.lucide) lucide.createIcons();
};

window.exportDatabaseBackup = function() {
  const db = window.AppState.db;
  const jsonStr = JSON.stringify(db, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VagusPrime_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

window.importDatabaseBackup = function(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed && Array.isArray(parsed.days)) {
        saveLocalDB(parsed);
        renderAll();
        alert(`✅ Backup ripristinato con successo (${parsed.days.length} giorni caricati)!`);
      } else {
        alert('File di backup non valido.');
      }
    } catch (err) {
      alert('Errore lettura file: ' + err.message);
    }
  };
  reader.readAsText(file);
};
