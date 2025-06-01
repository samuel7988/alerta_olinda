// Inicialização do mapa centrado em Recife
const map = L.map('map').setView([-8.0476, -34.8770], 12);

// Camada de mapa do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Carregar denúncias do backend
function carregarDenuncias() {
  fetch('http://localhost:3000/api/denuncias')
    .then(response => response.json())
    .then(data => {
      data.forEach(denuncia => {
        L.marker([denuncia.latitude, denuncia.longitude])
          .addTo(map)
          .bindPopup(denuncia.descricao);
      });
    })
    .catch(error => console.error('Erro ao carregar denúncias:', error));
}
let marcador = null;
let localSelecionado = null;

// Clique no mapa
map.on('click', function(e) {
  localSelecionado = e.latlng;

  // Remove marcador anterior
  if (marcador) {
    map.removeLayer(marcador);
  }

  // Adiciona marcador no local clicado
  marcador = L.marker(localSelecionado).addTo(map);
});

// Função para enviar denúncia
function ativarDenuncia() {
  map.once('click', function(event) {
    const descricao = document.getElementById('descricao').value.trim();

    if (!descricao) {
      alert('Por favor, insira uma descrição para a denúncia.');
      return;
    }

    const { lat, lng } = event.latlng;

    fetch('http://localhost:3000/api/denuncias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        descricao: descricao,
        latitude: lat,
        longitude: lng
      })
    })
    .then(() => {
      alert('Denúncia registrada com sucesso!');
      carregarDenuncias();
    })
    .catch(error => console.error('Erro ao registrar denúncia:', error));
  });
}

// Carregar horários de coleta
function carregarColetas() {
  fetch('http://localhost:3000/api/coletas')
    .then(response => response.json())
    .then(data => {
      const ul = document.getElementById('listaColetas');
      ul.innerHTML = '';

      data.forEach(coleta => {
        const li = document.createElement('li');
        li.textContent = `${coleta.area}: ${coleta.horario}`;
        ul.appendChild(li);
      });
    })
    .catch(error => console.error('Erro ao carregar coletas:', error));
}

// Event listener para o botão
document.getElementById('btnDenunciar').addEventListener('click', ativarDenuncia);

// Inicialização
carregarDenuncias();
carregarColetas();

