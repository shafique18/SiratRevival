from fastapi import APIRouter

router = APIRouter()

@router.get("/articles")
def list_articles():
    return [{"id": 1, "title": "What is Islam?"}]