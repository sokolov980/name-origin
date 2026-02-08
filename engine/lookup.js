import surnames from "../data/surnames.json";

export function lookupSurname(surname) {
  for (const country in surnames) {
    if (surnames[country][surname]) {
      return {
        origin: country,
        ...surnames[country][surname]
      };
    }
  }
  return {};
}
