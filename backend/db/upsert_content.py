# backend/app/crud.py
from sqlalchemy import select, update
from sqlalchemy.exc import NoResultFound
from backend.models.sqlalchemy.content import Scholar, Content, ContentMedium
from sqlalchemy.orm import Session
from slugify import slugify
import json
from datetime import datetime

def get_or_create_scholar(session: Session, name: str, website=None, bio=None, photo_url=None, country=None):
    stmt = select(Scholar).where(Scholar.name == name)
    scholar = session.execute(stmt).scalars().first()
    if scholar:
        updated = False
        if website and scholar.website != website:
            scholar.website = website; updated = True
        if bio and scholar.bio != bio:
            scholar.bio = bio; updated = True
        if photo_url and scholar.photo_url != photo_url:
            scholar.photo_url = photo_url; updated = True
        if country and scholar.country != country:
            scholar.country = country; updated = True
        if updated:
            scholar.updated_at = datetime.utcnow()
            session.add(scholar); session.commit()
        return scholar

    slug = slugify(name)[:250]
    scholar = Scholar(name=name, slug=slug, website=website, bio=bio, photo_url=photo_url, country=country)
    session.add(scholar)
    session.commit()
    session.refresh(scholar)
    return scholar

def upsert_content(session: Session, scholar_id:int, data:dict):
    """
    data must include: title, source, external_id, url, medium (ContentMedium or string)
    Will insert or update on conflict (source+external_id).
    """
    # basic validation
    source = data.get("source")
    external_id = data.get("external_id")
    if not source or not external_id:
        raise ValueError("source and external_id required")

    stmt = select(Content).where(Content.source==source, Content.external_id==external_id)
    existing = session.execute(stmt).scalars().first()
    if existing:
        # update some fields if changed
        updated = False
        for k in ["title","summary","url","thumbnail","duration_seconds","published_at","language","metadata","slug"]:
            if k in data and getattr(existing, k) != data.get(k):
                setattr(existing, k, data.get(k))
                updated = True
        if updated:
            existing.updated_at = datetime.utcnow()
            session.add(existing)
            session.commit()
        return existing

    # create new
    c = Content(
        scholar_id=scholar_id,
        title=data.get("title"),
        slug=data.get("slug"),
        summary=data.get("summary"),
        medium=data.get("medium"),
        source=source,
        external_id=external_id,
        url=data.get("url"),
        thumbnail=data.get("thumbnail"),
        duration_seconds=data.get("duration_seconds"),
        published_at=data.get("published_at"),
        language=data.get("language"),
        metadata=json.dumps(data.get("metadata", {}))
    )
    session.add(c)
    session.commit()
    session.refresh(c)
    return c
