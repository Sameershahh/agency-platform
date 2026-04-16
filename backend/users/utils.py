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

    subject = "Verify your email - NeuraStack"
    message = (
        f"Hi {user.first_name or 'User'},\n\n"
        f"Your email verification code is: {code}\n\n"
        f"This code will expire in 10 minutes.\n\n"
        f"If you did not request this, please ignore this email.\n\n"
        "Thanks,\nSameer Shah\nNeuraStack Team"
    )

    html_message = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://neurastack-agency.vercel.app/neurastack-logo-email.png" alt="NeuraStack Logo" style="max-width: 180px; height: auto;">
        </div>
        <div style="color: #374151; font-size: 16px; line-height: 1.6;">
            <p>Hi <strong>{user.first_name or 'User'}</strong>,</p>
            <p>Welcome to NeuraStack! Please use the following verification code to confirm your email address:</p>
            <div style="text-align: center; margin: 35px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px dashed #d1d5db;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #111827;">{code}</span>
            </div>
            <p style="font-size: 14px; color: #6b7280;">This code will expire in 10 minutes. If you did not sign up for NeuraStack, you can safely ignore this email.</p>
            <br>
            <p>Best regards,<br><strong>Sameer Shah</strong><br><span style="color: #6b7280; font-size: 14px;">Founder & Lead Developer</span></p>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 20px 0;">
        <div style="text-align: center; color: #9ca3af; font-size: 12px;">
            &copy; {timezone.now().year} NeuraStack Agency. All rights reserved.
        </div>
    </div>
    """

    send_mail(
        subject,
        message,
        getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
        [user.email],
        fail_silently=False,
        html_message=html_message,
        
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
