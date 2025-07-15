from fastapi import APIRouter

router = APIRouter(tags=["content"])

@router.get("/articles")
def list_articles():
    return [{"id": 1, "title": "What is Islam?"}]

from . import quran_hadith_news