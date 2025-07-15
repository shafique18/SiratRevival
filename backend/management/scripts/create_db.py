import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.db.session import engine, Base
from seeder import run_all_seeders

# Optional: Automatically import all models
from backend.models import sqlalchemy  # assuming __init__.py loads all models in app.models.sqlalchemy

def create_tables():
    print(f"Using engine: {engine}")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created.")

def run_seeders():
    print("🌱 Seeding data...")
    run_all_seeders()
    print("✅ All seeders completed.")

if __name__ == "__main__":
    create_tables()
    run_seeders()
