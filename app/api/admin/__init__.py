# app/api/admin/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.db.session import get_db
from app.models.user_db import UserDB as User
from app.core.security import role_required
from app.utils.email_sender import send_email

router = APIRouter(prefix="/admin", tags=["Admin"])

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
        {"id": u.id, "email": u.email, "age_group": u.age_group,
         "roles": [r.name for r in u.roles]}
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
