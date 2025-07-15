from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from backend.db.session import Base

class QuranVerse(Base):
    __tablename__ = "quran_verses"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)
    arabic = Column(String, nullable=False)
    translation = Column(String, nullable=False)
    surah = Column(String, nullable=False)
    ayah = Column(Integer, nullable=False)
    is_today = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Hadith(Base):
    __tablename__ = "hadiths"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    source = Column(String, nullable=False)
    is_today = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class NewsArticle(Base):
    __tablename__ = "news_articles"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    link = Column(String, nullable=False)
    source = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
