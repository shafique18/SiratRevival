from app.db.session import SessionLocal, Base, engine
from app.models.sqlalchemy.navigation import NavigationItem, NavigationType

def seed_navigation():
    db = SessionLocal()

    menu_items = [
        {
            'title': 'Dashboard',
            'slug': 'dashboard',
            'type': NavigationType.MENU,
            'order': 1,
            'children': [
                {
                    'title': 'Analytics',
                    'slug': 'analytics',
                    'type': NavigationType.LINK,
                    'order': 1
                }
            ]
        },
        {
            'title': 'Settings',
            'slug': 'settings',
            'type': NavigationType.MENU,
            'order': 2,
            'children': [
                {
                    'title': 'Users',
                    'slug': 'users',
                    'type': NavigationType.LINK,
                    'order': 1
                },
                {
                    'title': 'Navigation',
                    'slug': 'navigation',
                    'type': NavigationType.LINK,
                    'order': 2
                }
            ]
        }
    ]

    for item in menu_items:
        existing = db.query(NavigationItem).filter_by(slug=item['slug']).first()
        if not existing:
            parent = NavigationItem(
                title=item['title'],
                slug=item['slug'],
                type=item['type'],
                order=item['order']
            )
            db.add(parent)
            db.flush()

            for child in item.get('children', []):
                db.add(NavigationItem(
                    title=child['title'],
                    slug=child['slug'],
                    type=child['type'],
                    order=child['order'],
                    parent_id=parent.id
                ))

    db.commit()
    db.close()
    print("✅ Navigation items seeded.")
