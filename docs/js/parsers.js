// --- VAGUSPRIME: PARSERS.JS (CLIENT-SIDE FILE PROCESSING) ---

document.addEventListener('DOMContentLoaded', () => {
  setupDropzones();
});

function setupDropzones() {
  const dzRenpho = document.getElementById('dropzoneRenpho');
  const fileRenpho = document.getElementById('fileRenphoInput');
  if (dzRenpho && fileRenpho) {
    dzRenpho.addEventListener('click', () => fileRenpho.click());
    dzRenpho.addEventListener('dragover', (e) => { e.preventDefault(); dzRenpho.classList.add('dragover'); });
    dzRenpho.addEventListener('dragleave', () => dzRenpho.classList.remove('dragover'));
    dzRenpho.addEventListener('drop', (e) => {
      e.preventDefault();
      dzRenpho.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleRenphoClient(e.dataTransfer.files[0]);
    });
    fileRenpho.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) handleRenphoClient(e.target.files[0]);
    });
  }

  const dzHuawei = document.getElementById('dropzoneHuawei');
  const fileHuawei = document.getElementById('fileHuaweiInput');
  if (dzHuawei && fileHuawei) {
    dzHuawei.addEventListener('click', () => fileHuawei.click());
    dzHuawei.addEventListener('dragover', (e) => { e.preventDefault(); dzHuawei.classList.add('dragover'); });
    dzHuawei.addEventListener('dragleave', () => dzHuawei.classList.remove('dragover'));
    dzHuawei.addEventListener('drop', (e) => {
      e.preventDefault();
      dzHuawei.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleHuaweiClient(e.dataTransfer.files[0]);
    });
    fileHuawei.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) handleHuaweiClient(e.target.files[0]);
    });
  }
}

