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

    # 1. Get user by email
    user: Optional[UserDB] = db.query(UserDB).filter(UserDB.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=400,
            detail="No user found with this email. Please register before submitting a request."
        )

    # 2. Check that user has at least one normal role
    user_role = user.user_role
    if user_role not in normal_roles:
        raise HTTPException(
            status_code=400,
            detail="You must be registered with a valid user role before requesting contributor access."
        )

    # 3. Validate role
    if data.role not in RoleEnum.__members__:
        raise HTTPException(status_code=400, detail="Invalid role.")

    # 4. Submit request
    request = InvolvementRequest(
        user_email=user.email,
        role=data.role,
        message=data.message,
    )
    db.add(request)
    db.commit()
    return {"msg": "Request submitted"}
