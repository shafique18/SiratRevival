from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, UploadFile, File, Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.db.session import get_db
from app.models.pydantic.user import UserCreate, User, Token, PasswordResetRequest, PasswordResetConfirm
from app.models.sqlalchemy.user_db import UserDB
from app.core.security import oauth2_scheme
from app.utils import security, email_sender, util
from pydantic import BaseModel, ValidationError
from datetime import timedelta
from sqlalchemy.orm import joinedload
from app.core.config import settings
import shutil
import os
from uuid import uuid4


router = APIRouter()

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user or not security.verify_password(password, user.hashed_password):
        return None
    if not user.is_verified:
        return None  # Disallow login if not verified
    return user

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Create a unique filename
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid4().hex}{file_ext}"
        file_location = os.path.join(util.UPLOAD_DIR, unique_filename)

        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Return the relative file path or a URL if you serve static files
        return {"filePath": file_location}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(request: Request, db: Session = Depends(get_db)):
    raw_data = await request.json()
    try:
        user_create = UserCreate(**raw_data)
        user_create.validate_passwords()
    except ValidationError as e:
        # Here you can parse the errors, and set invalid fields to None or defaults
        data = raw_data.copy()
        for err in e.errors():
            loc = err['loc']  # field path
            if len(loc) == 1:
                field = loc[0]
                # Set invalid field to None (or some default)
                data[field] = None
        
        # Try creating model again with fixed data
        user_create = UserCreate(**data)
        user_create.validate_passwords()

    user = db.query(UserDB).filter(
        (UserDB.email == user_create.email) | 
        (UserDB.username == user_create.username)
    ).first()
    if user:
        raise HTTPException(status_code=400, detail="Email or username already exists.")

    hashed_password = security.hash_password(user_create.password)
    new_user = UserDB(
        email=user_create.email,
        username=user_create.username,
        hashed_password=hashed_password,
        first_name=user_create.first_name,
        middle_name=user_create.middle_name,
        last_name=user_create.last_name,
        date_of_birth=user_create.date_of_birth,
        gender=user_create.gender,
        preferred_pronouns=user_create.preferred_pronouns,
        nationality=user_create.nationality,
        place_of_birth=user_create.place_of_birth,
        profile_picture=user_create.profile_picture,
        preferred_language=user_create.preferred_language,
        time_zone=user_create.time_zone,
        ethnicity=user_create.ethnicity,
        marital_status=user_create.marital_status,
        religion=user_create.religion,
        hobbies=user_create.hobbies,
        language_proficiency=user_create.language_proficiency,
        primary_email=user_create.primary_email,
        secondary_email=user_create.secondary_email,
        mobile_phone=user_create.mobile_phone,
        landline_number=user_create.landline_number,
        street_address=user_create.street_address,
        city=user_create.city,
        state=user_create.state,
        country=user_create.country,
        postal_code=user_create.postal_code,
        alternate_contact_info=user_create.alternate_contact_info,
        pin=user_create.pin,
        two_factor_enabled=user_create.two_factor_enabled,
        two_factor_method=user_create.two_factor_method,
        security_question_1=user_create.security_question_1,
        security_answer_1=user_create.security_answer_1,
        security_question_2=user_create.security_question_2,
        security_answer_2=user_create.security_answer_2,
        national_id_number=user_create.national_id_number,
        social_security_number=user_create.social_security_number,
        passport_number=user_create.passport_number,
        drivers_license_number=user_create.drivers_license_number,
        id_document_path=user_create.id_document_path,
        selfie_with_id_path=user_create.selfie_with_id_path,
        video_verification_path=user_create.video_verification_path,
        face_recognition_passed=user_create.face_recognition_passed,
        occupation=user_create.occupation,
        industry=user_create.industry,
        job_title=user_create.job_title,
        employer_name=user_create.employer_name,
        work_email=user_create.work_email,
        work_phone_number=user_create.work_phone_number,
        years_experience=user_create.years_experience,
        professional_certifications=user_create.professional_certifications,
        linkedin_url=user_create.linkedin_url,
        highest_qualification=user_create.highest_qualification,
        school_university=user_create.school_university,
        graduation_year=user_create.graduation_year,
        major_field_of_study=user_create.major_field_of_study,
        personal_website=user_create.personal_website,
        social_links=user_create.social_links,
        communication_preferences=user_create.communication_preferences,
        content_preferences=user_create.content_preferences,
        subscription_type=user_create.subscription_type,
        dark_mode=user_create.dark_mode,
        language_preference=user_create.language_preference,
        accepted_terms=user_create.accepted_terms,
        accepted_privacy_policy=user_create.accepted_privacy_policy,
        accepted_data_usage_consent=user_create.accepted_data_usage_consent,
        marketing_opt_in=user_create.marketing_opt_in,
        third_party_data_sharing_consent=user_create.third_party_data_sharing_consent,
        user_role=user_create.user_role,
        account_type=user_create.account_type,
        skill_level=user_create.skill_level,
        credit_card_info=user_create.credit_card_info,
        paypal_handle=user_create.paypal_handle,
        bank_account_details=user_create.bank_account_details,
        billing_address=user_create.billing_address,
        tax_id=user_create.tax_id,
        preferred_payment_method=user_create.preferred_payment_method,
        registration_source=user_create.registration_source,
        time_commitment=user_create.time_commitment
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

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
    user = (
        db.query(UserDB)
        # .options(joinedload(UserDB.roles))  # eagerly load roles
        .filter(UserDB.email == email)
        .first()
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
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
