# backend/management/seeder/hadith_seeder.py
import os
import sys
import time
import json
import math
from typing import Dict, Any, List, Optional
import requests
from sqlalchemy.orm import Session
from sqlalchemy import and_
from dotenv import load_dotenv

# Ensure project root is on sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from backend.db.session import SessionLocal
from backend.models.sqlalchemy import Hadith, HadithTranslation

# ---- Config ----
load_dotenv(dotenv_path=r"C:\Users\shafi\Documents\Shafique\Education\Revival\SiratRevival\.env")
API_KEY = os.getenv("HadithAPI")
BASE_URL = "https://hadithapi.com/api/hadiths"
CHECKPOINT_PATH = os.path.join(os.path.dirname(__file__), "hadith_checkpoint.json")
REQUESTS_PER_MINUTE = 25  # stay polite; adjust if you know the API limit
SLEEP_BETWEEN_CALLS = 60.0 / max(1, REQUESTS_PER_MINUTE)

def load_checkpoint() -> Dict[str, Any]:
    if os.path.exists(CHECKPOINT_PATH):
        with open(CHECKPOINT_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"next_page_url": None, "pages_done": 0, "total_saved": 0}

def save_checkpoint(state: Dict[str, Any]) -> None:
    with open(CHECKPOINT_PATH, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)

def fetch_page(url: Optional[str] = None, page: Optional[int] = None, limit: int = 25) -> Dict[str, Any]:
    """
    Returns parsed JSON with keys: status, hadiths{ data, next_page_url, ... }
    You can pass either a direct `url` (from next_page_url) or `page`.
    """
    params = {"apiKey": API_KEY}
    if page is not None:
        params["page"] = page
    if url:
        # If next_page_url already includes /public/api/..., just pass apiKey again
        resp = requests.get(url, params={"apiKey": API_KEY}, timeout=30)
    else:
        resp = requests.get(BASE_URL, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()

def upsert_hadith_batch(db: Session, items: List[Dict[str, Any]]) -> int:
    """
    Insert hadiths + translations if not already present.
    De-dup key = (source=bookSlug, number=hadithNumber).
    Returns number of newly saved hadith rows.
    """
    inserted = 0
    for h in items:
        source = h.get("bookSlug")  # e.g., "sahih-bukhari"
        number = h.get("hadithNumber")
        # Try to map book + chapter safely:
        book_name = (h.get("book") or {}).get("bookName")
        chapter_en = (h.get("chapter") or {}).get("chapterEnglish")

        # Check if already exists:
        existing = db.query(Hadith).filter(
            and_(Hadith.source == source, Hadith.number == str(number))
        ).first()

        if existing:
            continue  # skip duplicates

        new_row = Hadith(
            reference=str(number) if number is not None else None,
            text=h.get("hadithArabic") or "",   # original text stored in Arabic field
            book=book_name,
            chapter=chapter_en,
            number=str(number) if number is not None else None,
            source=source
        )
        db.add(new_row)
        db.commit()
        db.refresh(new_row)
        inserted += 1

        # Save translations (English, Urdu) if present
        translations = []
        if h.get("hadithEnglish"):
            translations.append(("en", h["hadithEnglish"]))
        if h.get("hadithUrdu"):
            translations.append(("ur", h["hadithUrdu"]))

        for lang, txt in translations:
            db.add(HadithTranslation(
                hadith_id=new_row.id,
                language=lang,
                translated_text=txt
            ))
        db.commit()

    return inserted

def run_full_import(max_pages: Optional[int] = None, resume: bool = True):
    """
    Pulls all hadiths using pagination until next_page_url is None.
    Set max_pages for a smaller initial run (e.g., max_pages=5).
    """
    state = load_checkpoint() if resume else {"next_page_url": None, "pages_done": 0, "total_saved": 0}
    next_url = state.get("next_page_url")
    pages_done = state.get("pages_done", 0)
    total_saved = state.get("total_saved", 0)

    db: Session = SessionLocal()
    try:
        page = None
        if not next_url:
            page = 1  # first page when starting fresh

        while True:
            # Optional limit on pages for testing
            if max_pages is not None and pages_done >= max_pages:
                print(f"Reached max_pages={max_pages}; stopping.")
                break

            # Fetch with retry/backoff
            attempts = 0
            while True:
                try:
                    if next_url:
                        data = fetch_page(url=next_url)
                    else:
                        data = fetch_page(page=page)
                    break
                except requests.HTTPError as e:
                    attempts += 1
                    wait = min(60, 2 ** attempts)
                    print(f"HTTPError {e}; retrying in {wait}s (attempt {attempts})...")
                    time.sleep(wait)
                except requests.RequestException as e:
                    attempts += 1
                    wait = min(60, 2 ** attempts)
                    print(f"Network error {e}; retrying in {wait}s (attempt {attempts})...")
                    time.sleep(wait)

            hadiths = ((data or {}).get("hadiths") or {}).get("data") or []
            next_page_url = ((data or {}).get("hadiths") or {}).get("next_page_url")

            # Upsert batch
            newly = upsert_hadith_batch(db, hadiths)
            total_saved += newly
            pages_done += 1

            # Progress log
            current_page = ((data or {}).get("hadiths") or {}).get("current_page")
            last_page = ((data or {}).get("hadiths") or {}).get("last_page")
            print(f"Page {current_page}/{last_page} -> inserted {newly}, total_saved={total_saved}")

            # Save checkpoint
            state = {"next_page_url": next_page_url, "pages_done": pages_done, "total_saved": total_saved}
            save_checkpoint(state)

            # Pagination end?
            if not next_page_url:
                print("No more pages. Import complete.")
                break

            # Be polite with the API
            time.sleep(SLEEP_BETWEEN_CALLS)

    finally:
        db.close()

if __name__ == "__main__":
    # Tip: set max_pages=5 to test first, then None for full 40k+ import.
    print("start")
    try:
        run_full_import(max_pages=None, resume=True)
    except Exception as e:
        print(e)
