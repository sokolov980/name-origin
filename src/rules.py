def match_suffix(surname, rules):
    for rule in rules:
        if surname.lower().endswith(rule["suffix"].lower()):
            return rule
    return None

def match_prefix(surname, rules):
    for rule in rules:
        if surname.lower().startswith(rule["prefix"].lower()):
            return rule
    return None
