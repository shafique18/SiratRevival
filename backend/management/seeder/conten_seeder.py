import json
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))


from datetime import datetime
import requests
from backend.db.session import SessionLocal
from backend.models.sqlalchemy import QuranVerse, Hadith, NewsArticle, ContentDB, HadithTranslation, ContentTranslation, ContentVersion, Language, QuranTranslation, IslamicFigure, IslamicTopic, IslamicTopicCategory, TopicContent, FigureContent, AIInteraction

def seed_quran(session):
    # Load Quran JSON with your provided structure
    with open(r"C:\Users\shafi\Documents\Shafique\Education\Revival\SiratRevival\backend\management\scripts\quran_en.json", "r", encoding="utf-8") as f:
        quran_data = json.load(f)

    for surah in quran_data:
        surah_name = surah["name"]
        verses = surah.get("verses", [])
        for verse in verses:
            qv = QuranVerse(
                arabic=verse["text"],
                translation=verse.get("translation", "No translation"),
                surah=surah_name,
                ayah=verse["id"],
                is_today=False
            )
            session.add(qv)
    session.commit()
    print("Quran data seeded.")

def seed_hadith(session):
    # Example: Fetch Hadith from a public API (Sunnah.com unofficial API or similar)
    # This is a placeholder URL, replace with a real API if available
    try:
        response = requests.get("https://api.sunnah.com/v1/hadiths", headers={"X-API-Key": "YOUR_API_KEY"})
        if response.status_code == 200:
            hadiths = response.json().get("data", [])
            for h in hadiths:
                hadith = Hadith(
                    text=h.get("hadith_text", "") or h.get("text", ""),
                    source=h.get("collection", "Unknown"),
                    is_today=False
                )
                session.add(hadith)
            session.commit()
            print("Hadith data seeded from API.")
        else:
            print(f"Hadith API error: {response.status_code}. Using fallback data.")
            fallback_hadiths = [
                {"text": "Actions are judged by intentions.", "source": "Bukhari", "is_today": False},
                {"text": "The best among you are those who have the best manners.", "source": "Tirmidhi", "is_today": False},
                {"text": "And the Statement of Allah جَلَّ ذِكْرُهُ: 'Verily, We have sent the revelation to you (O Muhammad ﷺ) as We sent the revelation to Noah and the Prophets after him.'.", "source": "Bukhari", "is_today": False},
                {"text": "Your invocation means your faith. And Allah تعالى said: 'Say (O Muhammad ﷺ to the disbelievers): My Lord pays attention to you only because of your invocation to Him.'", "source": "Bukhari", "is_today": False},
                {"text": "And the Statement of Allah جل جلاله: '… Allah will exalt in degree those of you who believe, and those who have been granted knowledge. And Allah is Well-Acquainted with what you do.' (V.58:11) And the Statement of Allah تعالى: '... My Lord, increase me in knowledge.'", "source": "Bukhari", "is_today": False},
                {"text": "Ibn ‘Abbas said: Abu Sufyan, when telling the narration of Heraclius, mentioned: “The Prophet ﷺ ordered us to offer our Salat (prayers) regularly and to be true and chaste.”", "source": "Bukhari", "is_today": False},
                {"text": "The Prophet (ﷺ) said 'Both legal and illegal things are obvious, and in between them are (suspicious) doubtful matters. So whoever forsakes those doubtful things lest he may commit a sin, will definitely avoid what is clearly illegal; and whoever indulges in these (suspicious) doubtful things bravely, is likely to commit what is clearly illegal. Sins are Allah's Hima (i.e. private pasture) and whoever pastures (his sheep) near it, is likely to get in it at any moment.'", "source": "Bukhari", "is_today": False},
                {"text": "Allah's Messenger (ﷺ) said, 'There is none amongst the Muslims who plants a tree or sows seeds, and then a bird, or a person or an animal eats from it, but is regarded as a charitable gift for him.'", "source": "Bukhari", "is_today": False},
                {"text": "Allah's Messenger (ﷺ) said, 'A Muslim is a brother of another Muslim, so he should not oppress him, nor should he hand him over to an oppressor. Whoever fulfilled the needs of his brother, Allah will fulfill his needs; whoever brought his (Muslim) brother out of a discomfort, Allah will bring him out of the discomforts of the Day of Resurrection, and whoever screened a Muslim, Allah will screen him on the Day of Resurrection.'", "source": "Bukhari", "is_today": False},
                {"text": "Allah's Messenger (ﷺ) said, 'The first group of people who will enter Paradise, will be glittering like the full moon and those who will follow them, will glitter like the most brilliant star in the sky. They will not urinate, relieve nature, spit, or have any nasal secretions. Their combs will be of gold, and their sweat will smell like musk. The aloes-wood will be used in their centers. Their wives will be houris. All of them will look alike and will resemble their father Adam (in stature), sixty cubits tall.'", "source": "Bukhari", "is_today": False},

            ]
            for h in fallback_hadiths:
                session.add(Hadith(**h))
            session.commit()
    except Exception as e:
        print("Hadith seeding error:", e)

def seed_news(session):
    # Example: Fetch news from a public API like NewsAPI.org with Islamic keyword
    # You need to get your own API key from newsapi.org
    api_key = "e1c9d2d5b2034d05a55085ce9eb829d"
    url = f"https://newsapi.org/v2/everything?q=Islamic&quran&language=en&sortBy=publishedAt&apiKey={api_key}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            articles = response.json().get("articles", [])
            for a in articles:
                try:
                    date_published = datetime.strptime(a["publishedAt"], "%Y-%m-%dT%H:%M:%SZ")
                except Exception:
                    date_published = datetime.utcnow()

                news_article = NewsArticle(
                    title=a["title"],
                    link=a["url"],
                    source=a["source"]["name"],
                    date=date_published,
                )
                session.add(news_article)
            session.commit()
            print("News articles seeded from API.")
        else:
            print(f"News API error: {response.status_code}. Using fallback data.")
            fallback_news = [
                {
                    "title": "Latest Quran research highlights",
                    "link": "https://news.example.com/quran-research",
                    "source": "Islamic News Network",
                    "date": datetime(2025, 7, 10),
                },
                {
                    "title": "Hadith studies conference 2025",
                    "link": "https://news.example.com/hadith-conference",
                    "source": "Muslim World Today",
                    "date": datetime(2025, 6, 25),
                },
            ]
            for n in fallback_news:
                session.add(NewsArticle(**n))
            session.commit()
    except Exception as e:
        print("News seeding error:", e)

def run_seeder():
    session = SessionLocal()
    try:
        seed_quran(session)
        seed_hadith(session)
        seed_news(session)
        print("Seeding complete!")
    except Exception as e:
        session.rollback()
        print("Error during seeding:", e)
    finally:
        session.close()

if __name__ == "__main__":
    run_seeder()
