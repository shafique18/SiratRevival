# scripts/seed_roles_admin.py
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..')))
from app.db.session import SessionLocal, Base, engine
from app.models.user_db import Role, UserDB, AgeGroup
from app.core.security import hash_password

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Seed roles with enum exact values
    for name in ['GROUP_0_5', 'GROUP_6_15', 'GROUP_16_25', 'GROUP_26_PLUS', 'ADMIN']:
        if not db.query(Role).filter(Role.name == name).first():
            db.add(Role(name=name, description=f"Role {name}"))
    
    # Seed admin user
    admin_email = 'shafique18.18@gmail.com  '
    if not db.query(UserDB).filter(UserDB.email == admin_email).first():
        admin = UserDB(
            email=admin_email,
            hashed_password=hash_password('kuchNahi@1'),
            age_group=AgeGroup.ADMIN
        )
        admin.roles = db.query(Role).filter(Role.name == AgeGroup.ADMIN.value).all()
        db.add(admin)
    
    db.commit()
    db.close()
    print("Seeding done")


if __name__ == '__main__':
    seed()
