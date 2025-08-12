import os
import sys
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
import json

# Adjust import paths
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from backend.models.sqlalchemy.navigation import LearningPathDB, ModuleDB
from backend.models.sqlalchemy.content import ContentDB, ContentTranslation
from backend.db.session import SessionLocal

# Supported languages
LANGUAGES = [
    "en", "es", "fr", "de", "it", "pt", "ur", "zh", "ja", "ar", "hi", "tr", "id"
]

# Detailed content for each pillar with numbered points + references
with open("frontend/src/static/data/pillar_seeding_data.json", "r", encoding="utf-8") as f:
    pillar_contents = json.load(f)

# Translate + dummy audio URL for translation
def fake_translate(text, lang):
    translated_text = f"[{lang.upper()}] {text}"
    audio_url = f"https://example.com/audio/{lang}/{uuid.uuid4()}.mp3"
    return translated_text, audio_url


def seed_pillars(db: Session):
    try:
        # 1. Learning Path
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

        # 2. Module
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

        # 3. Seed Pillars content with translations, audio, and video
        for index, (pillar_title, pillar_data) in enumerate(pillar_contents.items()):
            base_html = pillar_data["content"]

            # TEXT Content
            text_content = ContentDB(
                module_id=module.id,
                type="text",
                html_content=base_html
            )
            db.add(text_content)
            db.commit()
            db.refresh(text_content)
            print(f"Created Text Content for pillar: {pillar_title}")

            # Translations
            for lang in LANGUAGES:
                translated_text, audio_url = fake_translate(base_html, lang)
                translation = ContentTranslation(
                    content_id=text_content.id,
                    language=lang,
                    translated_text=translated_text,
                    translated_url=audio_url,
                    translation_type="machine",
                    created_at=datetime.utcnow()
                )
                db.add(translation)
            db.commit()
            print(f"Added translations for pillar: {pillar_title}")

            # AUDIO Content (from frontend/src/static/audio)
            audio_filename = f"pillar_{index + 1}.mp3"
            audio_path =  audio_filename

            audio_content = ContentDB(
                module_id=module.id,
                type="audio",
                content_url=audio_path
            )
            db.add(audio_content)
            db.commit()
            print(f"Added audio content: {audio_path}")

            # VIDEO Content (from frontend/src/static/video)
            video_filename = f"pillar_{index + 1}.mp4"
            video_path = video_filename

            video_content = ContentDB(
                module_id=module.id,
                type="video",
                content_url=video_path
            )
            db.add(video_content)
            db.commit()
            print(f"Added video content: {video_path}")

        print("✅ Pillars content seeded successfully with detailed pointers, references, audio, and video content URLs.")

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
