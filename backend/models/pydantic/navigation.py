from pydantic import BaseModel
from typing import Optional, List

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

    # Adding user progress info for frontend display
    progress_percent: Optional[float] = 0.0
    completed: Optional[bool] = False

    class Config:
        orm_mode = True


class LearningPath(BaseModel):
    id: int
    title: str
    description: Optional[str]
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


class ProgressUpdate(BaseModel):
    progress: float
