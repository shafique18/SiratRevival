from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.db.session import Base

class UserDB(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)  # Email confirmed or not


class Subscriber(Base):
    __tablename__ = "subscribers"
    __table_args__ = {"schema": "siratRevival"}
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    subscribed_at = Column(DateTime, nullable=False)
