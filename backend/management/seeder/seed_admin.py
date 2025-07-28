from datetime import datetime
from backend.db.session import SessionLocal
from backend.models.sqlalchemy.user_db import UserDB, UserRole
from backend.core.security import hash_password
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
        user3 = UserDB(
            email="kid@example.com",
            username='Kid',
            hashed_password=hash_password('Kid1234!'),
            first_name='Kid',
            last_name='khan',
            user_role=UserRole.GROUP_0_5,
            is_verified=True,
            is_active=True,
            date_of_birth=datetime(2021, 9, 20)  # Bob DOB
        )
        user4 = UserDB(
            email="teen@example.com",
            username='teen',
            hashed_password=hash_password('Teen1234!'),
            first_name='Teen',
            last_name='Khan',
            user_role=UserRole.GROUP_6_15,
            is_verified=True,
            is_active=True,
            date_of_birth=datetime(2015, 9, 20)  # Bob DOB
        )
        user5 = UserDB(
            email="young@example.com",
            username='young',
            hashed_password=hash_password('Young1234!'),
            first_name='Young',
            last_name='Khan',
            user_role=UserRole.GROUP_16_25,
            is_verified=True,
            is_active=True,
            date_of_birth=datetime(2011, 9, 20)  # Bob DOB
        )
        user6 = UserDB(
            email="writer@example.com",
            username='writer',
            hashed_password=hash_password('Writer1234!'),
            first_name='Writer',
            last_name='Khan',
            user_role=UserRole.WRITER,
            is_verified=True,
            is_active=True,
            date_of_birth=datetime(1995, 9, 20)  # Bob DOB
        )
        user7 = UserDB(
            email="scholor@example.com",
            username='scholor',
            hashed_password=hash_password('Scholor1234!'),
            first_name='Scholor',
            last_name='Khan',
            user_role=UserRole.SCHOLOR,
            is_verified=True,
            is_active=True,
            date_of_birth=datetime(1993, 9, 20)  # Bob DOB
        )
        user8 = UserDB(
            email="reviewer@example.com",
            username='reviewer',
            hashed_password=hash_password('Reviewer1234!'),
            first_name='Reviewer',
            last_name='Khan',
            user_role=UserRole.REVIEWER,
            is_verified=True,
            is_active=True,
            date_of_birth=datetime(1989, 9, 20)  # Bob DOB
        )

        db.add_all([admin, user1, user2, user3, user4, user5, user6, user7, user8])
        db.commit()
        print("✅ Admin user and other 2 users seeded.")
    else:
        print("ℹ️ Admin user already exists.")

    db.close()