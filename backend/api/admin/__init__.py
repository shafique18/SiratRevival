# app/api/admin/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from backend.db.session import get_db
from backend.models.sqlalchemy.user_db import UserDB as User
from backend.core.security import role_required
from backend.utils.email_sender import send_email

router = APIRouter(prefix="/admin", tags=["Admin"])

#AdmiAPIroute

class ScheduleItem(BaseModel):
    title: str
    content: str
    visible_to: List[str]

@router.get("/users", response_model=List[dict])
def list_users(q: str = None, db: Session = Depends(get_db),
               admin=Depends(role_required(["admin"]))):
    query = db.query(User)
    if q:
        query = query.filter(User.email.ilike(f"%{q}%"))
    return [
        {"id": u.id, "email": u.email,
         "roles": [u.user_role] if u.user_role else [],
         "isverified":u.is_verified}
        for u in query
    ]

@router.post("/users/{user_id}/approve")
def approve_user(user_id: int, db: Session = Depends(get_db),
                 admin=Depends(role_required(["admin"]))):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "Not found")
    # Send approval email
    send_email(
        to_email=user.email,
        subject="Your account has been approved",
        body="Congratulations! Your SiratRevival account is now approved."
    )
    return {"status": "approved", "user_id": user.id}

@router.post("/schedule")
def schedule_content(item: ScheduleItem,
                     admin=Depends(role_required(["admin"]))):
    # Stub: integration with scheduling logic (e.g. DB or Celery)
    return {"status": "scheduled", "item": item}
