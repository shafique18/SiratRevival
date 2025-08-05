from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status, Header
from typing import List
from sqlalchemy.orm import Session, joinedload
from backend.core.config import settings

from backend.db.session import get_db
from backend.models.sqlalchemy.user_db import UserDB as User  # Adjust if your model file name is different

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(pw: str):
    return pwd_context.hash(pw)

def verify_password(pw: str, hashed: str):
    return pwd_context.verify(pw, hashed)

# Token creation
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

# OAuth2 token retrieval
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# Get current user from token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

# Role-based access control
def role_required(required_roles: List[str]):
    def dependency(user: User = Depends(get_current_user)):
        if not user or not user.user_role:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

        user_role = user.user_role.lower()
        if not any(role.lower() == user_role for role in required_roles):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

        return user
    return dependency


def get_language(lang: str = None, accept_language: str = Header(None), settings = settings):
    if lang in settings.SUPPORTED_LANGS:
        return lang
    # parse accept_language header fallback
    return settings.DEFAULT_LANGS