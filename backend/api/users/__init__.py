from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from backend.db.session import get_db
from backend.models.pydantic.user import UserUpdate, User
from backend.models.sqlalchemy.user_db import UserDB
from backend.models.pydantic.team import TeamMember as TeamMemberSchema
from backend.models.sqlalchemy.team import TeamMember 
from backend.core.security import oauth2_scheme
from backend.utils.security import decode_access_token
from typing import Optional, List

router = APIRouter()

@router.get("/profile")
def get_user_profile():
    return {"user": "Sample User"}

@router.put("/profile-update", response_model=User)
def update_profile(
    user_update: UserUpdate,
    token: Optional[str]  = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    # Decode the token and get the user's email
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    email = payload.get("sub")
    user = db.query(UserDB).filter(UserDB.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update fields on user with user_update data
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(user, key, value)

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.get("/team", response_model=List[TeamMemberSchema])
def get_team_members(db: Session = Depends(get_db)):
    return db.query(TeamMember).all()

from . import sidebar
from . import contributors