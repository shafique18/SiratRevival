from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, connect_args={"check_same_thread": False} if "sqlite" in settings.SQLALCHEMY_DATABASE_URI else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def create_schema_if_not_exists(schema_name: str):
    with engine.connect() as conn:
        conn.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{schema_name}"'))
        print(f"✅ Schema '{schema_name}' ensured.")

# Dependency for DB session in FastAPI
def get_db():
    create_schema_if_not_exists(settings.SCHEMA_NAME)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
