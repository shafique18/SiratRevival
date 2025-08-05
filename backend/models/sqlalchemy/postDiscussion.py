from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from backend.db.session import Base

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    comments = relationship("PostComment", back_populates="post")
    likes = relationship("PostLike", back_populates="post")

class PostComment(Base):
    __tablename__ = "post_comments"
    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    post = relationship("Post", back_populates="comments")

class PostLike(Base):
    __tablename__ = "post_likes"
    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

class Discussion(Base):
    __tablename__ = "discussions"
    id = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String)
    content = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    comments = relationship("DiscussionComment", back_populates="discussion")
    likes = relationship("DiscussionLike", back_populates="discussion")

class DiscussionComment(Base):
    __tablename__ = "discussion_comments"
    id = Column(Integer, primary_key=True)
    discussion_id = Column(Integer, ForeignKey("discussions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    discussion = relationship("Discussion", back_populates="comments")

class DiscussionLike(Base):
    __tablename__ = "discussion_likes"
    id = Column(Integer, primary_key=True)
    discussion_id = Column(Integer, ForeignKey("discussions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
