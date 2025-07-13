from pydantic import BaseModel
from typing import Optional, List
from pydantic import validator

class Content(BaseModel):
    id: int
    type: str
    content_url: Optional[str]
    html_content: Optional[str]

    class Config:
        orm_mode = True


class Module(BaseModel):
    id: int
    title: str
    order: int
    contents: List[Content]

    class Config:
        orm_mode = True


class LearningPath(BaseModel):
    id: int
    title: str
    description: str
    modules: List[Module]

    class Config:
        orm_mode = True


class SubMenu(BaseModel):
    id: int
    title: str
    path: str
    type: str
    learning_path: Optional[LearningPath]

    class Config:
        orm_mode = True


class Menu(BaseModel):
    id: int
    title: str
    icon: Optional[str]
    submenus: List[SubMenu]

    class Config:
        orm_mode = True
