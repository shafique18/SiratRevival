# models/sqlalchemy/navigation.py

from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Text, Float, DateTime, Boolean
from backend.db.session import Base
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.models.sqlalchemy.user_db import UserDB
import enum

class MenuDB(Base):
    __tablename__ = "menus"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    role = Column(String, nullable=False)  # user role like 'admin', 'adult', etc.

    submenus = relationship("SubMenuDB", back_populates="menu")


class SubMenuDB(Base):
    __tablename__ = "submenus"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    menu_id = Column(Integer, ForeignKey("siratRevival.menus.id"), nullable=False)
    path = Column(String, nullable=False)  # frontend route path
    type = Column(
        Enum("static", "learning", name="submenu_type", schema="siratRevival"),
        nullable=False
    )
    learning_path_id = Column(Integer, ForeignKey("siratRevival.learning_paths.id"), nullable=True)

    menu = relationship("MenuDB", back_populates="submenus")
    learning_path = relationship("LearningPathDB", back_populates="submenu", uselist=False)


class LearningPathDB(Base):
    __tablename__ = "learning_paths"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)

    modules = relationship("ModuleDB", back_populates="learning_path", order_by="ModuleDB.order")
    submenu = relationship("SubMenuDB", back_populates="learning_path", uselist=False)


class ModuleDB(Base):
    __tablename__ = "modules"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    learning_path_id = Column(Integer, ForeignKey("siratRevival.learning_paths.id"), nullable=False)
    order = Column(Integer, nullable=False)

    contents = relationship("ContentDB", back_populates="module")
    learning_path = relationship("LearningPathDB", back_populates="modules")


class ContentDB(Base):
    __tablename__ = "contents"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    module_id = Column(Integer, ForeignKey("siratRevival.modules.id"), nullable=False)
    type = Column(Enum("video", "text", "pdf", "link", name="content_type", schema="siratRevival"), nullable=False)
    content_url = Column(String, nullable=True)
    html_content = Column(Text, nullable=True)

    module = relationship("ModuleDB", back_populates="contents")


class UserProgressDB(Base):
    __tablename__ = "user_progress"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("siratRevival.users.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("siratRevival.modules.id"), nullable=False)
    progress_percent = Column(Float, default=0.0)
    completed = Column(Boolean, default=False)
    last_accessed = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserDB", backref="progress")
    module = relationship("ModuleDB")


class NavigationType(enum.Enum):
    MENU = "menu"
    SUBMENU = "submenu"
    LINK = "link"


class NavigationItem(Base):
    __tablename__ = 'navigation_items'
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, nullable=False, unique=True)
    type = Column(Enum(NavigationType, schema="siratRevival"), nullable=False)
    parent_id = Column(Integer, ForeignKey('siratRevival.navigation_items.id'), nullable=True)
    order = Column(Integer, nullable=False, default=0)

    parent = relationship('NavigationItem', remote_side=[id], backref='children')