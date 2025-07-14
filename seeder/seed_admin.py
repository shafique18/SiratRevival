from datetime import datetime
from app.db.session import SessionLocal
from app.models.sqlalchemy.user_db import UserDB, UserRole
from app.core.security import hash_password
from sqlalchemy.orm import Session

def seed_admin_and_user(session: Session):
    db = SessionLocal()

    admin_email = 'admin@sirat.com'
    if not db.query(UserDB).filter(UserDB.email == admin_email).first():
        admin = UserDB(
            email=admin_email,
            username='admin',
            hashed_password=hash_password('Admin123!'),
            first_name='Admin',
            last_name='User',
            user_role=UserRole.ADMIN,
            is_verified=True,
            is_active=True,
            date_of_birth=datetime(1980, 1, 1)  # Admin DOB
        )
        user1 = UserDB(
            email="alice@example.com",
            username='Alice',
            hashed_password=hash_password('User1234!'),
            first_name='Alice',
            last_name='User',
            user_role=UserRole.GROUP_26_PLUS,
            is_verified=True,
            is_active=True,
            date_of_birth=datetime(1995, 5, 15)  # Alice DOB
        )
        user2 = UserDB(
            email="bob@example.com",
            username='Bob',
            hashed_password=hash_password('User2234!'),
            first_name='Bob',
            last_name='User',
            user_role=UserRole.GROUP_16_25,
            is_verified=True,
            is_active=True,
            date_of_birth=datetime(2008, 9, 20)  # Bob DOB
        )

        db.add(admin)
        db.add(user1)
        db.add(user2)
        db.commit()
        print("✅ Admin user and other 2 users seeded.")
    else:
        print("ℹ️ Admin user already exists.")

    db.close()
