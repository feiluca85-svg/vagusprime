// --- CHARTS.JS (MOTORE GRAFICI INTERATTIVI CHART.JS) ---

let sleepChartInstance = null;
let weightChartInstance = null;
let symptomsChartInstance = null;
let fatCompartmentsChartInstance = null;
let leanQualityChartInstance = null;

const COLORS = {
  emerald: '#10b981',
  cyan: '#06b6d4',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  grid: 'rgba(255, 255, 255, 0.06)',
  text: '#9ca3af'
};

function initCharts(days) {
  if (!days || days.length === 0) return;

  const labels = days.map(d => {
    const parts = d.date.split('-');
    return `${parts[2]}/${parts[1]}`;
  });

  // 1. SLEEP & RHR CHART (Dual Axis)
  const ctxSleep = document.getElementById('sleepChart');
  if (ctxSleep) {
    if (sleepChartInstance) sleepChartInstance.destroy();

    sleepChartInstance = new Chart(ctxSleep, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Sonno Profondo (%)',
            data: days.map(d => d.deepSleepPercent || 0),
            borderColor: COLORS.cyan,
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            fill: true,
            tension: 0.35,
            yAxisID: 'yLeft',
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: COLORS.cyan
          },
          {
            label: 'Battito Riposo (bpm)',
            data: days.map(d => d.restingHR || 0),
            borderColor: COLORS.rose,
            borderDash: [4, 4],
            tension: 0.35,
            yAxisID: 'yRight',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: COLORS.rose
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: COLORS.text, font: { size: 11 } } }
        },
        scales: {
          x: { grid: { color: COLORS.grid }, ticks: { color: COLORS.text, font: { size: 10 } } },
          yLeft: {
            type: 'linear',
            position: 'left',
            grid: { color: COLORS.grid },
            ticks: { color: COLORS.cyan, font: { size: 10 } },
            title: { display: true, text: 'Sonno Profondo %', color: COLORS.cyan, font: { size: 10 } },
            min: 10,
            max: 35
          },
          yRight: {
            type: 'linear',
            position: 'right',
            grid: { display: false },
            ticks: { color: COLORS.rose, font: { size: 10 } },
            title: { display: true, text: 'RHR (bpm)', color: COLORS.rose, font: { size: 10 } },
            min: 50,
            max: 75
          }
        }
      }
    });
  }

  // 2. WEIGHT & VISCERAL FAT CHART
  const ctxWeight = document.getElementById('weightChart');
  if (ctxWeight) {
    if (weightChartInstance) weightChartInstance.destroy();

    weightChartInstance = new Chart(ctxWeight, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Peso Corporeo (kg)',
            data: days.map(d => d.weight || null),
            borderColor: COLORS.amber,
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            fill: true,
            tension: 0.3,
            yAxisID: 'yWeight',
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: COLORS.amber
          },
          {
            label: 'Grasso Viscerale (Liv.)',
            data: days.map(d => d.visceralFat || null),
            borderColor: COLORS.rose,
            tension: 0.3,
            yAxisID: 'yVisceral',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: COLORS.rose
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: COLORS.text, font: { size: 11 } } }
        },
        scales: {
          x: { grid: { color: COLORS.grid }, ticks: { color: COLORS.text, font: { size: 10 } } },
          yWeight: {
            type: 'linear',
            position: 'left',
            grid: { color: COLORS.grid },
            ticks: { color: COLORS.amber, font: { size: 10 } },
            title: { display: true, text: 'Peso (kg)', color: COLORS.amber, font: { size: 10 } }
          },
          yVisceral: {
            type: 'linear',
            position: 'right',
            grid: { display: false },
            ticks: { color: COLORS.rose, font: { size: 10 } },
            title: { display: true, text: 'Liv. Viscerale', color: COLORS.rose, font: { size: 10 } },
            min: 1,
            max: 12
          }
        }
      }
    });
  }

  // 3. SYMPTOMS CHART
  const ctxSymptoms = document.getElementById('symptomsChart');
  if (ctxSymptoms) {
    if (symptomsChartInstance) symptomsChartInstance.destroy();

    symptomsChartInstance = new Chart(ctxSymptoms, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Intestino & Sgonfiezze',
            data: days.map(d => d.digestioneScore || 3),
            borderColor: COLORS.emerald,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4
          },
          {
            label: 'Stato Emorroidario',
            data: days.map(d => d.emorroidiScore || 3),
            borderColor: COLORS.cyan,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4
          },
          {
            label: 'Energia Mentale',
            data: days.map(d => d.energiaMentaleScore || 3),
            borderColor: COLORS.amber,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: COLORS.text, font: { size: 11 } } }
        },
        scales: {
          x: { grid: { color: COLORS.grid }, ticks: { color: COLORS.text, font: { size: 10 } } },
          y: {
            grid: { color: COLORS.grid },
            ticks: { color: COLORS.text, font: { size: 10 }, stepSize: 1 },
            min: 1,
            max: 5,
            title: { display: true, text: 'Score Benessere (1-5)', color: COLORS.text, font: { size: 10 } }
          }
        }
      }
    });
  }

  // 4. RENPHO CHART 1: FAT COMPARTMENTS (Viscerale vs Sottocutaneo vs Totale)
  const ctxFat = document.getElementById('fatCompartmentsChart');
  if (ctxFat) {
    if (fatCompartmentsChartInstance) fatCompartmentsChartInstance.destroy();

    fatCompartmentsChartInstance = new Chart(ctxFat, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Grasso Corporeo Totale (%)',
            data: days.map(d => d.bodyFat || 16.8),
            borderColor: COLORS.amber,
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            fill: true,
            tension: 0.3,
            borderWidth: 2.5,
            yAxisID: 'yPercent'
          },
          {
            label: 'Grasso Sottocutaneo (%)',
            data: days.map(d => d.subcutaneousFat || 14.7),
            borderColor: COLORS.violet,
            borderDash: [3, 3],
            tension: 0.3,
            borderWidth: 2,
            yAxisID: 'yPercent'
          },
          {
            label: 'Grasso Viscerale (Livello)',
            data: days.map(d => d.visceralFat || 6.0),
            borderColor: COLORS.rose,
            tension: 0.3,
            borderWidth: 2.5,
            yAxisID: 'yVisceral'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: COLORS.text, font: { size: 11 } } }
        },
        scales: {
          x: { grid: { color: COLORS.grid }, ticks: { color: COLORS.text, font: { size: 10 } } },
          yPercent: {
            type: 'linear',
            position: 'left',
            grid: { color: COLORS.grid },
            ticks: { color: COLORS.amber, font: { size: 10 } },
            title: { display: true, text: 'Percentuale (%)', color: COLORS.amber, font: { size: 10 } },
            min: 10,
            max: 25
          },
          yVisceral: {
            type: 'linear',
            position: 'right',
            grid: { display: false },
            ticks: { color: COLORS.rose, font: { size: 10 } },
            title: { display: true, text: 'Liv. Viscerale', color: COLORS.rose, font: { size: 10 } },
            min: 1,
            max: 12
          }
        }
      }
    });
  }

  // 5. RENPHO CHART 2: LEAN QUALITY & HYDRATION
  const ctxLean = document.getElementById('leanQualityChart');
  if (ctxLean) {
    if (leanQualityChartInstance) leanQualityChartInstance.destroy();

    leanQualityChartInstance = new Chart(ctxLean, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Acqua Corporea (%)',
            data: days.map(d => d.bodyWater || 60.1),
            borderColor: COLORS.cyan,
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            fill: true,
            tension: 0.3,
            borderWidth: 2.5
          },
          {
            label: 'Muscolo Scheletrico (%)',
            data: days.map(d => d.skeletalMuscle || 53.8),
            borderColor: COLORS.emerald,
            tension: 0.3,
            borderWidth: 2.5
          },
          {
            label: 'Proteine (%)',
            data: days.map(d => d.protein || 19.0),
            borderColor: COLORS.violet,
            borderDash: [3, 3],
            tension: 0.3,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: COLORS.text, font: { size: 11 } } }
        },
        scales: {
          x: { grid: { color: COLORS.grid }, ticks: { color: COLORS.text, font: { size: 10 } } },
          y: {
            grid: { color: COLORS.grid },
            ticks: { color: COLORS.text, font: { size: 10 } },
            title: { display: true, text: 'Percentuale (%)', color: COLORS.text, font: { size: 10 } },
            min: 15,
            max: 70
          }
        }
      }
    });
  }
}
