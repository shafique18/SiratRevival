# backend/app/fetchers/books_fetcher.py
import os
import requests
from slugify import slugify
from datetime import datetime

GOOGLE_BOOKS_API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")

def search_books_by_author(author_name, max_results=10):
    """
    Search Google Books for books by author.
    """
    q = f'inauthor:"{author_name}"'
    params = {"q": q, "maxResults": min(40, max_results)}
    if GOOGLE_BOOKS_API_KEY:
        params['key'] = GOOGLE_BOOKS_API_KEY
    resp = requests.get("https://www.googleapis.com/books/v1/volumes", params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    items = []
    for v in data.get('items', [])[:max_results]:
        info = v.get('volumeInfo', {})
        external_id = v.get('id')
        items.append({
            "title": info.get('title'),
            "external_id": external_id,
            "url": info.get('infoLink'),
            "thumbnail": (info.get('imageLinks') or {}).get('thumbnail'),
            "summary": info.get('description'),
            "published_at": None,
            "medium": "book",
            "source": "google_books",
            "slug": slugify(info.get('title',''))[:250]
        })
    return items

def openlibrary_search(author_name, max_results=10):
    params = {"q": author_name, "mode": "everything", "limit": max_results}
    r = requests.get("https://openlibrary.org/search.json", params=params, timeout=10)
    r.raise_for_status()
    j = r.json()
    items = []
    for doc in j.get('docs', [])[:max_results]:
        title = doc.get('title')
        olid = doc.get('key')  # like "/works/OLxxxxxW"
        items.append({
            "title": title,
            "external_id": olid,
            "url": f"https://openlibrary.org{olid}",
            "thumbnail": None,
            "summary": None,
            "published_at": None,
            "medium": "book",
            "source": "openlibrary",
            "slug": slugify(title or "")[:250]
        })
    return items
