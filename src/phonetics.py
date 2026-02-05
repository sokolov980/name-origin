def simple_phonetic(name):
    return "".join([c for c in name.lower() if c in "aeiou"])

def phonetic_score(a, b):
    return 1.0 if simple_phonetic(a) == simple_phonetic(b) else 0.0
