export function scoreConfidence({ lookup, regions, rules }) {
  let score = 0;

  if (lookup.meaning) score += 0.4;
  if (regions.source === "observed") score += 0.4;
  if (rules.match) score += 0.2;

  return Math.min(score, 1);
}
