from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from backend.db.session import Base
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum
from . import user_db

# Purpose: Islamic core texts.

class Language(Base):
    __tablename__ = "languages"
    __table_args__ = {"schema": "siratRevival"}
    id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, nullable=False)  # e.g., 'en', 'ur', 'ar'
    name = Column(String, nullable=False)

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
    translations = relationship("QuranTranslation", back_populates="quran_verse")


class QuranTranslation(Base):
    # Quran translation per verse
    __tablename__ = 'quran_translations'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    verse_id = Column(Integer, ForeignKey('quran_verses.id'))
    language = Column(String, nullable=False)
    translation = Column(Text, nullable=False)

    quran_verse = relationship("QuranVerse", back_populates="translations")

class Hadith(Base):
    __tablename__ = 'hadiths'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String)
    text = Column(Text)
    book = Column(String)
    chapter = Column(String)
    number = Column(String)
    source = Column(String)  # Bukhari, Muslim, etc.
    is_today = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    translations = relationship("HadithTranslation", back_populates="hadith")

class HadithTranslation(Base):
    # Hadith translation
    __tablename__ = 'hadith_translations'

    id = Column(Integer, primary_key=True)
    hadith_id = Column(Integer, ForeignKey('hadiths.id'))
    language = Column(String)
    translated_text = Column(Text)

    hadith = relationship("Hadith", back_populates="translations")

class NewsArticle(Base):
    __tablename__ = "news_articles"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    link = Column(String, nullable=False)
    source = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class IslamicTopic(Base):

    # Broad topics (social, political, family, fiqh, etc.)
    # Categorize content by theme

    __tablename__ = 'islamic_topics'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(Text)
    age_group = Column(Enum(user_db.UserRole))  # target audience


class TopicContent(Base):

    # Links content/modules to broader Islamic topics
    # M:N link of topics to content
    __tablename__ = 'topic_contents'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    topic_id = Column(Integer, ForeignKey('islamic_topics.id'))
    content_id = Column(Integer, ForeignKey('contents.id'))

    topic = relationship("IslamicTopic", back_populates="contents")
    content = relationship("Content", back_populates="topics")

class IslamicFigure(Base):
    __tablename__ = 'islamic_figures'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(Enum('prophet', 'sahaba', 'scholar', 'woman', 'leader'))
    life_summary = Column(Text)
    birth_place = Column(String)
    era = Column(String)

    contents = relationship("FigureContent", back_populates="figure")


class FigureContent(Base):
    __tablename__ = 'figure_contents'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    figure_id = Column(Integer, ForeignKey('islamic_figures.id'))
    content_id = Column(Integer, ForeignKey('contents.id'))

    figure = relationship("IslamicFigure", back_populates="contents")
    content = relationship("Content")


class ContentVersion(Base):
    __tablename__ = 'content_versions'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    content_id = Column(Integer, ForeignKey('contents.id'))
    version_number = Column(Integer)
    title = Column(String)
    content_snapshot = Column(Text)
    editor_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)

class AIInteraction(Base):
    __tablename__ = 'ai_interactions'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    age_group = Column(Enum(user_db.UserRole))
    input_text = Column(Text)
    output_text = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    medium = Column(Enum('text', 'audio', 'video'))


class IslamicTopicCategory(str, Enum):
    FIQH = "FIQH"
    QURAN = "QURAN"
    HADITH = "HADITH"
    HISTORY = "HISTORY"
    SOCIAL = "SOCIAL"
    ECONOMIC = "ECONOMIC"
    POLITICAL = "POLITICAL"
    FAMILY = "FAMILY"
    WOMEN = "WOMEN"
    SCHOLARS = "SCHOLARS"
    KHILAFAH = "KHILAFAH"
    PROPHETS = "PROPHETS"
    COMPANIONS = "COMPANIONS"
    LANGUAGE = "LANGUAGE"
    PILLARS = "PILLARS"
    BELIEFS = "BELIEFS"
    BIOGRAPHY = "BIOGRAPHY"