import suffixRules from "../data/suffix_rules.json";

export function applyRules(surname) {
  const matches = [];

  for (const suffix in suffixRules) {
    if (surname.endsWith(suffix)) {
      matches.push({
        type: "suffix",
        suffix,
        ...suffixRules[suffix]
      });
    }
  }

  if (!matches.length) return {};

  return {
    origin: matches[0].language,
    meaning: matches[0].type,
    matches
  };
}
