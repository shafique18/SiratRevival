# backend/app/fetchers/rss_fetcher.py
import feedparser
from datetime import datetime
from slugify import slugify

def parse_rss_feed(url):
    """
    Returns list of standardized items: {title, url, summary, published_at, external_id, thumbnail}
    """
    feed = feedparser.parse(url)
    items = []
    for e in feed.entries:
        item = {}
        item['title'] = e.get('title')
        item['url'] = e.get('link')
        item['summary'] = e.get('summary') or e.get('description')
        # published
        published = None
        if hasattr(e, 'published_parsed') and e.published_parsed:
            published = datetime(*e.published_parsed[:6])
        item['published_at'] = published
        # external id: use guid if present else slug of url
        external_id = getattr(e, 'id', None) or e.get('guid') or slugify(e.get('link') or e.get('title'))
        item['external_id'] = external_id
        # thumbnails
        thumb = None
        if 'media_thumbnail' in e:
            try:
                thumb = e.media_thumbnail[0]['url']
            except Exception:
                thumb = None
        item['thumbnail'] = thumb
        items.append(item)
    return items
