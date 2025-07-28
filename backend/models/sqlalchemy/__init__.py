import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


from backend.models.sqlalchemy.content import QuranVerse, Hadith, NewsArticle, ContentDB, HadithTranslation, ContentTranslation, ContentVersion, Language, QuranTranslation, IslamicFigure, IslamicTopic, IslamicTopicCategory, TopicContent, FigureContent, AIInteraction
from backend.models.sqlalchemy.navigation import MenuDB, SubMenuDB, LearningPathDB, ModuleDB, UserProgressDB, NavigationItem
from backend.models.sqlalchemy.team import TeamMember, SocialLink