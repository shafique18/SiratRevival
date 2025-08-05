from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.core.security import get_current_user, get_db, get_language
from ..schemas import DiscussionCreate, DiscussionOut, CommentCreate
from .. import models

router = APIRouter(prefix="/discussions", tags=["discussions"])

@router.get("/", response_model=List[DiscussionOut])
def list_discussions(topic: str = None, db: Session = Depends(get_db), lang: str = Depends(get_language)):
    return models.Discussion.get_list(db, topic=topic, lang=lang)

@router.post("/", response_model=DiscussionOut, status_code=status.HTTP_201_CREATED)
def create_discussion(payload: DiscussionCreate, current_user=Depends(get_current_user), db: Session=Depends(get_db), lang: str = Depends(get_language)):
    disc = models.Discussion.create(db, author=current_user, data=payload, lang=lang)
    return disc

@router.post("/{disc_id}/comments", response_model=CommentCreate)
def comment_discussion(disc_id: int, payload: CommentCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db), lang: str = Depends(get_language)):
    comment = models.Comment.create_on_discussion(db, user=current_user, discussion_id=disc_id, text=payload.text, lang=lang)
    return comment

@router.post("/{disc_id}/like", status_code=status.HTTP_200_OK)
def like_discussion(disc_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    models.Discussion.toggle_like(db, disc_id, current_user)
    return {"liked": True}
