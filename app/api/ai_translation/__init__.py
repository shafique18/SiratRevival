from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os

router = APIRouter()

class TranslateRequest(BaseModel):
    text: str
    target_lang: str  # e.g., 'ur', 'en'

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@router.post("/translate")
async def translate_text(request: TranslateRequest):
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")

    prompt = f"Translate the following text to {request.target_lang}:\n\n{request.text}"

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    json_data = {
        "model": "gpt-4o-mini",  # or any OpenAI model
        "messages": [
            {"role": "system", "content": "You are a helpful translation assistant."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 100,
        "temperature": 0.3,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=json_data)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Translation API error")

        data = response.json()
        translated_text = data["choices"][0]["message"]["content"]
        return {"translated_text": translated_text}
