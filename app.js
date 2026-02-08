let surnames = {};
let usRegions = {};

async function loadData() {
  surnames = await fetch("data/surnames.json").then(r => r.json());
  usRegions = await fetch("data/regions_us.json").then(r => r.json());
}

function normalize(name) {
  return name.trim().toLowerCase();
}

function getTopN(obj, n = 3) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

function analyzeSurname(name) {
  const key = normalize(name);
  const record = surnames[key];

  if (!record) {
    return {
      surname: name,
      origin: "Unknown",
      meaning: "No data available",
      regions: {}
    };
  }

  return {
    surname: name,
    origin: record.origin,
    meaning: record.meaning,
    regions: record.regions,
    usDetail: usRegions[key]
  };
}

function render(result) {
  document.getElementById("surnameTitle").textContent = result.surname;
  document.getElementById("originText").textContent =
    `${result.origin} — ${result.meaning}`;

  const regionsDiv = document.getElementById("regions");
  regionsDiv.innerHTML = "";

  for (const [country, data] of Object.entries(result.regions)) {
    const div = document.createElement("div");
    div.className = "region";
    div.innerHTML = `<strong>${country}</strong> — ${(data.percentage * 100).toFixed(1)}%`;
    regionsDiv.appendChild(div);

    if (country === "US" && result.usDetail) {
      if (result.usDetail.states) {
        const ul = document.createElement("ul");
        getTopN(result.usDetail.states).forEach(([state, pct]) => {
          ul.innerHTML += `<li>${state} — ${(pct * 100).toFixed(1)}%</li>`;
        });
        div.appendChild(ul);
      }
    }
  }

  document.getElementById("result").classList.remove("hidden");
}

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const name = document.getElementById("surnameInput").value;
  render(analyzeSurname(name));
});

loadData();
