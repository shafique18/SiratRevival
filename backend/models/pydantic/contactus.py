from pydantic import BaseModel, EmailStr

class FeedbackCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class SuggestionCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class ReportCreate(BaseModel):
    name: str
    email: EmailStr
    message: str