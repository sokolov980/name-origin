export function explain({ lookup, rules, regions }) {
  const lines = [];

  if (lookup.origin) {
    lines.push(`Found exact surname match in dataset.`);
  }

  if (rules.matches?.length) {
    rules.matches.forEach(m =>
      lines.push(`Matched suffix "${m.suffix}" common in ${m.language} surnames.`)
    );
  }

  if (regions.source === "estimated") {
    lines.push(`Regional data inferred using migration patterns.`);
  }

  return lines;
}
