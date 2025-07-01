# app/api/content/quran_hadith_news.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import QuranVerse, Hadith, NewsArticle

router = APIRouter(prefix="/content", tags=["content"])

@router.get("/quran-today")
def get_quran_today(db: Session = Depends(get_db)):
    verse = db.query(QuranVerse).filter(QuranVerse.is_today == True).first()
    if not verse:
        raise HTTPException(status_code=404, detail="No verse for today")
    return {
        "arabic": verse.arabic,
        "translation": verse.translation,
        "surah": verse.surah,
        "ayah": verse.ayah
    }

@router.get("/hadith-today")
def get_hadith_today(db: Session = Depends(get_db)):
    hadith = db.query(Hadith).filter(Hadith.is_today == True).first()
    if not hadith:
        raise HTTPException(status_code=404, detail="No hadith for today")
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
