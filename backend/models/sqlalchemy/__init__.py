import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


from backend.models.sqlalchemy.content import QuranVerse, Hadith, NewsArticle
from backend.models.sqlalchemy.navigation import MenuDB, SubMenuDB, LearningPathDB, ModuleDB, ContentDB, UserProgressDB, NavigationItem