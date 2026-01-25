const searchInput = document.getElementById('search');
const suggestions = document.getElementById('suggestions');
const results = document.getElementById('results');
const toggleDark = document.getElementById('toggle-dark');

let surnameData = {}; // will hold current dataset

// Load JSON data (currently only English)
fetch('data/english.json')
  .then(response => response.json())
  .then(data => {
    surnameData = data;
  });

// Dark mode toggle
toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Autocomplete and search
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  suggestions.innerHTML = '';

  if (!query) return;

  const matches = Object.keys(surnameData)
    .filter(name => name.toLowerCase().startsWith(query))
    .slice(0, 5); // top 5 suggestions

  matches.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    li.addEventListener('click', () => selectSurname(name));
    suggestions.appendChild(li);
  });
});

// Enter key or select from suggestions
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const firstSuggestion = suggestions.querySelector('li');
    if (firstSuggestion) selectSurname(firstSuggestion.textContent);
  }
});

// Display results
function selectSurname(name) {
  const data = surnameData[name];
  if (!data) {
    results.innerHTML = `<p>No data found for "${name}".</p>`;
    return;
  }

  results.innerHTML = `
    <h2>${name}</h2>
    <p><strong>Meaning:</strong> ${data.meaning}</p>
    <p><strong>Origin:</strong> ${data.origin}</p>
    <p><strong>Prevalence:</strong> ${data.prevalence.join(', ')}</p>
    <p><strong>Context:</strong> ${data.context}</p>
  `;

  suggestions.innerHTML = '';
  searchInput.value = '';
}
