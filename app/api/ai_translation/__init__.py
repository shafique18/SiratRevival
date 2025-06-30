from fastapi import APIRouter

router = APIRouter()

@router.post("/translate")
def translate_text():
    return {"translated": "Translated content"}