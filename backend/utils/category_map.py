# backend/api/utils/category_map.py
from typing import Optional

CATEGORIES = {
    "life": [
        "life", "world", "hereafter", "death", "qadr", "fate", "patience", "gratitude", "sincerity",
        "virtue", "character", "manners", "ethics", "zuhd", "asceticism"
    ],
    "family": [
        "marriage", "spouse", "wife", "husband", "divorce", "children", "parents", "kinship",
        "relatives", "inheritance", "dowry", "breastfeeding", "maintenance", "khula"
    ],
    "day-to-day life": [
        "food", "drink", "dress", "clothes", "etiquette", "greetings", "sleep", "dreams", "travel",
        "animals", "medicine", "health", "illness", "cleanliness", "wudu", "eating", "walking",
        "market", "buying", "selling"
    ],
    "friends": [
        "companionship", "brotherhood", "neighbors", "friendship", "visiting", "trust", "backbiting",
        "slander", "envy", "jealousy"
    ],
    "business": [
        "trade", "usury", "riba", "interest", "contracts", "pledge", "debt", "loan", "partnership",
        "sale", "mortgage", "rental", "market", "weights", "measures", "fraud"
    ],
    # a few bonus categories used in UI (not required by DB)
    "worship": [
        "prayer", "salah", "salat", "zakat", "fasting", "sawm", "ramadan", "hajj", "pilgrimage",
        "dua", "supplication", "recitation", "quran", "purification", "tayammum", "witr", "eid"
    ],
    "character": [
        "manners", "character", "generosity", "mercy", "forgiveness", "truthfulness", "humility",
        "anger", "justice", "kindness"
    ],
}

DISPLAY_ORDER = ["life", "family", "day-to-day life", "friends", "business", "worship", "character"]

def infer_category(chapter_en: Optional[str], english_text: Optional[str]) -> Optional[str]:
    hay = f"{chapter_en or ''} {english_text or ''}".lower()
    best_match = None
    for cat, keywords in CATEGORIES.items():
        if any(k in hay for k in keywords):
            best_match = cat
            break
    return best_match
