/* =========================================================
   ConectBus — charts.js
   Gráfico de estudantes atendidos por mês (Chart.js)
   ========================================================= */
(function () {
  'use strict';

  var canvas = document.getElementById('studentsChart');
  if (!canvas || typeof Chart === 'undefined') return;

  var meses = ['Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
  var estudantes = [3200, 3850, 4300, 4900, 5400, 5750, 6000, 6180, 6300];

  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  var gridColor = isDark ? 'rgba(255,255,255,.08)' : 'rgba(23,19,39,.06)';
  var textColor = isDark ? '#B6B1CC' : '#5b6072';

  var ctx = canvas.getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height || 220);
  gradient.addColorStop(0, 'rgba(124,58,237,.35)');
  gradient.addColorStop(1, 'rgba(124,58,237,0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: meses,
      datasets: [{
        label: 'Estudantes atendidos',
        data: estudantes,
        borderColor: '#7C3AED',
        backgroundColor: gradient,
        borderWidth: 3,
        pointBackgroundColor: '#7C3AED',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1B1030',
          titleFont: { family: 'Space Grotesk' },
          padding: 10,
          callbacks: {
            label: function (item) {
              return item.formattedValue + ' estudantes';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { size: 11 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { size: 11 },
            callback: function (value) { return value.toLocaleString('pt-BR'); }
          }
        }
      }
    }
  });
})();