from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from backend.models.sqlalchemy.content import NewsArticle  # your SQLAlchemy model
import os, requests
from backend.core.config import settings
import requests
from newspaper import Article

def clean_newsapi_content(content: str) -> str:
    if content:
        # Remove the " [+123 chars]" part and replace with "..."
        return content.split(" [+")[0].rstrip() + "..."
    return content

# def extract_full_content(url: str) -> str:
#     try:
#         article = Article(url)
#         article.download()
#         article.parse()
#         return article.text.strip()
#     except Exception as e:
#         print(f"⚠️ Failed to extract full content from {url}: {e}")
#         return None

def daily_news_job(session: Session):
    print("📰 Daily news seeding started")
    api_key = settings.NEWSAPI
    url = f"https://newsapi.org/v2/everything?q=Islamic&quran&language=en&sortBy=publishedAt&pageSize=30&apiKey={api_key}"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            articles = response.json().get("articles", [])

            for a in articles:
                try:
                    date_published = datetime.strptime(a["publishedAt"], "%Y-%m-%dT%H:%M:%SZ")
                except Exception:
                    date_published = datetime.utcnow()

                existing = session.query(NewsArticle).filter_by(link=a["url"]).first()
                if existing:
                    continue

                # Attempt full content extraction
                # full_content = extract_full_content(a.get("url"))
                # if not full_content:
                full_content = clean_newsapi_content(a.get("content"))

                article = NewsArticle(
                    title=a.get("title"),
                    author=a.get("author"),
                    description=a.get("description"),
                    content=full_content,
                    link=a.get("url"),
                    image_url=a.get("urlToImage"),
                    source_id=a["source"].get("id"),
                    source_name=a["source"].get("name", "Unknown"),
                    date=date_published,
                )
                session.add(article)

            # Delete news older than 10 days
            cutoff = datetime.utcnow() - timedelta(days=10)
            session.query(NewsArticle).filter(NewsArticle.date < cutoff).delete()

            session.commit()
            print("✅ News updated and old news deleted.")
        else:
            print(f"❌ News API error: {response.status_code}")
    except Exception as e:
        print("❌ Error in daily_news_job:", e)
