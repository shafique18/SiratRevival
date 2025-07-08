import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..')))
print(os.getcwd())

from app.db.session import engine, Base
from app.models.user_db import UserDB
from app.models.user_db import Subscriber
from app.models.content import QuranVerse, Hadith, NewsArticle

def create_tables():
    print(engine)
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")

if __name__ == "__main__":
    create_tables()
