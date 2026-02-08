export function scoreConfidence({ lookup, rules, regions }) {
  let score = 0;

  if (lookup.origin) score += 0.4;
  if (rules.matches?.length) score += 0.3;
  if (regions.source === "observed") score += 0.3;

  return Math.min(score, 1);
}
