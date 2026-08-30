const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3333;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

function getInitialDatabase() {
  return {
    user: {
      name: 'Luca (SherLuk)',
      targetWeight: 70.0,
      targetVisceralFat: 5.0,
      targetBodyFat: 14.0,
      targetMuscleMass: 58.0,
      targetRestingHR: 54,
      targetDeepSleepPercent: 25
    },
    days: [],
    lastUpdated: new Date().toISOString()
  };
}

function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading DB, re-initializing:', e);
    const initial = getInitialDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

function saveDatabase(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function parseDateString(rawDate) {
  if (!rawDate) return null;
  const clean = rawDate.trim().replace(/\./g, '-').replace(/\//g, '-');
  const parts = clean.split('-');
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      const y = parseInt(parts[0]);
      const m = String(parts[1]).padStart(2, '0');
      const d = String(parts[2]).padStart(2, '0');
      return `${y}-${m}-${d}`;
    } else if (parts[2].length === 4) {
      const y = parseInt(parts[2]);
      const m = String(parts[1]).padStart(2, '0');
      const d = String(parts[0]).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  }
  const dt = new Date(rawDate);
  if (!isNaN(dt.getTime())) return dt.toISOString().split('T')[0];
  return null;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function parseRenphoContent(csvText, db) {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error('File CSV/XLS vuoto o non valido');

  const headers = lines[0].split(/[,;\t]/).map(c => c.trim().toLowerCase());
  
  const dateIdx = headers.findIndex(c => c === 'data' || c === 'date' || c.includes('data') || c.includes('date'));
  const timeIdx = headers.findIndex(c => c === 'tempo' || c === 'time' || c.includes('orario') || c.includes('tempo'));
  const weightIdx = headers.findIndex(c => c.includes('peso(kg)') || c.includes('peso') || c.includes('weight'));
  const bmiIdx = headers.findIndex(c => c === 'bmi' || c.includes('bmi'));
  const fatIdx = headers.findIndex(c => c.includes('grasso corporeo') || c.includes('body fat'));
  const skelMuscleIdx = headers.findIndex(c => c.includes('muscolo scheletrico') || c.includes('skeletal muscle'));
  const fatFreeWeightIdx = headers.findIndex(c => c.includes('senza grassi') || c.includes('fat-free') || c.includes('fat free'));
  const subFatIdx = headers.findIndex(c => c.includes('sottocutaneo') || c.includes('subcutaneous'));
  const viscIdx = headers.findIndex(c => c.includes('grasso viscerale') || c.includes('visceral'));
  const waterIdx = headers.findIndex(c => c.includes('acqua corporea') || c.includes('body water') || c.includes('acqua'));
  const muscleIdx = headers.findIndex(c => c.includes('massa muscolare') || c.includes('muscle mass'));
  const boneIdx = headers.findIndex(c => c.includes('massa ossea') || c.includes('bone mass') || c.includes('osso'));
  const proteinIdx = headers.findIndex(c => c.includes('proteine') || c.includes('protein'));
  const bmrIdx = headers.findIndex(c => c.includes('bmr'));
  const metAgeIdx = headers.findIndex(c => c.includes('metabolica') || c.includes('metabolic age'));

  let importedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/[,;\t]/).map(p => p.replace(/"/g, '').trim());
    if (parts.length < 2) continue;

    const rawDate = dateIdx >= 0 ? parts[dateIdx] : parts[0];
    const dateStr = parseDateString(rawDate);
    if (!dateStr) continue;

    const parseVal = (idx) => (idx >= 0 && parts[idx] && parts[idx] !== '--') ? parseFloat(parts[idx].replace(',', '.')) : null;

    const timeStr = timeIdx >= 0 ? parts[timeIdx] : null;
    const weight = parseVal(weightIdx);
    const bmi = parseVal(bmiIdx);
    const bodyFat = parseVal(fatIdx);
    const skeletalMuscle = parseVal(skelMuscleIdx);
    const fatFreeWeight = parseVal(fatFreeWeightIdx);
    const subcutaneousFat = parseVal(subFatIdx);
    const visceralFat = parseVal(viscIdx);
    const bodyWater = parseVal(waterIdx);
    const muscleMass = parseVal(muscleIdx);
    const boneMass = parseVal(boneIdx);
    const protein = parseVal(proteinIdx);
    const bmr = parseVal(bmrIdx);
    const metabolicAge = parseVal(metAgeIdx);

    let existing = db.days.find(x => x.date === dateStr);
    if (existing) {
      if (timeStr) existing.weighTime = timeStr;
      if (weight !== null && !isNaN(weight)) existing.weight = weight;
      if (bmi !== null && !isNaN(bmi)) existing.bmi = bmi;
      if (bodyFat !== null && !isNaN(bodyFat)) existing.bodyFat = bodyFat;
      if (skeletalMuscle !== null && !isNaN(skeletalMuscle)) existing.skeletalMuscle = skeletalMuscle;
      if (fatFreeWeight !== null && !isNaN(fatFreeWeight)) existing.fatFreeWeight = fatFreeWeight;
      if (subcutaneousFat !== null && !isNaN(subcutaneousFat)) existing.subcutaneousFat = subcutaneousFat;
      if (visceralFat !== null && !isNaN(visceralFat)) existing.visceralFat = visceralFat;
      if (bodyWater !== null && !isNaN(bodyWater)) existing.bodyWater = bodyWater;
      if (muscleMass !== null && !isNaN(muscleMass)) existing.muscleMass = muscleMass;
      if (boneMass !== null && !isNaN(boneMass)) existing.boneMass = boneMass;
      if (protein !== null && !isNaN(protein)) existing.protein = protein;
      if (bmr !== null && !isNaN(bmr)) existing.bmr = bmr;
      if (metabolicAge !== null && !isNaN(metabolicAge)) existing.metabolicAge = metabolicAge;
    } else {
      db.days.push({
        date: dateStr,
        weighTime: timeStr || '07:15',
        weight: weight || 72.1,
        bmi: bmi || 23.2,
        bodyFat: bodyFat || 16.7,
        skeletalMuscle: skeletalMuscle || 53.9,
        fatFreeWeight: fatFreeWeight || 60.2,
        subcutaneousFat: subcutaneousFat || 14.6,
        visceralFat: visceralFat || 6.0,
        bodyWater: bodyWater || 60.2,
        muscleMass: muscleMass || 57.2,
        boneMass: boneMass || 3.01,
        protein: protein || 19.1,
        bmr: bmr || 1670,
        metabolicAge: metabolicAge || 36,
        sleepScore: 88,
        sleepDurationHours: 7.77,
        deepSleepPercent: 23,
        restingHR: 53,
        stressScore: 22,
        gelSemiLino: true,
        breakfastType: 'salata',
        ruscovenPomeriggio: true,
        dinnerTime: '20:00',
        dinnerWithin20: true,
        dinnerType: 'vellutata',
        tisanaSera: true,
        digestioneScore: 5,
        emorroidiScore: 5,
        energiaMentaleScore: 5,
        stressUmoreScore: 5
      });
    }
    importedCount++;
  }

  db.days.sort((a, b) => a.date.localeCompare(b.date));
  saveDatabase(db);
  return importedCount;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = parsedUrl.pathname;

  // GET /api/info (Restituisce IP Wi-Fi e stato)
  if (req.method === 'GET' && pathname === '/api/info') {
    const ip = getLocalIp();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ip, port: PORT, url: `http://${ip}:${PORT}` }));
    return;
  }

  // GET /api/data
  if (req.method === 'GET' && pathname === '/api/data') {
    const db = loadDatabase();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db));
    return;
  }

  // POST /api/checkin
  if (req.method === 'POST' && pathname === '/api/checkin') {
    try {
      const body = await getRequestBody(req);
      const payload = JSON.parse(body);
      const db = loadDatabase();
      const date = payload.date || new Date().toISOString().split('T')[0];

      let dayIndex = db.days.findIndex(d => d.date === date);
      if (dayIndex >= 0) {
        db.days[dayIndex] = { ...db.days[dayIndex], ...payload, date };
      } else {
        db.days.push({ date, ...payload });
      }

      db.days.sort((a, b) => a.date.localeCompare(b.date));
      saveDatabase(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, db }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // POST /api/import-renpho
  if (req.method === 'POST' && pathname === '/api/import-renpho') {
    try {
      const body = await getRequestBody(req);
      const payload = JSON.parse(body);
      const csvText = payload.csvText;
      if (!csvText) throw new Error('Testo CSV/XLS mancante');

      const db = loadDatabase();
      const importedCount = parseRenphoContent(csvText, db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, importedCount, db }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // POST /api/sync-mobile (Endpoint unico da smartphone per Renpho + Huawei)
  if (req.method === 'POST' && pathname === '/api/sync-mobile') {
    try {
      const body = await getRequestBody(req);
      const payload = JSON.parse(body);
      const db = loadDatabase();
      let importedRenpho = 0;
      let importedHuawei = false;

      if (payload.renphoCsv) {
        importedRenpho = parseRenphoContent(payload.renphoCsv, db);
      }

      if (payload.huaweiData) {
        const h = payload.huaweiData;
        const dateStr = parseDateString(h.date) || new Date().toISOString().split('T')[0];
        let existing = db.days.find(x => x.date === dateStr);
        if (!existing) {
          existing = { date: dateStr };
          db.days.push(existing);
        }
        if (h.sleepScore) existing.sleepScore = parseFloat(h.sleepScore);
        if (h.deepSleepPercent) existing.deepSleepPercent = parseFloat(h.deepSleepPercent);
        if (h.remSleepPercent) existing.remSleepPercent = parseFloat(h.remSleepPercent);
        if (h.lightSleepPercent) existing.lightSleepPercent = parseFloat(h.lightSleepPercent);
        if (h.sleepDurationHours) existing.sleepDurationHours = parseFloat(h.sleepDurationHours);
        if (h.restingHR) existing.restingHR = parseFloat(h.restingHR);
        if (h.stressScore) existing.stressScore = parseFloat(h.stressScore);
        importedHuawei = true;
      }

      db.days.sort((a, b) => a.date.localeCompare(b.date));
      saveDatabase(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, importedRenpho, importedHuawei, db }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Error loading file');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

// Ascolta su 0.0.0.0 per consentire l'accesso Wi-Fi locale dallo smartphone
const localIp = getLocalIp();
server.listen(PORT, '0.0.0.0', () => {
  console.log(`======================================================`);
  console.log(` 🚀 LUCA HEALTH BLUEPRINT - SERVER ATTIVO ANCHE IN WI-FI`);
  console.log(` 💻 Sul tuo Mac:       http://localhost:${PORT}`);
  console.log(` 📱 Dal tuo Smartphone: http://${localIp}:${PORT}`);
  console.log(`======================================================`);
});
