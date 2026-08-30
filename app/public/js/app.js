// --- APP.JS (ORCHESTRATORE STATO GLOBALE E NAVIGAZIONE) ---

window.AppState = {
  db: null,
  activeTab: 'dashboard'
};

// Safe helper to set text content without throwing if element is missing
function setTxt(id, val) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = val !== null && val !== undefined ? val : '--';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayDate = new Date();
  const dateFormatted = todayDate.toLocaleDateString('it-IT', options);
  setTxt('currentDateDisplay', dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1));

  const todayIso = todayDate.toISOString().split('T')[0];
  const pDate = document.getElementById('protocolDate');
  if (pDate) pDate.value = todayIso;
  const mDate = document.getElementById('manualDate');
  if (mDate) mDate.value = todayIso;

  await fetchAppDatabase();

  if (window.lucide) {
    lucide.createIcons();
  }
});

async function fetchAppDatabase() {
  try {
    const res = await fetch('/api/data');
    const db = await res.json();
    window.AppState.db = db;
    renderAll();
  } catch (err) {
    console.error('Errore caricamento database locale:', err);
  }
}

window.renderAll = function() {
  const db = window.AppState.db;
  if (!db || !db.days || db.days.length === 0) return;

  const days = db.days;
  const latestDay = days[days.length - 1];

  // 1. Aggiorna KPI Superiori & Renpho Matrix in modo sicuro
  updateKPIs(latestDay, days);
  updateRenphoMatrix(latestDay);

  // 2. Render Grafici
  if (window.initCharts) {
    try { window.initCharts(days); } catch(e) { console.error('Errore grafici:', e); }
  }

  // 3. Render Correlazioni N=1
  if (window.renderCorrelations) {
    try { window.renderCorrelations(days); } catch(e) { console.error('Errore correlazioni:', e); }
  }

  // 4. Aggiorna Report Medico
  updateMedicalReport(latestDay, days);

  // 5. Popola checklist e sintomi
  populateTodayForms(latestDay);

  if (window.lucide) {
    lucide.createIcons();
  }
};

