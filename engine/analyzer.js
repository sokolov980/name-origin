import { lookupSurname } from "./lookup.js";
import { applyRules } from "./rules.js";
import { getRegions } from "./regions.js";
import { scoreConfidence } from "./confidence.js";
import { explain } from "./explain.js";

export function analyzeSurname(name) {
  const normalized = name.trim().toLowerCase();

  const lookup = lookupSurname(normalized);
  const rules = applyRules(normalized);
  const regions = getRegions(normalized, lookup, rules);

  const confidence = scoreConfidence({ lookup, rules, regions });
  const explanation = explain({ lookup, rules, regions });

  return {
    surname: name,
    origin: lookup.origin || rules.origin || "Unknown",
    meaning: lookup.meaning || rules.meaning || "Unknown",
    regions,
    confidence,
    explanation
  };
}
