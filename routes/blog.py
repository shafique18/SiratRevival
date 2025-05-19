from flask import Blueprint, render_template, redirect, request
from flask_login import login_required
from models.models import BlogPost, db
from forms.blog_form import BlogForm
import markdown

blog_bp = Blueprint('blog', __name__)

@blog_bp.route('/')
def index(): 
    posts = BlogPost.query.order_by(BlogPost.created_at.desc()).all()
    return render_template('index.html', posts=posts)

@blog_bp.route('/dashboard')
@login_required
def dashboard():
    posts = BlogPost.query.all()
    return render_template('dashboard.html', posts=posts)

@blog_bp.route('/new', methods=['GET', 'POST'])
@login_required
def new_post():
    form = BlogForm()
    if form.validate_on_submit():
        post = BlogPost(
            title=form.title.data,
            content=form.content.data,
            age_group=form.age_group.data
        )
        db.session.add(post)
        db.session.commit()
        return redirect('/')
    return render_template('editor.html', form=form)

@blog_bp.route('/age/<group>')
def age_category(group):
    posts = BlogPost.query.filter_by(age_group=group).all()
    return render_template('age_category.html', posts=posts, group=group)

@blog_bp.route('/post/<int:id>')
def post_view(id):
    post = BlogPost.query.get_or_404(id)
    post_content_html = markdown.markdown(post.content, extensions=['fenced_code', 'codehilite'])
    return render_template('blog_post.html', post=post, post_content_html=post_content_html)
