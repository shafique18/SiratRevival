from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum, UniqueConstraint, Index, JSON
from enum import Enum as PyEnum 
from sqlalchemy.sql import func
from backend.db.session import Base
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.models.sqlalchemy.user_db import UserRole
from backend.models.sqlalchemy.navigation import ModuleDB

# Purpose: Islamic core texts.
class ContentMedium(PyEnum):
    ARTICLE = "article"
    VIDEO = "video"
    AUDIO = "audio"
    BOOK = "book"
    LINK = "link"
    PDF = "pdf"
    OTHER = "other"

class Scholar(Base):
    __tablename__ = "scholars"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True)  # e.g. url-safe name
    bio = Column(Text)
    website = Column(String(1024))
    photo_url = Column(String(1024))
    country = Column(String(128))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    contents = relationship("Content", back_populates="scholar", cascade="all, delete-orphan")

    __table_args__ = (UniqueConstraint('name', 'website', name='uq_scholar_name_website'),)

class ContentDB(Base):
    __tablename__ = "contents"
    __table_args__ = (
        {"schema": "siratRevival"},
        UniqueConstraint("external_id", "source", name="uq_contents_external_source"),
        Index("idx_contents_published_at", "published_at"),
        Index("idx_contents_slug", "slug")
    )

    id = Column(Integer, primary_key=True)
    module_id = Column(Integer, ForeignKey("siratRevival.modules.id"), nullable=False)

    # Type of content
    type = Column(Enum(ContentMedium, name="content_type", schema="siratRevival"), nullable=False)

    title = Column(String(500), nullable=True)
    slug = Column(String(250), nullable=True, index=True)  # SEO friendly
    content_url = Column(String, nullable=True)
    thumbnail = Column(String, nullable=True)
    html_content = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)

    # External metadata for ingestion
    external_id = Column(String(255), nullable=True)  # YouTube ID, Alim slug, etc.
    source = Column(String(100), nullable=True)  # e.g., 'alim', 'islamqa', 'yaqeen'
    metadata = Column(JSON, default={})  # Store extra scraped metadata

    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    is_active = Column(Boolean, default=True)

    # Relationships
    module = relationship("ModuleDB", back_populates="contents")
    translations = relationship("ContentTranslation", back_populates="content", cascade="all, delete-orphan")
    topic_links = relationship("TopicContent", back_populates="content", cascade="all, delete-orphan")
    figure_links = relationship("FigureContent", back_populates="content", cascade="all, delete-orphan")
    versions = relationship("ContentVersion", back_populates="content", cascade="all, delete-orphan")


# --- Content Translation Table ---
class ContentTranslation(Base):
    """
    Stores multilingual content for all content types.
    Supports both text translations and alternative URLs (audio/video/PDF versions).
    """
    __tablename__ = 'content_translations'
    __table_args__ = (
        {"schema": "siratRevival"},
        UniqueConstraint("content_id", "language", name="uq_content_translation_lang")
    )

    id = Column(Integer, primary_key=True)
    content_id = Column(Integer, ForeignKey('siratRevival.contents.id', ondelete="CASCADE"))

    language = Column(String(10), nullable=False)  # e.g., 'en', 'ar', 'ur'
    translated_text = Column(Text, nullable=True)
    translated_url = Column(String, nullable=True)

    translation_type = Column(
        Enum('machine', 'human', 'verified', name="translation_type", schema="siratRevival"),
        default='machine'
    )

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

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