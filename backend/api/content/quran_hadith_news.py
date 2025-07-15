# app/api/content/quran_hadith_news.py
from . import router
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.sqlalchemy.content import QuranVerse, Hadith, NewsArticle
import random
from sqlalchemy.sql.expression import func

@router.get("/quran-today")
def get_quran_today(db: Session = Depends(get_db)):
    verse = db.query(QuranVerse).order_by(func.random()).first()
    if not verse:
        raise HTTPException(status_code=404, detail="No verse found")
    return {
        "arabic": verse.arabic,
        "translation": verse.translation,
        "surah": verse.surah,
        "ayah": verse.ayah
    }

@router.get("/hadith-today")
def get_hadith_today(db: Session = Depends(get_db)):
    hadith = db.query(Hadith).order_by(func.random()).first()
    if not hadith:
        raise HTTPException(status_code=404, detail="No hadith found")
    return {"text": hadith.text, "source": hadith.source}

@router.get("/islamic-news")
def get_islamic_news(db: Session = Depends(get_db), limit: int = 5):
    articles = (db.query(NewsArticle)
                  .order_by(NewsArticle.date.desc())
                  .limit(limit).all())
    return [
        {
            "title": art.title,
            "link": art.link,
            "source": art.source,
            "date": art.date.isoformat()
        }
        for art in articles
    ]
