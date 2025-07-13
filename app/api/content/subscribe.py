from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.sqlalchemy.user_db import Subscriber
from datetime import datetime

router = APIRouter(tags=["Scubscribe"])

class SubscribeRequest(BaseModel):
    email: EmailStr

@router.post("/subscribe", status_code=status.HTTP_201_CREATED)
def subscribe(sub: SubscribeRequest, db: Session = Depends(get_db)):
    # Check if already subscribed
    existing = db.query(Subscriber).filter(Subscriber.email == sub.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already subscribed.")

    new_subscriber = Subscriber(email=sub.email, subscribed_at=datetime.utcnow())
    db.add(new_subscriber)
    db.commit()
    db.refresh(new_subscriber)
    return {"message": "Subscription successful"}
