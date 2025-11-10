from django.core import signing
from django.conf import settings
from django.urls import reverse
from django.core.mail import send_mail
from urllib.parse import urlencode
from datetime import timedelta
from django.utils import timezone
import random
import string

SIGNING_SALT = "email-verification-salt"
TOKEN_MAX_AGE = 60 * 60 * 24  # 24 hours
RESET_TOKEN_SALT = "password-reset-salt"


# ----------------- EMAIL VERIFICATION (6-digit code) --------------------

def generate_verification_code():
    """Generate a secure 6-digit numeric code."""
    return ''.join(random.choices(string.digits, k=6))


def send_verification_email(user, request=None):
    """
    Sends a 6-digit verification code to user's email.
    This replaces the old tokenized link method.
    """
    # generate and store code with expiry
    code = generate_verification_code()
    user.email_verification_code = code
    user.email_verification_expiry = timezone.now() + timedelta(minutes=10)
    user.save(update_fields=["email_verification_code", "email_verification_expiry"])

    subject = "Verify your email"
    message = (
        f"Hi {user.first_name or 'User'},\n\n"
        f"Your email verification code is: {code}\n\n"
        f"This code will expire in 10 minutes.\n\n"
        f"If you did not request this, please ignore this email.\n\n"
        "Thanks,\nSameer SaaS Team"
    )

    send_mail(
        subject,
        message,
        getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
        [user.email],
        fail_silently=False,
    )
    return True


def verify_email_token(code_data):
    """
    Retained for compatibility — now used for verifying the 6-digit code instead of signed token.
    """
    # expects: {'email': ..., 'code': ...}
    from django.contrib.auth import get_user_model
    User = get_user_model()

    email = code_data.get("email")
    code = code_data.get("code")

    if not email or not code:
        return None

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return None

    # check expiry and match
    if (
        not user.email_verification_code
        or not user.email_verification_expiry
        or user.email_verification_expiry < timezone.now()
        or user.email_verification_code != code
    ):
        return None

    # mark verified
    user.is_email_verified = True
    user.is_active = True
    user.email_verification_code = None
    user.email_verification_expiry = None
    user.save(update_fields=[
        "is_email_verified", "is_active", "email_verification_code", "email_verification_expiry"
    ])
    return {"user_id": user.id}


# -------------------- PASSWORD RESET --------------------

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
