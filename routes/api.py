from flask import Blueprint, jsonify
from models.models import BlogPost

api_bp = Blueprint('api', __name__)

@api_bp.route('/posts')
def get_posts():
    posts = BlogPost.query.all()
    return jsonify([{
        'title': p.title,
        'content': p.content,
        'age_group': p.age_group,
        'created_at': p.created_at.isoformat()
    } for p in posts])
