# team.py
from pydantic import BaseModel, HttpUrl, EmailStr
from typing import List, Optional
from enum import Enum

class RoleEnum(str, Enum):
    WRITER = "WRITER"
    REVIEWER = "REVIEWER"
    SCHOLAR = "SCHOLAR"
    PARTNER = "PARTNER"
    TECH = "TECH"

class SocialLink(BaseModel):
    platform: str
    url: HttpUrl

    class Config:
        orm_mode = True

class TeamMember(BaseModel):
    id: int
    name: str
    role: str
    image: str
    description: Optional[str]
    social_links: List[SocialLink]

    class Config:
        orm_mode = True

class InvolvementRequestCreate(BaseModel):
    email: EmailStr
    role: RoleEnum
    message: str