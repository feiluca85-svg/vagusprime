// --- PARSERS.JS (GESTIONE DRAG & DROP E PARSER FILE) ---

document.addEventListener('DOMContentLoaded', () => {
  setupDropzones();
});

function setupDropzones() {
  // Renpho Dropzone
  const dzRenpho = document.getElementById('dropzoneRenpho');
  const fileRenpho = document.getElementById('fileRenphoInput');
  if (dzRenpho && fileRenpho) {
    dzRenpho.addEventListener('click', () => fileRenpho.click());
    
    dzRenpho.addEventListener('dragover', (e) => {
      e.preventDefault();
      dzRenpho.classList.add('dragover');
    });
    dzRenpho.addEventListener('dragleave', () => dzRenpho.classList.remove('dragover'));
    dzRenpho.addEventListener('drop', (e) => {
      e.preventDefault();
      dzRenpho.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleRenphoFile(e.dataTransfer.files[0]);
      }
    });

    fileRenpho.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleRenphoFile(e.target.files[0]);
      }
    });
  }

  // Huawei Dropzone
  const dzHuawei = document.getElementById('dropzoneHuawei');
  const fileHuawei = document.getElementById('fileHuaweiInput');
  if (dzHuawei && fileHuawei) {
    dzHuawei.addEventListener('click', () => fileHuawei.click());
    
    dzHuawei.addEventListener('dragover', (e) => {
      e.preventDefault();
      dzHuawei.classList.add('dragover');
    });
    dzHuawei.addEventListener('dragleave', () => dzHuawei.classList.remove('dragover'));
    dzHuawei.addEventListener('drop', (e) => {
      e.preventDefault();
      dzHuawei.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleHuaweiFile(e.dataTransfer.files[0]);
      }
    });

    fileHuawei.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleHuaweiFile(e.target.files[0]);
      }
    });
  }
}

async function handleRenphoFile(file) {
  const statusEl = document.getElementById('renphoStatus');
  if (statusEl) {
    statusEl.className = 'text-xs text-cyan-400 font-medium p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 block';
    statusEl.textContent = `Lettura file: ${file.name}...`;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const csvText = e.target.result;
      const res = await fetch('/api/import-renpho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText })
      });
      const data = await res.json();
      if (data.success) {
        if (statusEl) {
          statusEl.className = 'text-xs text-emerald-400 font-medium p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 block';
          statusEl.textContent = `✅ Importate con successo ${data.importedCount} misurazioni da Renpho!`;
        }
        window.AppState.db = data.db;
        window.renderAll();
        
        setTimeout(() => {
          if (window.switchTab) window.switchTab('renpho');
        }, 600);
      } else {
        throw new Error(data.error || 'Errore importazione');
      }
    } catch (err) {
      if (statusEl) {
        statusEl.className = 'text-xs text-rose-400 font-medium p-2.5 bg-rose-500/10 rounded-lg border border-rose-500/20 block';
        statusEl.textContent = `❌ Errore: ${err.message}`;
      }
    }
  };
  reader.readAsText(file);
}

async function handleHuaweiFile(file) {
  const statusEl = document.getElementById('huaweiStatus');
  if (statusEl) {
    statusEl.className = 'text-xs text-cyan-400 font-medium p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 block';
    statusEl.textContent = `Lettura file: ${file.name}...`;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const content = e.target.result;
      const res = await fetch('/api/import-huawei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawJsonText: content })
      });
      const data = await res.json();
      if (data.success) {
        if (statusEl) {
          statusEl.className = 'text-xs text-emerald-400 font-medium p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 block';
          statusEl.textContent = `✅ Importati con successo i dati sanitari Huawei!`;
        }
        window.AppState.db = data.db;
        window.renderAll();
      } else {
        throw new Error(data.error || 'Formato file non riconosciuto');
      }
    } catch (err) {
      if (statusEl) {
        statusEl.className = 'text-xs text-rose-400 font-medium p-2.5 bg-rose-500/10 rounded-lg border border-rose-500/20 block';
        statusEl.textContent = `❌ Errore: ${err.message}`;
      }
    }
  };
  reader.readAsText(file);
}

// Inserimento manuale rapido
async function saveManualBiometrics() {
  const date = document.getElementById('manualDate')?.value || new Date().toISOString().split('T')[0];
  const weight = parseFloat(document.getElementById('manualWeight')?.value);
  const visceralFat = parseFloat(document.getElementById('manualVisceral')?.value);
  const sleepScore = parseFloat(document.getElementById('manualSleepScore')?.value);
  const deepSleepPercent = parseFloat(document.getElementById('manualDeepSleep')?.value);
  const restingHR = parseFloat(document.getElementById('manualRHR')?.value);

  const payload = { date };
  if (!isNaN(weight)) payload.weight = weight;
  if (!isNaN(visceralFat)) payload.visceralFat = visceralFat;
  if (!isNaN(sleepScore)) payload.sleepScore = sleepScore;
  if (!isNaN(deepSleepPercent)) payload.deepSleepPercent = deepSleepPercent;
  if (!isNaN(restingHR)) payload.restingHR = restingHR;

  try {
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      alert('✅ Dati biometrici salvati correttamente!');
      window.AppState.db = data.db;
      window.renderAll();
      if (document.getElementById('manualWeight')) document.getElementById('manualWeight').value = '';
      if (document.getElementById('manualVisceral')) document.getElementById('manualVisceral').value = '';
      if (document.getElementById('manualSleepScore')) document.getElementById('manualSleepScore').value = '';
      if (document.getElementById('manualDeepSleep')) document.getElementById('manualDeepSleep').value = '';
      if (document.getElementById('manualRHR')) document.getElementById('manualRHR').value = '';
    }
  } catch (e) {
    alert('Errore salvataggio: ' + e.message);
  }
}
