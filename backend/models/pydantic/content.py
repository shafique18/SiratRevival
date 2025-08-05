from pydantic import BaseModel
from typing import List

class SectionTranslation(BaseModel):
    language: str
    text: str
    audio_url: str  # URL to translated or synthesized audio

class PillarSection(BaseModel):
    section_key: str
    title: str
    translations: List[SectionTranslation]

class PillarsResponse(BaseModel):
    sections: List[PillarSection]
