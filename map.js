/* =========================================================
   ConectBus — map.js
   Mapa interativo (Leaflet) com simulação das linhas de ônibus
   em Campos dos Goytacazes/RJ.
   ========================================================= */
(function () {
  'use strict';

  var mapEl = document.getElementById('liveMap');
  if (!mapEl || typeof L === 'undefined') return;

  // Centro aproximado de Campos dos Goytacazes/RJ
  var CENTER = [-21.7545, -41.3244];

  var map = L.map(mapEl, {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView(CENTER, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Rotas simuladas (pontos aproximados ao redor do centro da cidade)
  var routes = [
    {
      nome: 'Linha 01 — Centro/Guarus',
      cor: '#1E5FD9',
      pontos: [
        [-21.7545, -41.3244],
        [-21.7480, -41.3180],
        [-21.7395, -41.3110],
        [-21.7330, -41.3050],
        [-21.7280, -41.2990]
      ]
    },
    {
      nome: 'Linha 02 — Parque Prazeres',
      cor: '#7C3AED',
      pontos: [
        [-21.7545, -41.3244],
        [-21.7610, -41.3300],
        [-21.7670, -41.3360],
        [-21.7730, -41.3420],
        [-21.7790, -41.3480]
      ]
    },
    {
      nome: 'Linha 03 — Tapera/IFF',
      cor: '#17B26A',
      pontos: [
        [-21.7545, -41.3244],
        [-21.7490, -41.3320],
        [-21.7440, -41.3400],
        [-21.7390, -41.3480],
        [-21.7340, -41.3560]
      ]
    }
  ];

  var busIcon = function (cor) {
    return L.divIcon({
      className: 'bus-marker',
      html: '<div style="width:22px;height:22px;border-radius:50%;background:' + cor +
            ';display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,.35);border:2px solid #fff;">' +
            '<span style="width:8px;height:8px;background:#fff;border-radius:2px;"></span></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
  };

  var busMarkers = [];

  routes.forEach(function (route) {
    // Traçado da linha
    L.polyline(route.pontos, { color: route.cor, weight: 4, opacity: 0.55 }).addTo(map);

    // Ponto inicial (garagem/terminal)
    L.circleMarker(route.pontos[0], {
      radius: 5, color: route.cor, fillColor: route.cor, fillOpacity: 1, weight: 2
    }).addTo(map).bindPopup('<strong>' + route.nome + '</strong><br>Ponto de partida');

    // Marcador do ônibus (posição animada)
    var marker = L.marker(route.pontos[0], { icon: busIcon(route.cor) })
      .addTo(map)
      .bindPopup('<strong>' + route.nome + '</strong><br>Em rota');

    busMarkers.push({ marker: marker, pontos: route.pontos, segIndex: 0, t: 0 });
  });

  // Interpolação linear entre dois pontos [lat, lng]
  function lerp(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }

  // Anima os ônibus ao longo do trajeto (ida e volta)
  var STEP = 0.01;
  function tick() {
    busMarkers.forEach(function (bus) {
      var pontos = bus.pontos;
      var from = pontos[bus.segIndex];
      var to = pontos[bus.segIndex + 1] || pontos[0];
      var pos = lerp(from, to, bus.t);
      bus.marker.setLatLng(pos);

      bus.t += STEP;
      if (bus.t >= 1) {
        bus.t = 0;
        bus.segIndex = (bus.segIndex + 1) % (pontos.length - 1);
      }
    });
    window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);

  // Atualiza o card "Próxima chegada" periodicamente para simular tempo real
  var etaEl = document.getElementById('etaValue');
  if (etaEl) {
    setInterval(function () {
      var minutos = Math.floor(Math.random() * 8) + 1;
      etaEl.textContent = minutos + ' min';
    }, 6000);
  }

  // Ajusta o mapa quando a seção entra em vista (evita render incompleto)
  if ('IntersectionObserver' in window) {
    var mapObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          map.invalidateSize();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    mapObserver.observe(mapEl);
  }
})();