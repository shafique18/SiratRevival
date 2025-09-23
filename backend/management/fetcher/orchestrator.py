# backend/app/scraper.py
from .db import SessionLocal
from .crud import get_or_create_scholar, upsert_content
from .fetchers.rss_fetcher import parse_rss_feed
from .fetchers.youtube_fetcher import get_channel_videos
from .fetchers.books_fetcher import search_books_by_author, openlibrary_search
from .fetchers.site_scrapers import scrape_muslimcentral_author_page
from sqlalchemy.exc import IntegrityError
import traceback

def ingest_muslimcentral(author_url):
    session = SessionLocal()
    try:
        p = scrape_muslimcentral_author_page(author_url)
        scholar = get_or_create_scholar(session, name=p['name'], website=author_url, bio=p.get('bio'), photo_url=p.get('photo'))
        for it in p['items']:
            it['medium'] = it.get('medium') or 'audio'
            it['source'] = it.get('source') or 'muslimcentral'
            upsert_content(session, scholar.id, it)
    except Exception as e:
        print("Error:", e)
        traceback.print_exc()
    finally:
        session.close()

def ingest_youtube_channel(channel_id, scholar_name=None, scholar_website=None):
    session = SessionLocal()
    try:
        items = get_channel_videos(channel_id, max_results=50)
        scholar = get_or_create_scholar(session, name=scholar_name or channel_id, website=scholar_website)
        for it in items:
            it['medium'] = 'video'
            upsert_content(session, scholar.id, it)
    finally:
        session.close()

def ingest_books_for_author(name):
    session = SessionLocal()
    try:
        scholar = get_or_create_scholar(session, name=name)
        books = search_books_by_author(name, max_results=10)
        if not books:
            books = openlibrary_search(name, max_results=10)
        for b in books:
            upsert_content(session, scholar.id, b)
    finally:
        session.close()
