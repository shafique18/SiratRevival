from . import router
from fastapi import Depends, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.sqlalchemy.user_db import UserDB, UserRole
from backend.models.pydantic.user import Contributor

@router.get("/contributors", response_model=List[Contributor])
def get_contributors(db: Session = Depends(get_db)):
    try:
        users = db.query(UserDB).filter(
            UserDB.user_role.in_([UserRole.WRITER, UserRole.REVIEWER, UserRole.SCHOLAR])
        ).all()

        return [Contributor.from_orm(user) for user in users]
    except Exception as e:
        print(str(e))