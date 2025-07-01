from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from typing import List

from app.db.session import get_db
from app.models.user import User as User  # Adjust if your model file name is different

# Constants
SECRET_KEY = 'm8YyOaQPlt7U2J4vLNqXG0B7JeVk4CrKHNVt6zF0tFc'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(pw: str):
    return pwd_context.hash(pw)

def verify_password(pw: str, hashed: str):
    return pwd_context.verify(pw, hashed)

# Token creation
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# OAuth2 token retrieval
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Get current user from token
def get_current_user(token: str = Depends(oauth2_scheme)):
    db = next(get_db())
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

# Role-based access control
def role_required(required_roles: List[str]):
    def dependency(user: User = Depends(get_current_user)):
        if not any(role.name in required_roles for role in user.roles):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
        return user
    return dependency
