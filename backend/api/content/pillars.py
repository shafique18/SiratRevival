from . import router
from fastapi import Depends
from backend.db.session import get_db
from sqlalchemy.orm import Session
from backend.models.sqlalchemy.content import ContentDB
from backend.models.pydantic.content import PillarsResponse, PillarSection, SectionTranslation
from datetime import datetime

def get_pillars(db: Session) -> PillarsResponse:
    contents = (db.query(ContentDB)
                .join(ContentDB.module)
                .filter(ContentDB.module.has(title="PILLARS"))
                .all())
    sections = []
    for c in contents:
        translations = []
        for t in c.translations:
            translations.append(SectionTranslation(
                language=t.language,
                text=t.translated_text,
                audio_url=t.translated_url
            ))
        sections.append(PillarSection(
            section_key=f"sec_{c.id}",
            title=c.module.title,  # adjust per real schema
            translations=translations
        ))
    return PillarsResponse(sections=sections)

@router.get("/pillars", response_model=PillarsResponse)
def read_pillars(db: Session = Depends(get_db)):
    return get_pillars(db)
