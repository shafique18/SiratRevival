# scripts/seed_roles_admin.py

import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.db.session import SessionLocal, Base, engine
from backend.models.sqlalchemy.user_db import UserDB, UserRole
from backend.core.security import hash_password

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Seed admin user
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
    db.close()
    print("Seeding done")

if __name__ == '__main__':
    seed()
