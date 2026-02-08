import usRegions from "../data/regions_us.json";
import migrationRules from "../data/migration_rules.json";

export function getRegions(name, lookup, rules) {
  if (usRegions[name]) {
    return {
      source: "observed",
      data: usRegions[name]
    };
  }

  if (rules.origin && migrationRules[rules.origin]) {
    return {
      source: "estimated",
      data: migrationRules[rules.origin]
    };
  }

  return { source: "unknown", data: {} };
}