function updateKPIs(latest, days) {
  // Sonno
  setTxt('kpi-sleep-score', latest.sleepScore || 85);
  setTxt('kpi-deep-sleep', `${latest.deepSleepPercent || 22}%`);
  setTxt('kpi-sleep-duration', `${latest.sleepDurationHours || 7.5} h`);

  // Cuore & Stress
  setTxt('kpi-resting-hr', latest.restingHR || 58);
  setTxt('kpi-stress', `${latest.stressScore || 28} / 100`);

  // Peso & Viscere
  setTxt('kpi-weight', (latest.weight || 72.2).toFixed(1));
  setTxt('kpi-visceral', `Liv. ${latest.visceralFat !== undefined ? latest.visceralFat : 6.0}`);
  setTxt('kpi-muscle-kg', `${(latest.muscleMass || 57.1).toFixed(1)} kg`);
  setTxt('kpi-fat-percent', `${(latest.bodyFat || 16.8).toFixed(1)} %`);

  // Intestino & Emorroidi
  const avgSymptom = (((latest.digestioneScore || 4) + (latest.emorroidiScore || 4)) / 2).toFixed(1);
  setTxt('kpi-symptom-score', avgSymptom);
  setTxt('kpi-mental-energy', `${latest.energiaMentaleScore || 4} / 5`);

  const hemoLabel = document.getElementById('kpi-hemorrhoid-status');
  if (hemoLabel) {
    const score = latest.emorroidiScore || 4;
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
  setTxt('rf-weight', (latest.weight || 72.2).toFixed(2));
  setTxt('rf-bmi', (latest.bmi || 23.3).toFixed(1));
  setTxt('rf-fat-percent', (latest.bodyFat || 16.8).toFixed(1));
  setTxt('rf-sub-fat', (latest.subcutaneousFat || 14.7).toFixed(1));
  setTxt('rf-visceral', (latest.visceralFat || 6.0).toFixed(1));
  setTxt('rf-muscle-kg', (latest.muscleMass || 57.1).toFixed(2));
  setTxt('rf-skel-muscle', (latest.skeletalMuscle || 53.8).toFixed(1));
  setTxt('rf-fat-free', (latest.fatFreeWeight || 60.1).toFixed(2));
  setTxt('rf-water', (latest.bodyWater || 60.1).toFixed(1));
  setTxt('rf-protein', (latest.protein || 19.0).toFixed(1));
  setTxt('rf-bone', (latest.boneMass || 3.01).toFixed(2));
  setTxt('rf-bmr', latest.bmr || 1669);
  setTxt('rf-met-age', latest.metabolicAge || 37);
}

function populateTodayForms(todayData) {
  if (!todayData) return;

  if (document.getElementById('chk-lino')) document.getElementById('chk-lino').checked = !!todayData.gelSemiLino;
  if (todayData.breakfastType === 'salata' && document.getElementById('rad-salata')) document.getElementById('rad-salata').checked = true;
  if (todayData.breakfastType === 'dolce' && document.getElementById('rad-dolce')) document.getElementById('rad-dolce').checked = true;
  if (document.getElementById('chk-ruscoven')) document.getElementById('chk-ruscoven').checked = !!todayData.ruscovenPomeriggio;
  if (todayData.dinnerTime && document.getElementById('dinnerTimeInput')) document.getElementById('dinnerTimeInput').value = todayData.dinnerTime;
  if (todayData.dinnerType === 'vellutata' && document.getElementById('rad-vellutata')) document.getElementById('rad-vellutata').checked = true;
  if (todayData.dinnerType === 'brodo_pesce' && document.getElementById('rad-brodo')) document.getElementById('rad-brodo').checked = true;
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

async function saveProtocolData() {
  const date = document.getElementById('protocolDate').value || new Date().toISOString().split('T')[0];
  const gelSemiLino = document.getElementById('chk-lino')?.checked || false;
  const breakfastType = document.querySelector('input[name="breakfastType"]:checked')?.value || 'salata';
  const ruscovenPomeriggio = document.getElementById('chk-ruscoven')?.checked || false;
  const dinnerTime = document.getElementById('dinnerTimeInput')?.value || '20:00';
  const dinnerType = document.querySelector('input[name="dinnerType"]:checked')?.value || 'vellutata';
  const tisanaSera = document.getElementById('chk-sedivitax')?.checked || false;
  const dinnerWithin20 = dinnerTime <= '20:15';

  const payload = {
    date,
    gelSemiLino,
    breakfastType,
    ruscovenPomeriggio,
    dinnerTime,
    dinnerType,
    dinnerWithin20,
    tisanaSera
  };

  try {
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      alert('✅ Protocollo di oggi registrato con successo!');
      window.AppState.db = data.db;
      window.renderAll();
    }
  } catch (e) {
    alert('Errore salvataggio protocollo: ' + e.message);
  }
}

async function saveSymptomsData() {
  const date = document.getElementById('protocolDate').value || new Date().toISOString().split('T')[0];
  const digestioneScore = parseInt(document.getElementById('range-digestione')?.value || 4);
  const emorroidiScore = parseInt(document.getElementById('range-emorroidi')?.value || 4);
  const energiaMentaleScore = parseInt(document.getElementById('range-energia')?.value || 4);
  const stressUmoreScore = parseInt(document.getElementById('range-stress')?.value || 4);
  const notes = document.getElementById('symptomNotes')?.value || '';

  const payload = {
    date,
    digestioneScore,
    emorroidiScore,
    energiaMentaleScore,
    stressUmoreScore,
    notes
  };

  try {
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      alert('✅ Sintomi e diario registrati con successo!');
      window.AppState.db = data.db;
      window.renderAll();
    }
  } catch (e) {
    alert('Errore salvataggio sintomi: ' + e.message);
  }
}

function updateMedicalReport(latest, days) {
  setTxt('reportDate', new Date().toLocaleDateString('it-IT'));

  const avgRhr = Math.round(days.reduce((a, b) => a + (b.restingHR || 60), 0) / days.length);
  const avgDeep = (days.reduce((a, b) => a + (b.deepSleepPercent || 20), 0) / days.length).toFixed(1);
  const visc = latest.visceralFat !== undefined ? latest.visceralFat : 6.0;

  setTxt('rep-rhr', `${avgRhr} bpm`);
  setTxt('rep-deep-sleep', `${avgDeep} %`);
  setTxt('rep-visceral', `Liv. ${visc}`);
}

function switchTab(tabId) {
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

  // Resize charts
  setTimeout(() => {
    if (window.sleepChartInstance) window.sleepChartInstance.resize();
    if (window.weightChartInstance) window.weightChartInstance.resize();
    if (window.symptomsChartInstance) window.symptomsChartInstance.resize();
    if (window.fatCompartmentsChartInstance) window.fatCompartmentsChartInstance.resize();
    if (window.leanQualityChartInstance) window.leanQualityChartInstance.resize();
  }, 100);

  if (window.lucide) lucide.createIcons();
}
