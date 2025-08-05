from pydantic import BaseModel
from typing import List

class CommentCreate(BaseModel):
    text: str

class CommentOut(CommentCreate):
    id: int
    user_id: int
    created_at: str

class PostCreate(BaseModel):
    title: str
    content: str

class PostOut(PostCreate):
    id: int
    author_id: int
    translated_content: str
    comments: List[CommentOut]
    likes_count: int

class PostList(BaseModel):
    posts: List[PostOut]
