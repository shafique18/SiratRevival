from . import router
from fastapi import Depends, Query, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.sqlalchemy.user_db import UserDB, UserRole, RoleEnum, InvolvementRequest
from backend.models.pydantic.user import Contributor
from backend.models.pydantic.team import InvolvementRequestCreate
from backend.core.security import get_current_user

@router.get("/contributors", response_model=List[Contributor])
def get_contributors(db: Session = Depends(get_db)):
    try:
        users = db.query(UserDB).filter(
            UserDB.user_role.in_([UserRole.WRITER, UserRole.REVIEWER, UserRole.SCHOLAR])
        ).all()

        return [Contributor.from_orm(user) for user in users]
    except Exception as e:
        print(str(e))


@router.post("/get-involved")
def submit_request(
        data: InvolvementRequestCreate,
        db: Session = Depends(get_db),
    ):

    normal_roles = {
        "GROUP_0_5", "GROUP_6_15", "GROUP_16_25", "GROUP_26_PLUS"
    }

    user: Optional[UserDB] = db.query(UserDB).filter(UserDB.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=400,
            detail="No user found with this email. Please register before submitting a request."
        )

    if user.user_role not in normal_roles or user.user_role == data.role:
        raise HTTPException(
            status_code=400,
            detail="You must be registered with a valid user role before requesting contributor access. Or you already have requested role."
        )
    
    pending_request = (
        db.query(InvolvementRequest)
        .filter(
            InvolvementRequest.user_email == user.email,
            InvolvementRequest.is_approved == False
        )
        .first()
    )
    if pending_request:
        print("Pending request found")
        raise HTTPException(
            status_code=400,
            detail="You already have a pending request with admin. Please wait for approval before submitting another request."
        )

    if data.role not in RoleEnum.__members__:
        print(f"Invalid requested role: {data.role}")
        raise HTTPException(status_code=400, detail="Invalid role.")

    request = InvolvementRequest(
        user_email=user.email,
        role=data.role,
        message=data.message,
    )
    db.add(request)
    db.commit()

    print("Request submitted successfully")
    return {"msg": "Request submitted"}
