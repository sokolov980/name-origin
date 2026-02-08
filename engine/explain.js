export function explain({ lookup, rules, regions }) {
  const lines = [];

  if (lookup.meaning)
    lines.push("Exact surname match found in curated dataset.");

  if (rules.match)
    lines.push(`Matched suffix "${rules.match}" typical of ${rules.originHint}.`);

  if (regions.source === "estimated")
    lines.push("Regional data inferred using historical migration patterns.");

  return lines;
}
