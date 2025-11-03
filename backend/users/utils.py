# users/utils.py
from django.core import signing
from django.conf import settings
from django.urls import reverse
from django.core.mail import send_mail
from urllib.parse import urlencode
from datetime import timedelta
from django.utils import timezone

SIGNING_SALT = "email-verification-salt"
TOKEN_MAX_AGE = 60 * 60 * 24  # 24 hours
RESET_TOKEN_SALT = "password-reset-salt"

def make_email_token(user):
    payload = {"user_id": user.id}
    token = signing.dumps(payload, salt=SIGNING_SALT)
    return token

def verify_email_token(token, max_age=TOKEN_MAX_AGE):
    try:
        data = signing.loads(token, salt=SIGNING_SALT, max_age=max_age)
        return data  # dict containing user_id
    except signing.BadSignature:
        return None
    except signing.SignatureExpired:
        return None

def send_verification_email(user, request):
    """
    Sends verification email with a tokenized link.
    The frontend redirect URL is controlled by settings.FRONTEND_URL.
    """
    from django.conf import settings

    token = make_email_token(user)
    frontend_base = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    # build backend verify endpoint that will redirect to frontend
    verify_path = reverse("users:verify-email")  # we'll add namespaced URL
    # attach token as query param
    backend_verify_url = request.build_absolute_uri(f"{verify_path}?{urlencode({'token': token})}")

    # OR send a direct frontend link that calls backend for verification:
    # Frontend page that will call backend to verify and then show UI:
    frontend_verify_url = f"{frontend_base}/email-verified?token={token}"

    subject = "Verify your email"
    message = (
        f"Hi {user.first_name},\n\n"
        f"Please verify your email by clicking the link below:\n\n"
        f"{backend_verify_url}\n\n"
        f"If you didn't register, ignore this message.\n\n"
        "Thanks,\nSameer SaaS Team"
    )
    # For dev, console backend prints this. In production configure SMTP.
    send_mail(
        subject,
        message,
        getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
        [user.email],
        fail_silently=False,
    )
    return True

def generate_password_reset_token(user):
    data = {"user_id": user.id, "timestamp": timezone.now().timestamp()}
    return signing.dumps(data, salt=RESET_TOKEN_SALT)

def verify_password_reset_token(token, max_age=3600):  # 1 hour validity
    try:
        data = signing.loads(token, salt=RESET_TOKEN_SALT, max_age=max_age)
        return data
    except signing.BadSignature:
        return None
    except signing.SignatureExpired:
        return None
