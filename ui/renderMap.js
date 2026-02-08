export function renderUSMap(stateData) {
  for (const state in stateData) {
    const el = document.getElementById(state);
    if (!el) continue;

    const intensity = Math.min(stateData[state], 1);
    el.style.fill = `rgba(30, 90, 200, ${intensity})`;
    el.title = `${state}: ${(intensity * 100).toFixed(1)}%`;
  }
}
