export function renderMap(regions) {
  const svg = document.getElementById("map");
  svg.innerHTML = "";

  regions.forEach(region => {
    const path = document.querySelector(`[data-id="${region.code}"]`);
    if (path) {
      path.style.fill = `rgba(0, 0, 255, ${region.percentage})`;
    }
  });
}
