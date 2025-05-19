# routes/contact.py
from flask import Blueprint, render_template, redirect, url_for, flash
from forms.contact_form import ContactForm
from utils.email_sender import send_contact_email

contact_bp = Blueprint("contact", __name__, template_folder="../templates")

@contact_bp.route("/contact", methods=["GET", "POST"])
def contact():
    form = ContactForm()
    if form.validate_on_submit():
        # Send email (or store message in DB)
        send_contact_email(name=form.name.data, email=form.email.data, message=form.message.data)
        flash("Message sent successfully!", "success")
        return redirect(url_for("contact.thank_you"))
    return render_template("contact.html", form=form)

@contact_bp.route("/thank-you")
def thank_you():
    return render_template("thank_you.html")
