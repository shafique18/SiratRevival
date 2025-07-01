from pydantic import BaseModel, EmailStr
from typing import Optional
import enum

class AgeGroup(str, enum.Enum):
    GROUP_0_5 = "GROUP_0_5"
    GROUP_6_15 = "GROUP_6_15"
    GROUP_16_25 = "GROUP_16_25"
    GROUP_26_PLUS = "GROUP_26_PLUS"
    ADMIN = "ADMIN"

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str]

class UserCreate(UserBase):
    password: str
    age_group: AgeGroup

class User(UserBase):
    id: int
    is_active: bool
    is_verified: bool

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str
