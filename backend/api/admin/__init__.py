# app/api/admin/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from backend.db.session import get_db
from backend.models.sqlalchemy.user_db import UserDB as User
from backend.models.sqlalchemy.user_db import RoleEnum, InvolvementRequest, UserRole
from backend.core.security import role_required
from backend.utils.email_sender import send_email
from backend.models.sqlalchemy.team import  Partner, TeamMember
from backend.models.pydantic.team import RejectRequestBody


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


@router.post("/approve/{request_id}")
def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    admin=Depends(role_required(["admin"]))
):
    # 1. Fetch the request
    req = db.query(InvolvementRequest).filter_by(id=request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # 2. Fetch the user
    user = db.query(User).filter_by(email=req.user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 3. Mark request approved
    req.is_approved = True

    # 4. Update user_role if applicable
    if req.role in ["WRITER", "REVIEWER", "SCHOLAR"]:
        # Assign enum member safely
        try:
            user.user_role = UserRole(req.role.value)
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid role in request")

    # 5. Handle PARTNER role
    elif req.role == "PARTNER":
        partner = Partner(user_id=user.id, message=req.message)
        db.add(partner)

    # 6. Handle TECH role
    elif req.role == "TECH":
        team_member = TeamMember(
            name=user.username,
            role=req.role,
            image="",
            description=req.message
        )
        db.add(team_member)

    # 7. Commit all changes once after all modifications
    db.commit()

    # 8. Send notification emails
    if req.role in ["WRITER", "REVIEWER", "SCHOLAR"]:
        send_email(
            to_email=req.user_email,
            subject=f"You're now a {req.role.title()} at SiratRevival!",
            body=f"<p>Congratulations! You've been approved as a {req.role.lower()}.</p>"
        )
    elif req.role == "PARTNER":
        send_email(
            to_email=user.email,
            subject="You've been approved as a Partner",
            body="<p>Welcome aboard! We're excited to partner with you at SiratRevival.</p>"
        )
    elif req.role == "TECH":
        send_email(
            to_email=user.email,
            subject="You've joined the Tech Team!",
            body="<p>Welcome to the tech team! You've been added to the team page.</p>"
        )

    return {"msg": "User approved and notified."}


@router.get("/involvement-requests")
def list_requests(db: Session = Depends(get_db), admin=Depends(role_required(["admin"]))):
    requests = (
        db.query(InvolvementRequest)
        .filter(InvolvementRequest.is_approved == False)
        .all()
    )

    return [{
        "id":r.id,
        "email": r.user_email,
        "role": r.role,
        "message": r.message,
        "is_approved": r.is_approved
        }
            for r in requests]

@router.post("/reject/{request_id}")
def reject_request(
    request_id: int,
    body: RejectRequestBody,
    db: Session = Depends(get_db),
    admin=Depends(role_required(["admin"]))
):
    req = db.query(InvolvementRequest).filter_by(id=request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    user = db.query(User).filter_by(email=req.user_email).first()

    db.delete(req)
    db.commit()

    send_email(
        to_email=user.email,
        subject="Your Involvement Request was Rejected",
        body=f"<p>Your request to join as <strong>{req.role}</strong> was rejected.</p><p><em>{body.message}</em></p>"
    )

    return {"msg": "Request rejected and user notified."}