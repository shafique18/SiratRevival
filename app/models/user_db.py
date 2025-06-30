from sqlalchemy import Column, Integer, String, Boolean
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
