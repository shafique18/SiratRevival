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
def get_islamic_news(db: Session = Depends(get_db), limit: int = 30):
    articles = (
        db.query(NewsArticle)
        .order_by(NewsArticle.date.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": art.id,
            "title": art.title,
            "author": art.author,
            "description": art.description,
            "content": art.content,
            "link": art.link,
            "image_url": art.image_url,
            "source_id": art.source_id,
            "source_name": art.source_name,
            "date": art.date.isoformat(),
            "created_at": art.created_at.isoformat() if art.created_at else None
        }
        for art in articles
    ]