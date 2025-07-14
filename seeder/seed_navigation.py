# scripts/seed_navigation.py
import os
import sys
import random
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.session import engine
from app.models.sqlalchemy.navigation import (
    MenuDB, SubMenuDB, LearningPathDB,
    ModuleDB, ContentDB, UserProgressDB,
    NavigationItem, NavigationType
)
from app.models.sqlalchemy.user_db import UserRole

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def seed_all(session: Session):
    # Clear tables in correct order
    session.query(UserProgressDB).delete()
    session.query(ContentDB).delete()
    session.query(ModuleDB).delete()
    session.query(LearningPathDB).delete()
    session.query(SubMenuDB).delete()
    session.query(MenuDB).delete()
    session.query(NavigationItem).delete()
    session.commit()

    # 1. Create 10 menus, rotating roles
    categories = [
        "Aqeedah", "Qur'an Studies", "Seerah",
        "Salah & Ibadah", "Islamic Manners",
        "Duas & Adhkar", "Islamic History",
        "Fiqh", "Modern Challenges", "Admin Panel"
    ]
    roles_list = [UserRole.GROUP_0_5, UserRole.GROUP_6_15,
                  UserRole.GROUP_16_25, UserRole.GROUP_26_PLUS,
                  UserRole.ADMIN]
    menus = {}
    for idx, cat in enumerate(categories):
        role = roles_list[idx % len(roles_list)]
        menus[cat] = MenuDB(
            title=cat,
            icon=f"{cat.lower().replace(' ', '_')}.svg",
            role=role
        )
    session.add_all(menus.values())
    session.commit()

    # 2. Create 10 learning paths with Islamic focus
    lp_data = [
        ("Foundations of Tawheed", "Understanding Oneness of Allah"),
        ("Asma-ul-Husna", "Learn the 99 Beautiful Names"),
        ("Angels in Islam", "Role of angels"),
        ("Stories of the Prophets", "Adam to Muhammad ﷺ"),
        ("Journey Through Qur'an", "Surahs & meanings"),
        ("Life of the Prophet ﷺ", "Seerah basics"),
        ("Mastering Salah", "Practical prayer steps"),
        ("Daily Sunnahs", "Sunnah habits daily"),
        ("Islamic Manners", "Adab & character"),
        ("Muslim World History", "Islamic civilization overview"),
    ]
    learning_paths = [LearningPathDB(title=title, description=desc) for title, desc in lp_data]
    session.add_all(learning_paths)
    session.commit()

    # 3. One module per learning path (2 contents each)
    modules = []
    for i, lp in enumerate(learning_paths, start=1):
        mod = ModuleDB(
            title=f"{lp.title} – Module {i}",
            learning_path_id=lp.id,
            order=i
        )
        modules.append(mod)
    session.add_all(modules)
    session.commit()

    # 4. Create content for each module
    contents = []
    for mod in modules:
        contents.append(ContentDB(
            module_id=mod.id,
            type="video",
            content_url=f"https://cdn.lms.org/videos/{mod.title.replace(' ', '_')}.mp4"
        ))
        contents.append(ContentDB(
            module_id=mod.id,
            type="text",
            html_content=f"<p>Detailed lesson content for {mod.title}</p>"
        ))
    session.add_all(contents)
    session.commit()

    # 5. Add Submenus: 3 submenus per menu pointing to learning paths
    submenus = []
    lp_cycle = learning_paths * 3
    for idx, (cat, menu_obj) in enumerate(menus.items()):
        for j in range(3):
            lp = random.choice(learning_paths)
            submenus.append(SubMenuDB(
                title=lp.title,
                menu_id=menu_obj.id,
                path=f"/{cat.lower().replace('& ', '').replace(' ', '-')}/{lp.title.lower().replace(' ', '-')}",
                type="learning",
                learning_path_id=lp.id
            ))
    session.add_all(submenus)
    session.commit()

    # 6. Dummy progress entries for user IDs 1,2,3
    progress_samples = [
        UserProgressDB(user_id=1, module_id=modules[0].id, progress_percent=10.0, completed=False, last_accessed=datetime.utcnow()),
        UserProgressDB(user_id=1, module_id=modules[1].id, progress_percent=100.0, completed=True, last_accessed=datetime.utcnow()),
        UserProgressDB(user_id=2, module_id=modules[2].id, progress_percent=50.0, completed=False, last_accessed=datetime.utcnow()),
        UserProgressDB(user_id=3, module_id=modules[3].id, progress_percent=75.0, completed=False, last_accessed=datetime.utcnow()),
    ]
    session.add_all(progress_samples)
    session.commit()

    # 7. Navigation items (for top nav)
    nav_items = [
        NavigationItem(title="Home", slug="home", type=NavigationType.LINK, order=1),
        NavigationItem(title="Learning", slug="learning", type=NavigationType.MENU, order=2),
        NavigationItem(title="Profile", slug="profile", type=NavigationType.LINK, order=3),
    ]
    session.add_all(nav_items)
    session.commit()

    print("✅ Islamic LMS seed completed.")

if __name__ == "__main__":
    from app.db.session import Session
    with Session(engine) as session:
        seed_all(session)
