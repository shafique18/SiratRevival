from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.db.session import get_db
from app.models.user import UserCreate, User, Token, PasswordResetRequest, PasswordResetConfirm
from app.models.user_db import UserDB
from app.utils import security, email_sender
from pydantic import BaseModel
from datetime import timedelta

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user or not security.verify_password(password, user.hashed_password):
        return None
    if not user.is_verified:
        return None  # Disallow login if not verified
    return user

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    existing_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = security.hash_password(user.password)
    db_user = UserDB(email=user.email, full_name=user.full_name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Send verification email async
    token = security.create_email_token({"sub": db_user.email}, expires_minutes=60*24)  # 24 hours
    verify_link = f"http://localhost:3000/verify-email?token={token}"

    body = f"""
    <h3>Welcome to SiratRevival!</h3>
    <p>Please verify your email by clicking the link below:</p>
    <a href="{verify_link}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
    """
    background_tasks.add_task(email_sender.send_email, db_user.email, "Verify your SiratRevival email", body)

    print(background_tasks)

    print(db_user)

    return db_user

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    payload = security.verify_email_token(token)
    if not payload:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    email = payload.get("sub")
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        return {"message": "Email already verified"}
    user.is_verified = True
    db.commit()
    return {"message": "Email verified successfully"}

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email, password, or email not verified",
                            headers={"WWW-Authenticate": "Bearer"})
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = security.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    email = payload.get("sub")
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    print(user)
    return user

@router.post("/password-reset/request")
def password_reset_request(data: PasswordResetRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == data.email).first()
    if not user:
        # To prevent enumeration, return same response even if user not found
        return {"message": "If the email exists, a password reset link has been sent."}

    token = security.create_email_token({"sub": user.email}, expires_minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)
    reset_link = f"http://localhost:3000/reset-password?token={token}"

    body = f"""
    <h3>SiratRevival Password Reset</h3>
    <p>Click the link below to reset your password:</p>
    <a href="{reset_link}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    """
    background_tasks.add_task(email_sender.send_email, user.email, "Password Reset for SiratRevival", body)

    return {"message": "If the email exists, a password reset link has been sent."}

@router.post("/password-reset/confirm")
def password_reset_confirm(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    payload = security.verify_email_token(data.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    email = payload.get("sub")
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = security.hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
