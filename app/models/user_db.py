from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
import enum

class AgeGroup(str, enum.Enum):
    GROUP_0_5 = "GROUP_0_5"
    GROUP_6_15 = "GROUP_6_15"
    GROUP_16_25 = "GROUP_16_25"
    GROUP_26_PLUS = "GROUP_26_PLUS"
    ADMIN = "ADMIN"

user_roles = Table(
    "user_roles", Base.metadata,
    Column("user_id", Integer, ForeignKey("siratRevival.users.id"), primary_key=True),
    Column("role_name", String, ForeignKey("siratRevival.roles.name"), primary_key=True),
    schema="siratRevival"  # Ensure this table also uses the same schema
)

class UserDB(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "siratRevival"}

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    age_group = Column(
        Enum(
            AgeGroup,
            name="agegroup",
            schema="siratRevival",
            create_type=True,
        ),
        nullable=False
    )
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)  # Email confirmed or not


class Subscriber(Base):
    __tablename__ = "subscribers"
    __table_args__ = {"schema": "siratRevival"}
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    subscribed_at = Column(DateTime, nullable=False)


class Role(Base):
    __tablename__ = "roles"
    __table_args__ = {"schema": "siratRevival"}

    name = Column(String, primary_key=True, index=True)
    description = Column(String)
    users = relationship("UserDB", secondary=user_roles, back_populates="roles")
