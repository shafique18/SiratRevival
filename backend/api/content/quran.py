# routes/quran.py
from . import router
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.sqlalchemy.content import QuranVerse, QuranTranslation, Language
from sqlalchemy import func

@router.get("/quran/surah_names")
def get_surah_names(db: Session = Depends(get_db)):
    # Get unique surahs in the order they first appear in DB
    subquery = (
        db.query(
            QuranVerse.surah,
            func.min(QuranVerse.id).label("first_id")
        )
        .group_by(QuranVerse.surah)
        .subquery()
    )

    result = (
        db.query(subquery.c.surah)
        .order_by(subquery.c.first_id)  # maintain DB order
        .all()
    )

    names = [s[0] for s in result]
    return {"surah_names": names}


@router.get("/quran/surah/{surah_name}")
def get_surah(surah_name: str, db: Session = Depends(get_db)):
    verses = (
        db.query(QuranVerse)
        .filter(QuranVerse.surah == surah_name)
        .order_by(QuranVerse.ayah)
        .all()
    )

    result = []
    basmala = None

    for v in verses:
        verse_data = {
            "id": v.id,
            "ayah": v.ayah,
            "arabic": v.arabic,
            "default_translation": v.translation,
            "surah": v.surah,
            "translations": [
                {"language": t.language, "translation": t.translation}
                for t in v.translations
            ],
        }

        # Treat first ayah as Basmala (skip for Surah Tawbah)
        if v.ayah == 1 and surah_name != "At-Tawbah":
            basmala = verse_data
        else:
            result.append(verse_data)

    return {
        "surah": surah_name,
        "basmala": basmala,
        "verses": result
    }


@router.get("/quran/translations")
def get_available_translations(db: Session = Depends(get_db)):
    return db.query(Language).all()
