from app.db.session import SessionLocal, Base, engine
from app.models.sqlalchemy.user_db import UserDB, UserRole
from app.core.security import hash_password

def seed_admin():
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
            is_active=True
        )
        db.add(admin)
        db.commit()
        print("✅ Admin user seeded.")
    else:
        print("ℹ️ Admin user already exists.")

    db.close()
