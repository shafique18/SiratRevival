from pydantic import BaseModel, EmailStr, constr, conint
from typing import Optional, List, Annotated
from datetime import date
import enum

# --- Enums ---

class AgeGroup(str, enum.Enum):
    GROUP_0_5 = "GROUP_0_5"
    GROUP_6_15 = "GROUP_6_15"
    GROUP_16_25 = "GROUP_16_25"
    GROUP_26_PLUS = "GROUP_26_PLUS"
    ADMIN = "ADMIN"

class Gender(str, enum.Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"
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

class AccountType(str, enum.Enum):
    PERSONAL = "Personal"
    ORGANIZATION = "Organization"

# --- Role model (from old code) ---

class Role(BaseModel):
    name: str
    description: Optional[str]

    class Config:
        orm_mode = True

# --- User models ---

class UserBase(BaseModel):
    email: EmailStr
    username: Annotated[str, constr(min_length=3)]
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    date_of_birth: Optional[date]
    gender: Optional[Gender]
    preferred_pronouns: Optional[str]
    nationality: Optional[str]
    place_of_birth: Optional[str]
    profile_picture: Optional[str]
    preferred_language: Optional[str]
    time_zone: Optional[str]
    ethnicity: Optional[str]
    marital_status: Optional[MaritalStatus]
    religion: Optional[str]
    hobbies: Optional[str]
    language_proficiency: Optional[str]

    # Contact Info
    primary_email: Optional[EmailStr]
    secondary_email: Optional[EmailStr]
    mobile_phone: Optional[str]
    landline_number: Optional[str]
    street_address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    country: Optional[str]
    postal_code: Optional[str]
    alternate_contact_info: Optional[str]

    # Security & Auth
    pin: Optional[str]
    two_factor_enabled: Optional[bool] = False
    two_factor_method: Optional[str]
    security_question_1: Optional[str]
    security_answer_1: Optional[str]
    security_question_2: Optional[str]
    security_answer_2: Optional[str]

    # Identity Verification
    national_id_number: Optional[str]
    social_security_number: Optional[str]
    passport_number: Optional[str]
    drivers_license_number: Optional[str]
    id_document_path: Optional[str]
    selfie_with_id_path: Optional[str]
    video_verification_path: Optional[str]
    face_recognition_passed: Optional[bool] = False

    # Professional
    occupation: Optional[str]
    industry: Optional[str]
    job_title: Optional[str]
    employer_name: Optional[str]
    work_email: Optional[EmailStr]
    work_phone_number: Optional[str]
    years_experience: Optional[int]
    professional_certifications: Optional[str]
    linkedin_url: Optional[str]

    # Educational
    highest_qualification: Optional[str]
    school_university: Optional[str]
    graduation_year: Optional[int]
    major_field_of_study: Optional[str]

    # Digital & Social
    personal_website: Optional[str]
    social_links: Optional[str]

    # Preferences & Interests
    communication_preferences: Optional[str]
    content_preferences: Optional[str]
    subscription_type: Optional[str]
    dark_mode: Optional[bool] = False
    language_preference: Optional[str]

    # Legal & Compliance
    accepted_terms: Optional[bool] = False
    accepted_privacy_policy: Optional[bool] = False
    accepted_data_usage_consent: Optional[bool] = False
    marketing_opt_in: Optional[bool] = False
    third_party_data_sharing_consent: Optional[bool] = False

    # Application-Specific
    user_role: UserRole
    account_type: Optional[AccountType]
    skill_level: Optional[str]

    # Payment & Financial
    credit_card_info: Optional[str]
    paypal_handle: Optional[str]
    bank_account_details: Optional[str]
    billing_address: Optional[str]
    tax_id: Optional[str]
    preferred_payment_method: Optional[str]

    # User Journey & Behavioral
    registration_source: Optional[str]
    time_commitment: Optional[str]

class UserCreate(UserBase):
    password: Annotated[str, constr(min_length=8)]
    confirm_password: Annotated[str, constr(min_length=8)]

    class Config:
        orm_mode = True

    def validate_passwords(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")

class User(UserBase):
    id: int
    is_active: bool = True
    is_verified: bool = False
    age_group: AgeGroup
    roles: List[Role] = []

    class Config:
        orm_mode = True

# --- Authentication & token models from old code ---

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
