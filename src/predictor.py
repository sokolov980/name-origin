from .rules import match_suffix, match_prefix
from .phonetics import phonetic_score
from .utils import load_csv

class SurnamePredictor:
    def __init__(self, data_path="data/"):
        self.seed = load_csv(data_path + "surnames_seed.csv")
        self.suffix_rules = load_csv(data_path + "suffix_rules.csv")
        self.prefix_rules = load_csv(data_path + "prefix_rules.csv")

    def predict(self, surname: str) -> dict:
        surname = surname.strip()

        # 1. Exact match
        for row in self.seed:
            if row["surname"].lower() == surname.lower():
                return {
                    "origin": row["origin"],
                    "meaning": row["meaning"],
                    "region": row["region"],
                    "confidence": 0.95,
                    "source": "exact_match"
                }

        # 2. Prefix / suffix rules
        prefix_hit = match_prefix(surname, self.prefix_rules)
        suffix_hit = match_suffix(surname, self.suffix_rules)

        if prefix_hit or suffix_hit:
            hit = prefix_hit or suffix_hit
            return {
                "origin": hit["origin"],
                "meaning": hit["meaning_hint"],
                "region": hit["region"],
                "confidence": float(hit["confidence"]),
                "source": "rule_based"
            }

        # 3. Fallback
        return {
            "origin": "Unknown",
            "meaning": "Unknown",
            "region": "Unknown",
            "confidence": 0.2,
            "source": "fallback"
        }
