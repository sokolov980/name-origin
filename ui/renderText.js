export function renderText(result) {
  document.getElementById("surnameTitle").textContent = result.surname;
  document.getElementById("originText").textContent =
    `${result.origin} — ${result.meaning}`;

  document.getElementById("confidence").textContent =
    `Confidence: ${(result.confidence * 100).toFixed(0)}%`;

  const explain = document.getElementById("explanation");
  explain.innerHTML = result.explanation.map(e => `<li>${e}</li>`).join("");
}
