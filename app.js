let surnames = {};
let usRegions = {};

async function loadData() {
  surnames = await fetch("data/surnames.json").then(r => r.json());
  usRegions = await fetch("data/regions_us.json").then(r => r.json());
}

/* ------------------ Utilities ------------------ */

function normalize(name) {
  return name.trim().toLowerCase();
}

function getTopN(obj, n = 3) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

/* ------------------ Analysis ------------------ */

function analyzeSurname(name) {
  const key = normalize(name);
  const record = surnames[key];

  if (!record) {
    return {
      surname: name,
      origin: "Unknown",
      meaning: "No data available",
      regions: {},
      usDetail: null
    };
  }

  return {
    surname: name,
    origin: record.origin,
    meaning: record.meaning,
    regions: record.regions,
    usDetail: usRegions[key] || null
  };
}

/* ------------------ Map Logic ------------------ */

function resetUSMap() {
  const mapObj = document.getElementById("usMap");
  const svg = mapObj.contentDocument;
  if (!svg) return;

  svg.querySelectorAll("path").forEach(p => {
    p.style.fill = "#eee";
  });
}

function colorUSMap(stateData) {
  const mapObj = document.getElementById("usMap");
  const tooltip = document.getElementById("tooltip");

  const svg = mapObj.contentDocument;
  if (!svg) return;

  resetUSMap();

  for (const [state, pct] of Object.entries(stateData)) {
    const path = svg.getElementById(state);
    if (!path) continue;

    // Color intensity based on percentage
    path.style.fill = `rgba(40, 90, 200, ${Math.min(0.85, pct + 0.2)})`;
    path.style.cursor = "pointer";

    path.onmouseenter = () => {
      tooltip.style.display = "block";
      tooltip.textContent = `${state}: ${(pct * 100).toFixed(1)}%`;
    };

    path.onmousemove = e => {
      tooltip.style.left = e.pageX + 12 + "px";
      tooltip.style.top = e.pageY + 12 + "px";
    };

    path.onmouseleave = () => {
      tooltip.style.display = "none";
    };
  }
}

/* ------------------ Render ------------------ */

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

    // US state breakdown
    if (country === "US" && result.usDetail?.states) {
      const ul = document.createElement("ul");
      const topStates = getTopN(result.usDetail.states);

      topStates.forEach(([state, pct]) => {
        ul.innerHTML += `<li>${state} — ${(pct * 100).toFixed(1)}%</li>`;
      });

      div.appendChild(ul);

      // Build map data (top 3 states)
      const stateData = {};
      topStates.forEach(([state, pct]) => {
        stateData[state] = pct;
      });

      // Wait for SVG load if needed
      const mapObj = document.getElementById("usMap");
      if (mapObj.contentDocument) {
        colorUSMap(stateData);
      } else {
        mapObj.addEventListener("load", () => colorUSMap(stateData), { once: true });
      }
    }
  }

  document.getElementById("result").classList.remove("hidden");
}

/* ------------------ Events ------------------ */

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const name = document.getElementById("surnameInput").value;
  render(analyzeSurname(name));
});

loadData();