function parseDateStr(raw) {
  if (!raw) return null;
  const clean = raw.trim().replace(/\./g, '-').replace(/\//g, '-');
  const parts = clean.split('-');
  if (parts.length === 3) {
    if (parts[0].length === 4) return `${parseInt(parts[0])}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
    if (parts[2].length === 4) return `${parseInt(parts[2])}-${String(parts[1]).padStart(2, '0')}-${String(parts[0]).padStart(2, '0')}`;
  }
  const dt = new Date(raw);
  return !isNaN(dt.getTime()) ? dt.toISOString().split('T')[0] : null;
}

function handleRenphoClient(file) {
  const statusEl = document.getElementById('renphoStatus');
  if (statusEl) {
    statusEl.className = 'text-xs text-cyan-400 font-medium p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 block';
    statusEl.textContent = `Lettura file ${file.name}...`;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) throw new Error('File vuoto o non valido');

      const headers = lines[0].split(/[,;\t]/).map(c => c.trim().toLowerCase());
      const dateIdx = headers.findIndex(c => c.includes('data') || c.includes('date'));
      const timeIdx = headers.findIndex(c => c.includes('tempo') || c.includes('time') || c.includes('orario'));
      const weightIdx = headers.findIndex(c => c.includes('peso') || c.includes('weight'));
      const bmiIdx = headers.findIndex(c => c.includes('bmi'));
      const fatIdx = headers.findIndex(c => c.includes('grasso corporeo') || c.includes('body fat'));
      const skelMuscleIdx = headers.findIndex(c => c.includes('muscolo scheletrico') || c.includes('skeletal muscle'));
      const fatFreeIdx = headers.findIndex(c => c.includes('senza grassi') || c.includes('fat-free'));
      const subFatIdx = headers.findIndex(c => c.includes('sottocutaneo') || c.includes('subcutaneous'));
      const viscIdx = headers.findIndex(c => c.includes('grasso viscerale') || c.includes('visceral'));
      const waterIdx = headers.findIndex(c => c.includes('acqua') || c.includes('water'));
      const muscleIdx = headers.findIndex(c => c.includes('massa muscolare') || c.includes('muscle mass'));
      const boneIdx = headers.findIndex(c => c.includes('massa ossea') || c.includes('bone'));
      const proteinIdx = headers.findIndex(c => c.includes('proteine') || c.includes('protein'));
      const bmrIdx = headers.findIndex(c => c.includes('bmr'));
      const metAgeIdx = headers.findIndex(c => c.includes('metabolica') || c.includes('metabolic age'));

      const db = window.AppState.db;
      let count = 0;

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(/[,;\t]/).map(p => p.replace(/"/g, '').trim());
        if (parts.length < 2) continue;

        const rawDate = dateIdx >= 0 ? parts[dateIdx] : parts[0];
        const dateStr = parseDateStr(rawDate);
        if (!dateStr) continue;

        const parseVal = (idx) => (idx >= 0 && parts[idx] && parts[idx] !== '--') ? parseFloat(parts[idx].replace(',', '.')) : null;

        let day = db.days.find(x => x.date === dateStr);
        if (!day) {
          day = { date: dateStr };
          db.days.push(day);
        }

        if (timeIdx >= 0 && parts[timeIdx]) day.weighTime = parts[timeIdx];
        const w = parseVal(weightIdx); if (w) day.weight = w;
        const bmi = parseVal(bmiIdx); if (bmi) day.bmi = bmi;
        const bf = parseVal(fatIdx); if (bf) day.bodyFat = bf;
        const sm = parseVal(skelMuscleIdx); if (sm) day.skeletalMuscle = sm;
        const ffw = parseVal(fatFreeIdx); if (ffw) day.fatFreeWeight = ffw;
        const sf = parseVal(subFatIdx); if (sf) day.subcutaneousFat = sf;
        const vf = parseVal(viscIdx); if (vf) day.visceralFat = vf;
        const bw = parseVal(waterIdx); if (bw) day.bodyWater = bw;
        const mm = parseVal(muscleIdx); if (mm) day.muscleMass = mm;
        const bm = parseVal(boneIdx); if (bm) day.boneMass = bm;
        const pr = parseVal(proteinIdx); if (pr) day.protein = pr;
        const bmr = parseVal(bmrIdx); if (bmr) day.bmr = bmr;
        const ma = parseVal(metAgeIdx); if (ma) day.metabolicAge = ma;

        count++;
      }

      db.days.sort((a, b) => a.date.localeCompare(b.date));
      saveLocalDB(db);
      renderAll();

      if (statusEl) {
        statusEl.className = 'text-xs text-emerald-400 font-medium p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 block';
        statusEl.textContent = `✅ Importate ${count} misurazioni da Renpho!`;
      }
      setTimeout(() => switchTab('renpho'), 600);
    } catch (err) {
      if (statusEl) {
        statusEl.className = 'text-xs text-rose-400 font-medium p-2.5 bg-rose-500/10 rounded-lg border border-rose-500/20 block';
        statusEl.textContent = `❌ Errore: ${err.message}`;
      }
    }
  };
  reader.readAsText(file);
}

function handleHuaweiClient(file) {
  const statusEl = document.getElementById('huaweiStatus');
  if (statusEl) {
    statusEl.className = 'text-xs text-cyan-400 font-medium p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 block';
    statusEl.textContent = `Lettura file ${file.name}...`;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      const records = Array.isArray(parsed) ? parsed : (parsed.data || [parsed]);
      const db = window.AppState.db;
      let count = 0;

      for (const item of records) {
        const rawDate = item.date || item.startTime?.split('T')[0] || (item.timestamp ? new Date(item.timestamp).toISOString().split('T')[0] : null);
        const dateStr = parseDateStr(rawDate);
        if (!dateStr) continue;

        let day = db.days.find(x => x.date === dateStr);
        if (!day) {
          day = { date: dateStr };
          db.days.push(day);
        }

        if (item.sleepScore) day.sleepScore = item.sleepScore;
        if (item.deepSleepPercent) day.deepSleepPercent = item.deepSleepPercent;
        if (item.restingHR) day.restingHR = item.restingHR;
        if (item.stressScore) day.stressScore = item.stressScore;
        if (item.sleepDurationHours) day.sleepDurationHours = item.sleepDurationHours;
        count++;
      }

      db.days.sort((a, b) => a.date.localeCompare(b.date));
      saveLocalDB(db);
      renderAll();

      if (statusEl) {
        statusEl.className = 'text-xs text-emerald-400 font-medium p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 block';
        statusEl.textContent = `✅ Importati con successo i dati sanitari!`;
      }
    } catch (err) {
      if (statusEl) {
        statusEl.className = 'text-xs text-rose-400 font-medium p-2.5 bg-rose-500/10 rounded-lg border border-rose-500/20 block';
        statusEl.textContent = `❌ Formato non supportato: ${err.message}`;
      }
    }
  };
  reader.readAsText(file);
}

window.saveManualBiometrics = function() {
  const date = document.getElementById('manualDate')?.value || new Date().toISOString().split('T')[0];
  const weight = parseFloat(document.getElementById('manualWeight')?.value);
  const visceralFat = parseFloat(document.getElementById('manualVisceral')?.value);
  const sleepScore = parseFloat(document.getElementById('manualSleepScore')?.value);
  const deepSleepPercent = parseFloat(document.getElementById('manualDeepSleep')?.value);
  const restingHR = parseFloat(document.getElementById('manualRHR')?.value);

  const db = window.AppState.db;
  let day = db.days.find(x => x.date === date);
  if (!day) {
    day = { date };
    db.days.push(day);
  }

  if (!isNaN(weight)) day.weight = weight;
  if (!isNaN(visceralFat)) day.visceralFat = visceralFat;
  if (!isNaN(sleepScore)) day.sleepScore = sleepScore;
  if (!isNaN(deepSleepPercent)) day.deepSleepPercent = deepSleepPercent;
  if (!isNaN(restingHR)) day.restingHR = restingHR;

  db.days.sort((a, b) => a.date.localeCompare(b.date));
  saveLocalDB(db);
  renderAll();

  alert('✅ Dati biometrici salvati nel tuo dispositivo!');
  if (document.getElementById('manualWeight')) document.getElementById('manualWeight').value = '';
  if (document.getElementById('manualVisceral')) document.getElementById('manualVisceral').value = '';
  if (document.getElementById('manualSleepScore')) document.getElementById('manualSleepScore').value = '';
  if (document.getElementById('manualDeepSleep')) document.getElementById('manualDeepSleep').value = '';
  if (document.getElementById('manualRHR')) document.getElementById('manualRHR').value = '';
};
