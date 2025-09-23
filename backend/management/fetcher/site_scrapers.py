# backend/app/fetchers/site_scrapers_extended.py
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from slugify import slugify
from typing import Dict, List

HEADERS = {"User-Agent": "ScholarHubBot/1.0 (+https://example.org)"}

def safe_get(url, **kwargs):
    r = requests.get(url, headers=HEADERS, timeout=12, **kwargs)
    r.raise_for_status()
    return r.text

def parse_iso_date(s):
    # best-effort parse — fallback to None
    try:
        return datetime.fromisoformat(s)
    except Exception:
        from dateutil import parser
        try:
            return parser.parse(s)
        except Exception:
            return None

def scrape_alim_author(author_url: str) -> Dict:
    """
    Sample scraping for alim.org author pages.
    NOTE: tune selectors to actual page structure.
    """
    html = safe_get(author_url)
    soup = BeautifulSoup(html, "html.parser")
    # The following selectors are hypothetical and might need tuning.
    name = soup.select_one("h1.author-name") or soup.select_one("h1")
    name = name.get_text(strip=True) if name else author_url.split("/")[-1].replace("-", " ").title()

    bio_tag = soup.select_one(".author-bio") or soup.select_one(".bio")
    bio = bio_tag.get_text(strip=True) if bio_tag else None

    photo = None
    pimg = soup.select_one(".author-photo img")
    if pimg and pimg.get("src"):
        photo = pimg["src"]

    items = []
    # Try to find article list
    for el in soup.select(".author-articles li, .posts .post, .article-list .item"):
        title_el = el.select_one("a.title, h2 a, .post-title a")
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        url = title_el.get("href")
        if url and url.startswith("/"):
            # build absolute if site uses relative URLs
            from urllib.parse import urljoin
            url = urljoin(author_url, url)
        summary = (el.select_one(".excerpt") and el.select_one(".excerpt").get_text(strip=True)) or None
        thumb = None
        img = el.select_one("img")
        if img and img.get("src"):
            thumb = img["src"]

        pub = None
        date_el = el.select_one("time") or el.select_one(".meta .date")
        if date_el:
            pub = parse_iso_date(date_el.get("datetime") or date_el.get_text(strip=True))

        items.append({
            "title": title,
            "external_id": slugify(url or title),
            "url": url,
            "thumbnail": thumb,
            "summary": summary,
            "published_at": pub,
            "source": "alim",
            "medium": "article",
            "slug": slugify(title)[:250],
        })
    return {"name": name, "bio": bio, "photo": photo, "items": items}


def scrape_islamqa_search(keyword_or_author: str, max_results=20) -> Dict:
    """
    IslamQA has structured Q&A pages. Many pages are static and do not expose an easy author listing.
    This function performs a site search and returns matching articles.
    """
    q = keyword_or_author
    search_url = f"https://islamqa.info/en/search?query={requests.utils.quote(q)}"
    html = safe_get(search_url)
    soup = BeautifulSoup(html, "html.parser")
    items = []
    # site-specific selectors — tune as needed
    for el in soup.select(".search-result, .result-item")[:max_results]:
        title_tag = el.select_one(".result-title a, h3 a")
        if not title_tag:
            continue
        title = title_tag.get_text(strip=True)
        url = title_tag.get("href")
        if url and url.startswith("/"):
            from urllib.parse import urljoin
            url = urljoin(search_url, url)
        summary = (el.select_one(".result-snippet") and el.select_one(".result-snippet").get_text(strip=True)) or None
        pub = None
        items.append({
            "title": title,
            "external_id": slugify(url or title),
            "url": url,
            "thumbnail": None,
            "summary": summary,
            "published_at": pub,
            "source": "islamqa",
            "medium": "article",
            "slug": slugify(title)[:250],
        })
    # Return a synthetic "author" record where name=search term
    return {"name": keyword_or_author, "bio": None, "photo": None, "items": items}


def scrape_yaqeen_author(author_url: str) -> Dict:
    """
    Yaqeen Institute often has author pages and article lists.
    """
    html = safe_get(author_url)
    soup = BeautifulSoup(html, "html.parser")
    name = soup.select_one("h1.author-name") or soup.select_one("h1")
    name = name.get_text(strip=True) if name else author_url.split("/")[-1].replace("-", " ").title()
    bio = (soup.select_one(".author-bio") and soup.select_one(".author-bio").get_text(strip=True)) or None
    photo = None
    img = soup.select_one(".author-picture img")
    if img and img.get("src"):
        photo = img["src"]

    items = []
    for el in soup.select(".author-posts .card, .post-list .post, article")[:40]:
        title_el = el.select_one("h3 a, h2 a, .card-title a")
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        url = title_el.get("href")
        if url and url.startswith("/"):
            from urllib.parse import urljoin
            url = urljoin(author_url, url)
        summary = (el.select_one(".card-excerpt") and el.select_one(".card-excerpt").get_text(strip=True)) or None
        thumb = (el.select_one("img") and el.select_one("img").get("src")) or None
        items.append({
            "title": title,
            "external_id": slugify(url or title),
            "url": url,
            "thumbnail": thumb,
            "summary": summary,
            "published_at": None,
            "source": "yaqeen",
            "medium": "article",
            "slug": slugify(title)[:250],
        })
    return {"name": name, "bio": bio, "photo": photo, "items": items}


def scrape_bayyinah_author(author_url: str) -> Dict:
    """
    Bayyinah articles and blog. Bayyinah often uses modern markup — tune selectors.
    """
    html = safe_get(author_url)
    soup = BeautifulSoup(html, "html.parser")
    name = soup.select_one("h1") and soup.select_one("h1").get_text(strip=True) or author_url.split("/")[-1]
    bio = (soup.select_one(".author-bio") and soup.select_one(".author-bio").get_text(strip=True)) or None
    photo = (soup.select_one(".author-avatar img") and soup.select_one(".author-avatar img").get("src")) or None

    items = []
    for el in soup.select(".posts-list .post, .blog-card, .article-card")[:40]:
        title_el = el.select_one("h2 a, .title a")
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        url = title_el.get("href")
        if url and url.startswith("/"):
            from urllib.parse import urljoin
            url = urljoin(author_url, url)
        summary = (el.select_one(".excerpt") and el.select_one(".excerpt").get_text(strip=True)) or None
        thumb = (el.select_one("img") and el.select_one("img").get("src")) or None
        items.append({
            "title": title,
            "external_id": slugify(url or title),
            "url": url,
            "thumbnail": thumb,
            "summary": summary,
            "published_at": None,
            "source": "bayyinah",
            "medium": "article",
            "slug": slugify(title)[:250],
        })
    return {"name": name, "bio": bio, "photo": photo, "items": items}
