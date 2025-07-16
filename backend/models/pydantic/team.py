# team.py
from pydantic import BaseModel, HttpUrl
from typing import List, Optional

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
