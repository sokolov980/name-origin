import usRegions from "../data/regions_us.json";
import migration from "../data/migration_rules.json";

export function getRegions(surname, origin) {
  const key = `${origin}:${surname}`;

  if (usRegions[key]) {
    return {
      source: "observed",
      us: usRegions[key]
    };
  }

  if (migration[origin]?.US) {
    return {
      source: "estimated",
      us: migration[origin].US
    };
  }

  return { source: "unknown" };
}
