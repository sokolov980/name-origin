import suffixRules from "../data/suffix_rules.json";

export function applyRules(name) {
  for (const suffix in suffixRules) {
    if (name.endsWith(suffix)) {
      return {
        originHint: suffixRules[suffix].language,
        type: suffixRules[suffix].type,
        match: suffix
      };
    }
  }
  return {};
}
