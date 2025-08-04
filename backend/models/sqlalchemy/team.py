from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from backend.db.session import Base
import enum

# Purpose: Staff/team-related public info.


class TeamMember(Base):
    __tablename__ = "team_members"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    image = Column(String, nullable=False)
    description = Column(String)

    social_links = relationship("SocialLink", back_populates="member")

class SocialLink(Base):
    __tablename__ = "social_links"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, nullable=False)
    url = Column(String, nullable=False)

    # 👇 FIXED: Referencing fully qualified table
    member_id = Column(Integer, ForeignKey("siratRevival.team_members.id"))

    member = relationship("TeamMember", back_populates="social_links")


class Partner(Base):
    __tablename__ = "partners"
    __table_args__ = {"schema": "siratRevival"}
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("siratRevival.users.id"))
    message = Column(Text)