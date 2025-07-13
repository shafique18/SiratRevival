import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


from app.models.sqlalchemy.content import QuranVerse, Hadith, NewsArticle
from app.models.sqlalchemy.navigation import MenuDB, SubMenuDB, LearningPathDB, ModuleDB, ContentDB, UserProgressDB, NavigationItem