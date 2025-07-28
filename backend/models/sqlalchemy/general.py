from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Text, Float, DateTime, Boolean
from backend.db.session import Base
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.models.sqlalchemy.user_db import UserDB
import enum


class ForumQuestion(Base):
    __tablename__ = 'forum_questions'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('siratRevival.users.id'), nullable=True)
    anonymous = Column(Boolean, default=False)
    question_text = Column(Text)
    category = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    answers = relationship("ForumAnswer", back_populates="question")

class ForumAnswer(Base):
    __tablename__ = 'forum_answers'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey('siratRevival.forum_questions.id'))
    responder_id = Column(Integer, ForeignKey('siratRevival.users.id'))
    answer_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("ForumQuestion", back_populates="answers")

class Donation(Base):
    __tablename__ = 'donations'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('siratRevival.users.id'), nullable=True)
    amount = Column(Float)
    message = Column(String)
    anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)