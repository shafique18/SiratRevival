from flask_mail import Message
from app import mail

def send_contact_email(name, email, message):
    msg = Message(subject="New Contact Message",
                  sender='noreply@example.com',
                  recipients=email)
    msg.body = f"From: {name} <{email}>\n\n{message}"
    mail.send(msg)
