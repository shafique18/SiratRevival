from fastapi import APIRouter, HTTPException
from app.models.sqlalchemy.navigation import ModuleDB, UserProgressDB
from app.models.pydantic.navigation import Module
from app.models.sqlalchemy.user_db import UserDB
from app.db.session import get_db
from fastapi import Depends
from app.core.security import get_current_user
from sqlalchemy.orm import Session
from typing import List

router = APIRouter()

@router.get("/paths")
def get_learning_paths():
    # This is a placeholder - consider fetching actual paths from DB
    return ["Beginner Path", "Scholar Path"]

@router.get("/learning_paths/{learning_path_id}/modules", response_model=List[Module])
def get_modules_for_learning_path(
        learning_path_id: int,
        current_user: UserDB = Depends(get_current_user),
        db: Session = Depends(get_db),
    ):
    print("Inside")
    print(learning_path_id)
    modules = (
        db.query(ModuleDB)
        .filter(ModuleDB.learning_path_id == learning_path_id)
        .order_by(ModuleDB.order)
        .all()
    )

    if not modules:
        raise HTTPException(status_code=404, detail="No modules found for this learning path")

    # Add progress info dynamically for each module
    for module in modules:
        progress = (
            db.query(UserProgressDB)
            .filter_by(user_id=current_user.id, module_id=module.id)
            .first()
        )
        module.progress_percent = progress.progress_percent if progress else 0.0
        module.completed = progress.completed if progress else False

    return modules