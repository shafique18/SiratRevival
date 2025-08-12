from . import router
from fastapi import Depends
from backend.db.session import get_db
from sqlalchemy.orm import Session
from backend.models.sqlalchemy.content import ContentDB
from backend.models.pydantic.content import PillarsResponse, PillarSection, SectionTranslation
from datetime import datetime

from collections import defaultdict

def get_pillars(db: Session) -> PillarsResponse:
    # Fetch all content for module PILLARS
    contents = (db.query(ContentDB)
                .join(ContentDB.module)
                .filter(ContentDB.module.has(title="PILLARS"))
                .order_by(ContentDB.id)
                .all())

    # Group content by pillar index (based on seeding order)
    # We assume each pillar has exactly one text content, one audio, one video in that order
    # Better if you have a pillar_id or some grouping key, then group by it instead
    pillars_data = defaultdict(dict)  # key: pillar_index, value: dict with keys 'text', 'audio', 'video'

    # We'll assume text content types are 'text', audio 'audio', video 'video'
    # We'll assign pillar index by counting text content entries
    
    pillar_index = -1
    for c in contents:
        if c.type == 'text':
            pillar_index += 1
            pillars_data[pillar_index]['text'] = c
        elif c.type == 'audio':
            pillars_data[pillar_index]['audio'] = c
        elif c.type == 'video':
            pillars_data[pillar_index]['video'] = c

    sections = []

    for idx, data in pillars_data.items():
        text_content = data.get('text')
        audio_content = data.get('audio')
        video_content = data.get('video')

        if not text_content:
            continue

        translations = []
        for t in text_content.translations:
            translations.append(SectionTranslation(
                language=t.language,
                text=t.translated_text,
                audio_url=t.translated_url
            ))

        audio_path = audio_content.content_url if audio_content else None
        video_path = video_content.content_url if video_content else None

        sections.append(PillarSection(
            section_key=f"sec_{text_content.id}",
            title=text_content.module.title,
            translations=translations,
            audioPath=audio_path,
            videoPath=video_path
        ))

    return PillarsResponse(sections=sections)


@router.get("/pillars", response_model=PillarsResponse)
def read_pillars(db: Session = Depends(get_db)):
    return get_pillars(db)
