from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum
from enum import Enum as PyEnum 
from sqlalchemy.sql import func
from backend.db.session import Base
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.models.sqlalchemy.user_db import UserRole
from backend.models.sqlalchemy.navigation import ModuleDB

# Purpose: Islamic core texts.

class ContentDB(Base):
    __tablename__ = "contents"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    module_id = Column(Integer, ForeignKey("siratRevival.modules.id"), nullable=False)
    type = Column(Enum("video","audio", "text", "pdf", "link", name="content_type", schema="siratRevival"), nullable=False)
    content_url = Column(String, nullable=True)
    html_content = Column(Text, nullable=True)

    module = relationship("ModuleDB", back_populates="contents")
    translations = relationship("ContentTranslation", back_populates="content")
    topic_links = relationship("TopicContent", back_populates="content")
    figure_links = relationship("FigureContent", back_populates="content")
    versions = relationship("ContentVersion", back_populates="content")

class ContentTranslation(Base):

    # Purpose: Store multilingual content for all content types (text, audio, video, PDFs, etc.).
    # Multilingual support

    __tablename__ = 'content_translations'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    content_id = Column(Integer, ForeignKey('siratRevival.contents.id'))
    language = Column(String, nullable=False)
    translated_text = Column(Text)  # For text-based content
    translated_url = Column(String)  # If it's a translated file/audio/video
    translation_type = Column(Enum('machine', 'human', 'verified', name="translation_type", schema="siratRevival"), default='machine')
    created_at = Column(DateTime, default=datetime.utcnow)

    content = relationship("ContentDB", back_populates="translations")

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
    verse_id = Column(Integer, ForeignKey('siratRevival.quran_verses.id'),nullable=False)
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
    topic = Column(String, nullable=True)
    is_today = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    translations = relationship("HadithTranslation", back_populates="hadith")

class HadithTranslation(Base):
    # Hadith translation
    __tablename__ = 'hadith_translations'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    hadith_id = Column(Integer, ForeignKey('siratRevival.hadiths.id'),nullable=False)
    language = Column(String)
    translated_text = Column(Text)
    hadith = relationship("Hadith", back_populates="translations")

class NewsArticle(Base):
    __tablename__ = "news_articles"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    link = Column(String, nullable=False, unique=True)
    image_url = Column(String, nullable=True)
    source_id = Column(String, nullable=True)
    source_name = Column(String, nullable=False)
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
    age_group = Column(Enum(UserRole, name="age_group", schema="siratRevival"))  # target audience
    contents = relationship("TopicContent", back_populates="topic")


class TopicContent(Base):
    __tablename__ = 'topic_contents'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    topic_id = Column(Integer, ForeignKey('siratRevival.islamic_topics.id'), nullable=False)
    content_id = Column(Integer, ForeignKey('siratRevival.contents.id'), nullable=False)
    topic = relationship("IslamicTopic", back_populates="contents")
    content = relationship("ContentDB")

class IslamicFigure(Base):
    __tablename__ = 'islamic_figures'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(Enum('prophet', 'sahaba', 'scholar', 'woman', 'leader', name="islamic_figure_type", schema="siratRevival"))
    life_summary = Column(Text)
    birth_place = Column(String)
    era = Column(String)
    contents = relationship("FigureContent", back_populates="figure")


class FigureContent(Base):
    __tablename__ = 'figure_contents'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    figure_id = Column(Integer, ForeignKey('siratRevival.islamic_figures.id'), nullable=False)
    content_id = Column(Integer, ForeignKey('siratRevival.contents.id'), nullable=False)
    figure = relationship("IslamicFigure", back_populates="contents")
    content = relationship("ContentDB")


class ContentVersion(Base):
    __tablename__ = 'content_versions'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    content_id = Column(Integer, ForeignKey('siratRevival.contents.id'), nullable=False)
    version_number = Column(Integer)
    title = Column(String)
    content_snapshot = Column(Text)
    editor_id = Column(Integer, ForeignKey('siratRevival.users.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    content = relationship("ContentDB", back_populates="versions")

class AIInteraction(Base):
    __tablename__ = 'ai_interactions'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('siratRevival.users.id'), nullable=True)
    age_group = Column(Enum(UserRole, name="age_group", schema="siratRevival"))
    input_text = Column(Text)
    output_text = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    medium = Column(Enum('text', 'audio', 'video', name="medium", schema="siratRevival"))


class IslamicTopicCategory(str, PyEnum):
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