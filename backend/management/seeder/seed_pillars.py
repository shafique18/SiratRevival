# Adjust import paths
import os, sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
from sqlalchemy.orm import Session
from datetime import datetime
from backend.models.sqlalchemy.navigation import LearningPathDB, ModuleDB
from backend.models.sqlalchemy.content import ContentDB, ContentTranslation  # Adjust import paths
from backend.db.session import SessionLocal  
import uuid

# Supported languages
LANGUAGES = [
    "en", "es", "fr", "de", "it", "pt", "ur", "zh", "ja", "ar", "hi", "tr", "id"
]

# Base English texts for the pillar sections
pillar_sections = {
    "Introduction": "The Five Pillars of Islam are the foundation of a Muslim's faith and practices.",
    "First Pillar": "Shahada: The declaration of faith – 'There is no god but Allah, and Muhammad is His messenger.'",
    "Second Pillar": "Salah: Performing the five daily prayers.",
    "Third Pillar": "Zakat: Giving to charity and supporting those in need.",
    "Fourth Pillar": "Sawm: Fasting during the month of Ramadan.",
    "Fifth Pillar": "Hajj: The pilgrimage to Mecca, which every Muslim should perform at least once if able."
}

def fake_translate(text, lang):
    """
    Simulate translation and audio URL generation.
    """
    translated_text = f"[{lang.upper()}] {text}"
    audio_url = f"https://example.com/audio/{lang}/{uuid.uuid4()}.mp3"
    return translated_text, audio_url

def seed_pillars(db: Session):

    try:
        # 1. Create or get LearningPath
        learning_path = db.query(LearningPathDB).filter_by(title="Islamic Foundations").first()
        if not learning_path:
            learning_path = LearningPathDB(
                title="Islamic Foundations",
                description="Learning path about fundamental Islamic topics."
            )
            db.add(learning_path)
            db.commit()
            db.refresh(learning_path)
            print("Created LearningPath:", learning_path.title)

        # 2. Create or get Module linked to LearningPath
        module = db.query(ModuleDB).filter_by(title="PILLARS").first()
        if not module:
            module = ModuleDB(
                title="PILLARS",
                learning_path_id=learning_path.id,
                order=1
            )
            db.add(module)
            db.commit()
            db.refresh(module)
            print("Created Module:", module.title)

        # 3. Create contents for each pillar section with translations
        for section_title, base_text in pillar_sections.items():
            content = ContentDB(
                module_id=module.id,
                type="text",
                html_content=base_text
            )
            db.add(content)
            db.commit()
            db.refresh(content)
            print(f"Created Content for section: {section_title}")

            # Add translations for all languages
            for lang in LANGUAGES:
                translated_text, audio_url = fake_translate(base_text, lang)
                translation = ContentTranslation(
                    content_id=content.id,
                    language=lang,
                    translated_text=translated_text,
                    translated_url=audio_url,
                    translation_type="machine",
                    created_at=datetime.utcnow()
                )
                db.add(translation)

            db.commit()
            print(f"Added translations for section: {section_title}")

        print("✅ Pillars content seeded successfully.")

    except Exception as e:
        db.rollback()
        print("❌ Error while seeding data:", e)

    finally:
        db.close()

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_pillars(db)
    finally:
        db.close()
