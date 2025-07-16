import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from sqlalchemy.orm import Session
from backend.db.session import SessionLocal
from backend.models.sqlalchemy.team import TeamMember, SocialLink


def seed_data(db: Session):
    team_members = [
        {
            "name": "Amina Khalid",
            "role": "UI/UX Designer",
            "image": "/images/amina.jpg",
            "description": "Crafts delightful user experiences and sleek interfaces.",
            "social_links": [
                {"platform": "linkedin", "url": "https://linkedin.com/in/amina"},
                {"platform": "twitter", "url": "https://twitter.com/amina"},
            ],
        },
        {
            "name": "Bilal Khan",
            "role": "Backend Developer",
            "image": "/images/bilal.jpg",
            "description": "Ensures robust server-side logic and database integrity.",
            "social_links": [
                {"platform": "github", "url": "https://github.com/bilalkhan"},
            ],
        },
        {
            "name": "Fatima Noor",
            "role": "Frontend Developer",
            "image": "/images/fatima.jpg",
            "description": "Builds interactive and responsive frontend components.",
            "social_links": [
                {"platform": "linkedin", "url": "https://linkedin.com/in/fatima"},
                {"platform": "github", "url": "https://github.com/fatima"},
            ],
        },
        {
            "name": "Yusuf Rahman",
            "role": "Project Manager",
            "image": "/images/yusuf.jpg",
            "description": "Keeps everything running smoothly and on schedule.",
            "social_links": [
                {"platform": "linkedin", "url": "https://linkedin.com/in/yusuf"},
            ],
        },
        {
            "name": "Zainab Ali",
            "role": "Content Strategist",
            "image": "/images/zainab.jpg",
            "description": "Curates and crafts powerful Islamic content for all audiences.",
            "social_links": [
                {"platform": "twitter", "url": "https://twitter.com/zainab"},
                {"platform": "linkedin", "url": "https://linkedin.com/in/zainab"},
            ],
        },
    ]

    for member in team_members:
        tm = TeamMember(
            name=member["name"],
            role=member["role"],
            image=member["image"],
            description=member["description"],
        )
        db.add(tm)
        db.flush()  # get tm.id

        for link in member["social_links"]:
            db.add(SocialLink(
                platform=link["platform"],
                url=link["url"],
                member_id=tm.id
            ))
    db.commit()
    print("✅ Seeded team members!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
