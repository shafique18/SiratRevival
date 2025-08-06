# scripts/seed_navigation.py
import os
import sys
import random
from datetime import datetime
from sqlalchemy.orm import Session
from backend.db.session import engine
from backend.models.sqlalchemy.navigation import (
    MenuDB, SubMenuDB, LearningPathDB,
    ModuleDB, UserProgressDB,
    NavigationItem, NavigationType
)
from backend.models.sqlalchemy.user_db import UserRole
from backend.models.sqlalchemy.content import ContentDB

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def seed_all(session: Session):
    # Clear tables
    session.query(UserProgressDB).delete()
    session.query(ModuleDB).delete()
    session.query(LearningPathDB).delete()
    session.query(SubMenuDB).delete()
    session.query(MenuDB).delete()
    session.query(NavigationItem).delete()
    session.commit()

    # 1. Create Menus
    menu_titles = [
        "Beliefs (Aqeedah)", "The Qur'an", "Seerah",
        "Islamic Manners & Akhlaaq", "Duas & Adhkar", "Worship (Ibaadah)",
        "Pillars of Islam & Iman", "Islamic History", "Fiqh for Kids", "Islamic Calendar & Events"
    ]
    roles = [
        UserRole.GROUP_0_5, UserRole.GROUP_6_15, UserRole.GROUP_16_25,
        UserRole.GROUP_26_PLUS, UserRole.ADMIN
    ]
    menus = {}
    for idx, title in enumerate(menu_titles):
        role = roles[idx % len(roles)]
        menu = MenuDB(
            title=title,
            icon=f"{title.lower().replace(' ', '_').replace('(', '').replace(')', '')}.svg",
            role=role
        )
        menus[title] = menu
    session.add_all(menus.values())
    session.commit()

    # 2. Create Learning Paths
    lp_data = [
        ("Tawheed Basics", "Understanding Allah's Oneness"),
        ("Asma-ul-Husna", "Beautiful Names of Allah"),
        ("Angels & Their Roles", "Islamic view on Angels"),
        ("Stories from the Qur’an", "Tales of wisdom and faith"),
        ("Seerah Highlights", "Journey of the Prophet ﷺ"),
        ("Islamic Manners", "Building character through Islam"),
        ("Duas for Every Day", "Daily supplications for kids"),
        ("How to Pray", "Step-by-step guide to Salah"),
        ("Pillars Explained", "The 5 Pillars of Islam"),
        ("Islamic Calendar", "Events & milestones of the Hijri year")
    ]
    learning_paths = [LearningPathDB(title=title, description=desc) for title, desc in lp_data]
    session.add_all(learning_paths)
    session.commit()

    # 3. Create Modules (at least 10)
    module_data = [
        ("Understanding Tawheed", "Core belief in Islam"),
        ("99 Names of Allah", "Learn and reflect on His names"),
        ("Who are the Angels?", "Their purpose in Islam"),
        ("Qur'an Stories", "Wisdom-filled tales"),
        ("Life of the Prophet ﷺ", "Seerah lessons"),
        ("Akhlaaq of a Muslim", "Good manners in Islam"),
        ("Everyday Duas", "Easy Duas for kids"),
        ("Perfecting Salah", "Essentials of prayer"),
        ("Islamic Beliefs", "Explaining the 5 pillars"),
        ("Hijri Months", "Learning about the Islamic calendar")
    ]
    modules = []
    for i, (title, description) in enumerate(module_data):
        mod = ModuleDB(
            title=title,
            learning_path_id=learning_paths[i].id,
            order=i + 1
        )
        modules.append(mod)
    session.add_all(modules)
    session.commit()

    # 4. Create Contents (min 10, per module)
    contents = []
    for mod in modules:
        for i in range(1, 3):
            contents.append(ContentDB(
                module_id=mod.id,
                type="video",
                content_url=f"https://www.youtube.com/watch?v=dQw4w9WgXcQ&mod={mod.id}&v={i}"
            ))
            contents.append(ContentDB(
                module_id=mod.id,
                type="text",
                html_content=f"<h3>{mod.title}</h3><p>{mod.title} - {mod.order}: {mod.title} description and engaging lesson content here.</p>"
            ))
    session.add_all(contents)
    session.commit()

    # 5. Submenus (3 per menu)
    submenus = []
    for menu_title, menu in menus.items():
        linked_lps = random.sample(learning_paths, 3)
        for lp in linked_lps:
            submenus.append(SubMenuDB(
                title=lp.title,
                menu_id=menu.id,
                path=f"/{menu_title.lower().replace(' ', '-').replace('&', '')}/{lp.title.lower().replace(' ', '-')}",
                type="learning",
                learning_path_id=lp.id
            ))
    session.add_all(submenus)
    session.commit()

    # 6. Dummy progress for 3 users
    progress = []
    for uid in range(1, 4):
        mod = random.choice(modules)
        progress.append(UserProgressDB(
            user_id=uid,
            module_id=mod.id,
            progress_percent=random.choice([25, 50, 75, 100]),
            completed=random.choice([True, False]),
            last_accessed=datetime.utcnow()
        ))
    session.add_all(progress)
    session.commit()

    # 7. Navigation Items
    nav_items = [
        NavigationItem(title="Home", slug="home", type=NavigationType.LINK, order=1),
        NavigationItem(title="Learn", slug="learn", type=NavigationType.MENU, order=2),
        NavigationItem(title="Profile", slug="profile", type=NavigationType.LINK, order=3)
    ]
    session.add_all(nav_items)
    session.commit()

    print("✅ Professional Islamic LMS seed completed.")

if __name__ == "__main__":
    from backend.db.session import Session
    with Session(engine) as session:
        seed_all(session)
