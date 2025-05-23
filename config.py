import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key'
    
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get('DATABASE_URL') or
        'postgresql://postgres:1234@localhost:5433/postgres'
    )

    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = ''
    MAIL_PASSWORD = ''

    LANGUAGES = ['en', 'ar', 'fr', 'ur','de','nl','hi','pt','es','tr']
    BABEL_DEFAULT_LOCALE = 'en'
