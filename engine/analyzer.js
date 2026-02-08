import { lookupSurname } from "./lookup.js";
import { applyRules } from "./rules.js";
import { getRegions } from "./regions.js";
import { scoreConfidence } from "./confidence.js";
import { explain } from "./explain.js";

export function analyzeSurname(input) {
  const surname = input.trim().toLowerCase();

  const lookup = lookupSurname(surname);
  const rules = applyRules(surname);

  const origin = lookup.origin || rules.originHint || "Unknown";
  const regions = origin !== "Unknown"
    ? getRegions(surname, origin)
    : {};

  return {
    surname: input,
    origin,
    meaning: lookup.meaning || "Unknown",
    variants: lookup.variants || [],
    regions,
    confidence: scoreConfidence({ lookup, regions, rules }),
    explanation: explain({ lookup, rules, regions })
  };
}
