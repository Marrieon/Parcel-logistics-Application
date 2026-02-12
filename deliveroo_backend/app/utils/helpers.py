from flask_mail import Message
from app import mail
from flask import current_app
import threading

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

def send_email(to, subject, template):
    app = current_app._get_current_object()
    msg = Message(
        subject,
        recipients=[to],
        html=template,
        sender=app.config['MAIL_DEFAULT_SENDER']
    )
    thr = threading.Thread(target=send_async_email, args=[app, msg])
    thr.start()
    return thr

def get_full_image_url(filename):
    """Helper to construct the full URL for an image."""
    if not filename:
        return None

    return f"/uploads/{filename}"