import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..')))

from app.db.session import engine, Base
from app.models.user_db import UserDB

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")

if __name__ == "__main__":
    create_tables()
