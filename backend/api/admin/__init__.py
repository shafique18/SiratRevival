# app/api/admin/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from backend.db.session import get_db
from backend.models.sqlalchemy.user_db import UserDB as User
from backend.models.sqlalchemy.user_db import RoleEnum, InvolvementRequest
from backend.core.security import role_required
from backend.utils.email_sender import send_email
from backend.models.sqlalchemy.team import  Partner, TeamMember

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



@router.post("/admin/approve/{request_id}")
def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    admin=Depends(role_required(["admin"]))
):
    req = db.query(InvolvementRequest).filter_by(id=request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    req.is_approved = True
    db.commit()

    user = db.query(User).get(req.user_id)

    if req.role in ["WRITER", "REVIEWER", "SCHOLAR"]:
        user.role = req.role
        db.commit()
        send_email(
            to_email=user.email,
            subject=f"You're now a {req.role.title()} at SiratRevival!",
            body=f"<p>Congratulations! You've been approved as a {req.role.lower()}.</p>"
        )
    elif req.role == "PARTNER":
        partner = Partner(user_id=user.id, message=req.message)
        db.add(partner)
        db.commit()
        send_email(
            to_email=user.email,
            subject="You've been approved as a Partner",
            body="<p>Welcome aboard! We're excited to partner with you at SiratRevival.</p>"
        )
    elif req.role == "TECH":
        team_member = TeamMember(
            name=user.username,
            role=req.role,
            image="",
            description=req.message
        )
        db.add(team_member)
        db.commit()
        send_email(
            to_email=user.email,
            subject="You've joined the Tech Team!",
            body="<p>Welcome to the tech team! You've been added to the team page.</p>"
        )

    return {"msg": "User approved and notified."}


@router.get("/admin/involvement-requests")
def list_requests(db: Session = Depends(get_db), admin=Depends(role_required(["admin"]))):
    requests = (
        db.query(InvolvementRequest)
        .filter(InvolvementRequest.is_approved == False)
        .all()
    )

    return [{
        "id": r.id,
        "role": r.role,
        "message": r.message,
        "is_approved": r.is_approved,
        "user": {
            "id": r.user.id,
            "username": r.user.username,
            "email": r.user.email}
            } 
            for r in requests]