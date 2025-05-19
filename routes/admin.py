# routes/admin.py
from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user
from extension import db
from models.models import BlogPost, User

admin_bp = Blueprint("admin", __name__, template_folder="../templates")

@admin_bp.route("/admin/dashboard")
@login_required
def dashboard():
    if not current_user.is_authenticated or current_user.email != "shafiquekb.1@gmail.com":
        return redirect(url_for("auth.login"))

    posts = BlogPost.query.order_by(BlogPost.created_at.desc()).all()
    return render_template("dashboard.html", posts=posts)

@admin_bp.route("/admin/approve/<int:post_id>")
@login_required
def approve_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    post.status = "approved"
    db.session.commit()
    return redirect(url_for("admin.dashboard"))

@admin_bp.route("/admin/reject/<int:post_id>")
@login_required
def reject_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    post.status = "rejected"
    db.session.commit()
    return redirect(url_for("admin.dashboard"))
