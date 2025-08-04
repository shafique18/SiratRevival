from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text,ForeignKey
from sqlalchemy.orm import relationship
from backend.db.session import Base
import enum
from datetime import datetime

class Gender(str, enum.Enum):
    MALE = "Male"
    FEMALE = "Female"
    PREFER_NOT_TO_SAY = "Prefer not to say"

class MaritalStatus(str, enum.Enum):
    SINGLE = "Single"
    MARRIED = "Married"
    DIVORCED = "Divorced"
    WIDOWED = "Widowed"

class UserRole(str, enum.Enum):
    GROUP_0_5 = "GROUP_0_5"
    GROUP_6_15 = "GROUP_6_15"
    GROUP_16_25 = "GROUP_16_25"
    GROUP_26_PLUS = "GROUP_26_PLUS"
    ADMIN = "ADMIN"
    WRITER = "WRITER"
    REVIEWER = "REVIEWER"
    SCHOLAR = "SCHOLAR"

class AccountType(str, enum.Enum):
    PERSONAL = "Personal"
    ORGANIZATION = "Organization"

class RoleEnum(enum.Enum):
    WRITER = "WRITER"
    REVIEWER = "REVIEWER"
    SCHOLAR = "SCHOLAR"
    PARTNER = "PARTNER"
    TECH = "TECH"



class UserDB(Base):

    # Purpose: Main user profile, extended to include professional, social, and preference data
    __tablename__ = "users"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)

    # Account Credentials
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    pin = Column(String, nullable=True)  # hashed
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    # Personal Information
    first_name = Column(String(50), nullable=False)
    middle_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=False)
    date_of_birth = Column(DateTime, nullable=True)
    gender = Column(Enum(Gender, name="gender", schema="siratRevival"), nullable=True)
    nationality = Column(String(50), nullable=True)
    place_of_birth = Column(String(100), nullable=True)
    profile_picture = Column(String, nullable=True)  # URL or path
    preferred_language = Column(String(50), nullable=True)
    time_zone = Column(String(50), nullable=True)
    ethnicity = Column(String(50), nullable=True)
    marital_status = Column(Enum(MaritalStatus, name="marital_status", schema="siratRevival"), nullable=True)
    religion = Column(String(50), nullable=True)
    hobbies = Column(Text, nullable=True)
    language_proficiency = Column(Text, nullable=True)  # JSON string

    # Contact Information
    primary_email = Column(String, nullable=True)
    secondary_email = Column(String, nullable=True)
    mobile_phone = Column(String, nullable=True)
    landline_number = Column(String, nullable=True)
    street_address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    alternate_contact_info = Column(String, nullable=True)

    # Security & Authentication
    two_factor_enabled = Column(Boolean, default=False) # Not required 
    two_factor_method = Column(String(10), nullable=True)  # sms, email, etc
    security_question_1 = Column(String, nullable=True)
    security_answer_1 = Column(String, nullable=True)  # hashed
    security_question_2 = Column(String, nullable=True)
    security_answer_2 = Column(String, nullable=True)

    # Identity Verification
    national_id_number = Column(String, nullable=True)
    social_security_number = Column(String, nullable=True)
    passport_number = Column(String, nullable=True)
    drivers_license_number = Column(String, nullable=True)
    id_document_path = Column(String, nullable=True)
    selfie_with_id_path = Column(String, nullable=True)
    video_verification_path = Column(String, nullable=True)
    face_recognition_passed = Column(Boolean, default=False) #Not Required

    # Professional Information
    occupation = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    employer_name = Column(String, nullable=True)
    work_email = Column(String, nullable=True)
    work_phone_number = Column(String, nullable=True)
    years_experience = Column(Integer, nullable=True)
    professional_certifications = Column(Text, nullable=True)
    linkedin_url = Column(String, nullable=True)

    # Educational Information
    highest_qualification = Column(String, nullable=True)
    school_university = Column(String, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    major_field_of_study = Column(String, nullable=True)

    # Digital & Social Identity
    personal_website = Column(String, nullable=True)
    social_links = Column(Text, nullable=True)  # JSON string

    # Preferences & Interests
    communication_preferences = Column(Text, nullable=True)  # JSON string, NOt required
    content_preferences = Column(Text, nullable=True)  # JSON string, Not Required
    subscription_type = Column(String, nullable=True) # Not required
    dark_mode = Column(Boolean, default=False)
    language_preference = Column(String, nullable=True)

    # Legal & Compliance
    accepted_terms = Column(Boolean, default=False)
    accepted_privacy_policy = Column(Boolean, default=False)
    accepted_data_usage_consent = Column(Boolean, default=False)
    marketing_opt_in = Column(Boolean, default=False)
    third_party_data_sharing_consent = Column(Boolean, default=False)

    # Application-Specific
    user_role = Column(Enum(UserRole, name="user_role", schema="siratRevival"), nullable=False)
    account_type = Column(Enum(AccountType, name="account_type", schema="siratRevival"), nullable=True)
    involvement_requests = relationship("InvolvementRequest", back_populates="users")
    skill_level = Column(String, nullable=True) # Not required

    # Payment & Financial Info
    credit_card_info = Column(String, nullable=True) # Not required
    paypal_handle = Column(String, nullable=True) # Not required
    bank_account_details = Column(String, nullable=True) # Not required
    billing_address = Column(String, nullable=True) # Not required
    tax_id = Column(String, nullable=True) # Not required
    preferred_payment_method = Column(String, nullable=True) # Not required

    # User Journey & Behavioral
    registration_source = Column(String, nullable=True)
    time_commitment = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Subscriber(Base):
    __tablename__ = "subscribers"
    __table_args__ = {"schema": "siratRevival"}
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    subscribed_at = Column(DateTime, nullable=False)


class InvolvementRequest(Base):
    __tablename__ = "involvement_requests"
    __table_args__ = {"schema": "siratRevival"}
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, ForeignKey("siratRevival.users.email"), nullable=False)
    role = Column(Enum(RoleEnum, name="request_role_enum", schema="siratRevival"), nullable=False)
    message = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=False)

    users = relationship("UserDB", back_populates="involvement_requests")