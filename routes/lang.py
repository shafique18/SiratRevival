from flask import Blueprint, request, redirect, session, url_for

lang_bp = Blueprint('lang', __name__)

@lang_bp.route('/set-language', methods=['POST'])
def set_language():
    lang = request.form.get('language')
    session['lang'] = lang
    return redirect(request.referrer or url_for('blog.index'))  # change as needed