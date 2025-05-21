from flask import Flask
from config import Config
from extension import db, login_manager, mail, migrate,babel

def get_locale():
    from flask import session, request
    return session.get('lang', request.accept_languages.best_match(Config.LANGUAGES))

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    babel.init_app(app,locale_selector=get_locale)
    db.init_app(app)
    migrate.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)

    login_manager.login_view = 'auth.login'

    from routes.auth import auth_bp
    from routes.blog import blog_bp
    from routes.api import api_bp
    from routes.admin import admin_bp
    from routes.contact import contact_bp
    from routes.lang import lang_bp


    app.register_blueprint(auth_bp)
    app.register_blueprint(blog_bp)
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(admin_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(lang_bp)

    from models import models  # Ensure models are loaded
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
