from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session, joinedload
from app.core.config import settings

from app.db.session import get_db
from app.models.user_db import UserDB as User  # Adjust if your model file name is different

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
    print(f"Token received: {token}")
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        print(f"Token payload sub: {email}")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except JWTError as e:
        print(f"JWT error: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.email == email).options(joinedload(User.roles)).first()
    if not user:
        print(f"User not found: {email}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    print(f"Authenticated user: {user.email}, roles: {[r.name for r in user.roles]}")
    return user

# Role-based access control
def role_required(required_roles: List[str]):
    def dependency(user: User = Depends(get_current_user)):
        user_roles = [r.name.lower() for r in user.roles]
        if not any(role.lower() in user_roles for role in required_roles):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
        return user
    return dependency
