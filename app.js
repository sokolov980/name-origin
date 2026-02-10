let surnames = {};
let usRegions = {};
let cityCoords = {};

/* ------------------ Load Data ------------------ */

async function loadData() {
  surnames = await fetch("data/surnames.json").then(r => r.json());
  usRegions = await fetch("data/regions_us.json").then(r => r.json());
  cityCoords = await fetch("data/cities_us.json").then(r => r.json());
}

/* ------------------ Dark Mode ------------------ */

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (prefersDark) document.body.classList.add("dark");

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

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

  const usKey = Object.keys(usRegions).find(k => k.endsWith(":" + key));

  return {
    surname: name,
    origin: record.origin,
    meaning: record.meaning,
    regions: record.regions,
    usDetail: usKey ? usRegions[usKey] : null
  };
}

/* ------------------ Map Helpers ------------------ */

function resetUSMap(svg) {
  svg.querySelectorAll("path").forEach(p => {
    p.style.fill = "#eee";
  });

  svg.querySelectorAll(".city-dot").forEach(d => d.remove());
}

function project(lat, lon, svg) {
  const viewBox = svg.viewBox.baseVal;
  const x = (lon + 180) * (viewBox.width / 360);
  const y = (90 - lat) * (viewBox.height / 180);
  return { x, y };
}

function colorUSMap(stateData, svg) {
  const tooltip = document.getElementById("tooltip");

  resetUSMap(svg);

  for (const [state, pct] of Object.entries(stateData)) {
    const path = svg.getElementById(state);
    if (!path) continue;

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

function drawCityDots(cities, svg) {
  const tooltip = document.getElementById("tooltip");

  Object.entries(cities).forEach(([cityKey, pct]) => {
    const coord = cityCoords[cityKey];
    if (!coord) return;

    const { x, y } = project(coord.lat, coord.lon, svg);

    const circle = svg.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 4 + pct * 30);
    circle.setAttribute("class", "city-dot");
    circle.setAttribute("fill", "orange");
    circle.setAttribute("opacity", "0.85");

    circle.onmouseenter = () => {
      tooltip.style.display = "block";
      tooltip.textContent = `${cityKey} — ${(pct * 100).toFixed(1)}%`;
    };

    circle.onmousemove = e => {
      tooltip.style.left = e.pageX + 12 + "px";
      tooltip.style.top = e.pageY + 12 + "px";
    };

    circle.onmouseleave = () => {
      tooltip.style.display = "none";
    };

    svg.appendChild(circle);
  });
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

    if (country === "US" && result.usDetail?.states) {
      const ul = document.createElement("ul");
      const topStates = getTopN(result.usDetail.states);

      topStates.forEach(([state, pct]) => {
        ul.innerHTML += `<li>${state} — ${(pct * 100).toFixed(1)}%</li>`;
      });

      div.appendChild(ul);

      const stateData = {};
      topStates.forEach(([state, pct]) => stateData[state] = pct);

      const mapObj = document.getElementById("usMap");
      const applyMap = () => {
        const svg = mapObj.contentDocument;
        colorUSMap(stateData, svg);

        if (result.usDetail.cities) {
          drawCityDots(result.usDetail.cities, svg);
        }
      };

      if (mapObj.contentDocument) {
        applyMap();
      } else {
        mapObj.addEventListener("load", applyMap, { once: true });
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
