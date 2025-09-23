# backend/app/main.py
from . import router
from fastapi import Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from backend.db.session import SessionLocal
from backend.db.session import get_db
from backend.models.sqlalchemy.content import Scholar, Content, ContentMedium
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware


# Pydantic models
class ContentOut(BaseModel):
    id: int
    title: str
    medium: str
    source: Optional[str]
    url: Optional[str]
    thumbnail: Optional[str]
    published_at: Optional[str]
    summary: Optional[str]

    class Config:
        orm_mode = True

class ScholarOut(BaseModel):
    id: int
    name: str
    slug: Optional[str]
    bio: Optional[str]
    website: Optional[str]
    photo_url: Optional[str]

    class Config:
        orm_mode = True


@router.get("/scholars", response_model=List[ScholarOut])
def list_scholars(q: Optional[str] = Query(None), skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(Scholar)
    if q:
        query = query.filter(Scholar.name.ilike(f"%{q}%") | Scholar.bio.ilike(f"%{q}%"))
    scholars = query.order_by(Scholar.name).offset(skip).limit(limit).all()
    return scholars

@router.get("/scholars/{scholar_id}", response_model=ScholarOut)
def get_scholar(scholar_id: int, db: Session = Depends(get_db)):
    scholar = db.query(Scholar).filter(Scholar.id==scholar_id).first()
    if not scholar:
        raise HTTPException(status_code=404, detail="Scholar not found")
    return scholar

@router.get("/scholars/{scholar_id}/contents", response_model=List[ContentOut])
def get_scholar_contents(scholar_id: int, medium: Optional[ContentMedium] = None, skip:int=0, limit:int=50, db: Session = Depends(get_db)):
    q = db.query(Content).filter(Content.scholar_id==scholar_id)
    if medium:
        q = q.filter(Content.medium==medium)
    q = q.order_by(Content.published_at.desc().nullslast()).offset(skip).limit(limit)
    return q.all()

@router.get("/contents", response_model=List[ContentOut])
def search_contents(q: Optional[str] = Query(None), medium: Optional[ContentMedium] = None, skip:int=0, limit:int=50, db: Session = Depends(get_db)):
    qbase = db.query(Content)
    if q:
        qbase = qbase.filter(Content.title.ilike(f"%{q}%") | Content.summary.ilike(f"%{q}%"))
    if medium:
        qbase = qbase.filter(Content.medium==medium)
    qbase = qbase.order_by(Content.published_at.desc().nullslast()).offset(skip).limit(limit)
    return qbase.all()
