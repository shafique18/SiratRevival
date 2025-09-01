# backend/api/main.py
from . import router
from typing import Optional, List, Dict, Any
from fastapi import Query, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from backend.db.session import SessionLocal
from backend.models.sqlalchemy import Hadith, HadithTranslation
from backend.utils.category_map import infer_category, DISPLAY_ORDER


def serialize_hadith(h: Hadith, lang: str = "ar") -> Dict[str, Any]:
    """
    Serialize Hadith into JSON, providing all translations and dynamic language selection.
    """
    # Build a map of translations: language -> text
    trans_map = {t.language: t.translated_text for t in (h.translations or [])}
    trans_map["ar"] = h.text  # Ensure Arabic is always available

    # Pick the requested language, fallback to Arabic
    text = trans_map.get(lang) or h.text

    # Infer category based on chapter and English text
    english_text = trans_map.get("en")
    category = infer_category(h.chapter, english_text)

    return {
        "id": h.id,
        "reference": h.reference,
        "text": text,
        "book": h.book,
        "chapter": h.chapter,
        "number": h.number,
        "source": h.source,
        "category": category,
        "available_languages": list(trans_map.keys()),  # All available languages
        "translations": trans_map,  # Include all texts for frontend dynamic switching
    }


@router.get("/hadiths/sources")
def list_sources():
    db: Session = SessionLocal()
    try:
        raw_sources = db.query(Hadith.source).filter(Hadith.source != None).distinct().all()
        sources = [row[0] for row in raw_sources if row[0]]
        return [
            {"slug": str(s), "name": str(s).replace("-", " ").title()}
            for s in sorted(sources)
        ]
    finally:
        db.close()


@router.get("/hadiths/categories")
def list_categories():
    if isinstance(DISPLAY_ORDER, dict):
        return [str(c) for c in DISPLAY_ORDER.keys()]
    return [str(c) for c in DISPLAY_ORDER]


@router.get("/hadiths")
def get_hadiths(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    source: Optional[str] = None,
    category: Optional[str] = None,
    q: Optional[str] = None,
    language: str = Query("en", regex="^(ar|en|ur)$"),
):
    db: Session = SessionLocal()
    try:
        query = db.query(Hadith).options(joinedload(Hadith.translations))

        if source:
            query = query.filter(Hadith.source == source)

        if q:
            like = f"%{q}%"
            query = query.outerjoin(HadithTranslation).filter(
                (Hadith.text.ilike(like)) |
                (HadithTranslation.translated_text.ilike(like)) |
                (Hadith.chapter.ilike(like)) |
                (Hadith.book.ilike(like))
            ).distinct()

        total = query.count()
        hadiths = query.order_by(Hadith.id.asc()).offset((page - 1) * page_size).limit(page_size).all()

        items = []
        for h in hadiths:
            payload = serialize_hadith(h, lang=language)
            if category and payload["category"] != category:
                continue
            items.append(payload)

        return {
            "page": page,
            "page_size": page_size,
            "returned": len(items),
            "total_estimate": total,
            "items": items,
        }
    finally:
        db.close()


@router.get("/hadiths/{hadith_id}")
def get_hadith_detail(hadith_id: int, language: str = Query("en", regex="^(ar|en|ur)$")):
    db: Session = SessionLocal()
    try:
        h = db.query(Hadith).options(joinedload(Hadith.translations)).filter(Hadith.id == hadith_id).first()
        if not h:
            raise HTTPException(status_code=404, detail="Hadith not found")
        return serialize_hadith(h, lang=language)
    finally:
        db.close()
