from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.core.security import get_current_user, get_db, get_language
from backend.models.pydantic.postDiscussion import PostCreate, PostOut, CommentCreate
from backend.models.sqlalchemy.postDiscussion import Post, PostComment, PostLike
from typing import List

router = APIRouter()

@router.get("/", response_model=List[PostOut])
def list_posts(db: Session = Depends(get_db)):
    return db.query(Post).order_by(Post.created_at.desc()).all()

@router.post("/", response_model=PostOut)
def create_post(payload: PostCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    p = Post(author_id=user.id, content=payload.content)
    db.add(p); db.commit(); db.refresh(p)
    return p

@router.post("/{post_id}/comment", response_model=PostOut)
def comment_post(post_id: int, payload: CommentCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    comment = PostComment(post_id=post_id, user_id=user.id, content=payload.content)
    db.add(comment); db.commit()
    return db.query(Post).filter(Post.id == post_id).first()

@router.post("/{post_id}/like", response_model=PostOut)
def like_post(post_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    like = PostLike(post_id=post_id, user_id=user.id)
    db.add(like); db.commit()
    return db.query(Post).filter(Post.id == post_id).first()
