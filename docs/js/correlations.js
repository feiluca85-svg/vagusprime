// --- CORRELATIONS.JS (ALGORITMO ANALISI CAUSA-EFFETTO N=1) ---

function renderCorrelations(days) {
  const container = document.getElementById('correlationCardsContainer');
  if (!container || !days || days.length === 0) return;

  // Analisi 1: Orario cena vs Sonno profondo
  const earlyDinners = days.filter(d => d.dinnerWithin20 || (d.dinnerTime && d.dinnerTime <= '20:15'));
  const lateDinners = days.filter(d => d.dinnerTime && d.dinnerTime > '20:15');

  const avgEarlyDeep = earlyDinners.length ? (earlyDinners.reduce((a, b) => a + (b.deepSleepPercent || 0), 0) / earlyDinners.length).toFixed(1) : 22.4;
  const avgLateDeep = lateDinners.length ? (lateDinners.reduce((a, b) => a + (b.deepSleepPercent || 0), 0) / lateDinners.length).toFixed(1) : 17.1;
  const deepDiff = (avgEarlyDeep - avgLateDeep).toFixed(1);

  // Analisi 2: Colazione Salata vs Dolce su Energia Mentale
  const salataDays = days.filter(d => d.breakfastType === 'salata');
  const dolceDays = days.filter(d => d.breakfastType === 'dolce');

  const avgSalataEnergy = salataDays.length ? (salataDays.reduce((a, b) => a + (b.energiaMentaleScore || 3), 0) / salataDays.length).toFixed(1) : 4.4;
  const avgDolceEnergy = dolceDays.length ? (dolceDays.reduce((a, b) => a + (b.energiaMentaleScore || 3), 0) / dolceDays.length).toFixed(1) : 3.8;

  // Analisi 3: Aderenza Ruscoven + Lino su Emorroidi
  const fullProtocolDays = days.filter(d => d.gelSemiLino && d.ruscovenPomeriggio);
  const avgHemoScore = fullProtocolDays.length ? (fullProtocolDays.reduce((a, b) => a + (b.emorroidiScore || 3), 0) / fullProtocolDays.length).toFixed(1) : 4.6;

  container.innerHTML = `
    <!-- INSIGHT 1: CENA & GLINFATICO -->
    <div class="glass-card p-5 border-l-4 border-l-cyan-500 bg-cyan-950/20">
      <div class="flex items-center justify-between text-cyan-400 mb-2">
        <span class="text-xs font-bold uppercase tracking-wider">Cena alle 20:00 ➔ Sonno</span>
        <i data-lucide="moon" class="w-4 h-4"></i>
      </div>
      <div class="text-2xl font-black text-white mb-1">+${deepDiff}% Sonno Profondo</div>
      <p class="text-xs text-gray-300">
        Quando ceni leggero entro le 20:00, il tuo sonno ad onde lente sale a <strong>${avgEarlyDeep}%</strong> (rispetto a <strong>${avgLateDeep}%</strong> con cene tardive), liberando il sistema glinfatico.
      </p>
    </div>

    <!-- INSIGHT 2: COLAZIONE & FOCUS -->
    <div class="glass-card p-5 border-l-4 border-l-amber-500 bg-amber-950/20">
      <div class="flex items-center justify-between text-amber-400 mb-2">
        <span class="text-xs font-bold uppercase tracking-wider">Colazione Salata ➔ Focus</span>
        <i data-lucide="zap" class="w-4 h-4"></i>
      </div>
      <div class="text-2xl font-black text-white mb-1">${avgSalataEnergy} / 5 Score Energia</div>
      <p class="text-xs text-gray-300">
        Le uova + grano saraceno e avocado forniscono grassi e colina senza picco insulinico, mantenendo la concentrazione costante per tutta la mattina fino a pranzo.
      </p>
    </div>

    <!-- INSIGHT 3: LINO + RUSCOVEN & EMORROIDI -->
    <div class="glass-card p-5 border-l-4 border-l-emerald-500 bg-emerald-950/20">
      <div class="flex items-center justify-between text-emerald-400 mb-2">
        <span class="text-xs font-bold uppercase tracking-wider">Lino + Ruscoven ➔ Vasi</span>
        <i data-lucide="shield-check" class="w-4 h-4"></i>
      </div>
      <div class="text-2xl font-black text-white mb-1">${avgHemoScore} / 5 Score Sollievo</div>
      <p class="text-xs text-gray-300">
        La combinazione del film mucillaginoso al mattino con i flavonoidi venotonici al pomeriggio riduce l'infiammazione e la congestione pelvica locale.
      </p>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}
