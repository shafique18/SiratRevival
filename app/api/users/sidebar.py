from . import router
from fastapi import Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.sqlalchemy.user_db import UserDB
from app.models.sqlalchemy.navigation import MenuDB, UserProgressDB, ModuleDB
from app.models.pydantic.navigation import Menu, Module, ProgressUpdate
from datetime import datetime
from app.core.security import get_current_user


@router.get("/menu", response_model=List[Menu])
def get_sidebar_menu(
    current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)
    ):
    try:
        menus = db.query(MenuDB).filter(MenuDB.role == current_user.user_role).all()
        return menus
    except Exception as e:
        print(e)


@router.get("/module/{module_id}", response_model=Module)
def get_module(
    module_id: int,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
    ):
    module = db.query(ModuleDB).filter(ModuleDB.id == module_id).first()

    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    progress = (
        db.query(UserProgressDB)
        .filter_by(user_id=current_user.id, module_id=module_id)
        .first()
    )
    if not progress:
        progress = UserProgressDB(user_id=current_user.id, module_id=module_id)
        db.add(progress)
        db.commit()
        db.refresh(progress)

    module.progress_percent = progress.progress_percent
    module.completed = progress.completed

    return module


@router.post("/progress/{module_id}")
def update_progress(
        module_id: int,
        data: ProgressUpdate,
        db: Session = Depends(get_db),
        current_user: UserDB = Depends(get_current_user),
    ):
    prog = (
        db.query(UserProgressDB)
        .filter_by(user_id=current_user.id, module_id=module_id)
        .first()
    )
    if not prog:
        prog = UserProgressDB(
            user_id=current_user.id, module_id=module_id, progress_percent=data.progress
        )
        db.add(prog)
    else:
        prog.progress_percent = data.progress
        prog.last_accessed = datetime.utcnow()
    db.commit()
    return {"status": "ok"}
