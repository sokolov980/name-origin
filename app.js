const searchInput = document.getElementById('search');
const suggestions = document.getElementById('suggestions');
const results = document.getElementById('results');
const toggleDark = document.getElementById('toggle-dark');
const mapContainer = document.getElementById('map');
const notableContainer = document.getElementById('notable');

let surnameData = {};
let map;
let geoLayer;

// Datasets (add country JSON names here)
const datasets = ['english', 'spanish']; 

// Load all datasets
Promise.all(datasets.map(name =>
  fetch(`data/${name}.json`).then(res => res.json())
)).then(allData => {
  surnameData = Object.assign({}, ...allData);
});

// Dark mode toggle
toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Autocomplete
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  suggestions.innerHTML = '';

  if (!query) return;

  const matches = Object.keys(surnameData)
    .filter(name => name.toLowerCase().startsWith(query))
    .slice(0,5);

  matches.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    li.addEventListener('click', () => selectSurname(name));
    suggestions.appendChild(li);
  });
});

// Enter key
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const firstSuggestion = suggestions.querySelector('li');
    if (firstSuggestion) selectSurname(firstSuggestion.textContent);
  }
});

// Show results
function selectSurname(name) {
  const data = surnameData[name];
  if (!data) {
    results.innerHTML = `<p>No data found for "${name}".</p>`;
    mapContainer.innerHTML = '';
    notableContainer.innerHTML = '';
    return;
  }

  // Basic info
  results.innerHTML = `
    <h2>${name}</h2>
    <p><strong>Meaning:</strong> ${data.meaning}</p>
    <p><strong>Origin:</strong> ${data.origin}</p>
    <p><strong>Context:</strong> ${data.context}</p>
  `;

  // Notable people
  renderNotable(data.notable_people);

  // Render map
  renderMap(data.prevalence);

  suggestions.innerHTML = '';
  searchInput.value = '';
}

// Notable people
function renderNotable(list) {
  if (!list || list.length === 0) {
    notableContainer.innerHTML = '';
    return;
  }
  notableContainer.innerHTML = `
    <h3>Notable People</h3>
    <ul>${list.map(p => `<li>${p}</li>`).join('')}</ul>
  `;
}

// Map rendering (supports nested subregions)
function renderMap(prevalence) {
  if (!map) {
    map = L.map(mapContainer).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);
  }

  if (geoLayer) {
    map.removeLayer(geoLayer);
  }

  fetch('maps/world.geojson')
    .then(res => res.json())
    .then(geojson => {

      geoLayer = L.geoJSON(geojson, {
        style: feature => {
          const country = feature.properties.NAME || feature.properties.ADMIN;
          let value = 0;

          // Handle nested prevalence
          if (prevalence[country]) {
            if (typeof prevalence[country] === 'number') {
              value = prevalence[country];
            } else if (typeof prevalence[country] === 'object') {
              value = Object.values(prevalence[country]).reduce((a,b)=>a+b,0);
            }
          }

          return {
            fillColor: `rgba(58, 134, 255, ${Math.min(0.05 + value/20, 0.8)})`,
            weight: 1,
            color: '#666',
            fillOpacity: 0.6
          };
        },
        onEachFeature: (feature, layer) => {
          const country = feature.properties.NAME || feature.properties.ADMIN;
          const countryData = prevalence[country];

          if (!countryData) {
            layer.bindTooltip(`${country}: 0%`);
          } else if (typeof countryData === 'number') {
            layer.bindTooltip(`${country}: ${countryData}%`);
          } else {
            // Nested subregions
            let tooltipText = `${country}:\n`;
            for (const sub in countryData) {
              tooltipText += `  ${sub}: ${countryData[sub]}%\n`;
            }
            layer.bindTooltip(tooltipText);
          }
        }
      }).addTo(map);

      map.fitBounds(geoLayer.getBounds());
    });
}
