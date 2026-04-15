"""
Django settings for backend project.
Professional dual-environment configuration (Dev + Prod)
AWS DEPLOYMENT READY VERSION
"""
import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import environ
import dj_database_url

# ----------------------------------------------------------------------
#  Base Setup
# ----------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

# Global Production Detection
DATABASE_URL = os.getenv("DATABASE_URL")
IS_PRODUCTION = DATABASE_URL is not None


# ----------------------------------------------------------------------
#  Core Environment
# ----------------------------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()

if ENVIRONMENT == "production" and not SECRET_KEY:
    raise Exception("SECRET_KEY must be set in the production environment variables.")

if not SECRET_KEY:
    SECRET_KEY = "django-insecure-dev-only-secret-key"

# ----------------------------------------------------------------------
#  Hosts and Security
# ----------------------------------------------------------------------
# Get hosts from environment variable
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")
ALLOWED_HOSTS = [h.strip() for h in ALLOWED_HOSTS if h.strip()]

# Add environment-specific defaults
if ENVIRONMENT == "production":
    ALLOWED_HOSTS += [
        ".elasticbeanstalk.com",  # AWS Elastic Beanstalk
        ".compute.amazonaws.com",  # AWS EC2
    ]

if DEBUG or ENVIRONMENT == "development":
    ALLOWED_HOSTS += ["127.0.0.1", "localhost", "localhost:8000", "127.0.0.1:8000"]

# Security settings (strict if DATABASE_URL/Prod is present)
if IS_PRODUCTION:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
else:
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SECURE_HSTS_SECONDS = 0
    SECURE_HSTS_INCLUDE_SUBDOMAINS = False
    SECURE_HSTS_PRELOAD = False

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_REFERRER_POLICY = 'same-origin'

# ----------------------------------------------------------------------
#  Installed Apps
# ----------------------------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.sites',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    "django_filters",

    # Project apps
    'users',
    # 'chatbot',  # Uncomment if you need chatbot functionality
    'projects',
    'subscriptions',

    # Allauth
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
]

# ----------------------------------------------------------------------
#  Middleware
# ----------------------------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ----------------------------------------------------------------------
#  Database - AUTOMATIC DETECTION
# ----------------------------------------------------------------------
if DATABASE_URL:
    # Use Postgres (Production)
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL, 
            conn_max_age=600, 
            ssl_require=True
        )
    }
else:
    # Fallback to Local SQLite (Development)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# ----------------------------------------------------------------------
#  Authentication
# ----------------------------------------------------------------------
AUTH_USER_MODEL = "users.CustomUser"
SITE_ID = 1

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# ----------------------------------------------------------------------
#  URLs / Frontend
# ----------------------------------------------------------------------
if ENVIRONMENT == "production":
    FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://neurastack-agency.vercel.app")
    BACKEND_URL = os.environ.get("BACKEND_URL")
    if not BACKEND_URL:
        raise Exception("BACKEND_URL is required in production. Set it to your AWS EB URL.")
else:
    FRONTEND_URL = "http://localhost:3000"
    BACKEND_URL = "http://127.0.0.1:8000"

# ----------------------------------------------------------------------
#  Allauth Configuration - ENHANCED
# ----------------------------------------------------------------------
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 3

# Redirect URLs
LOGIN_URL = f"{FRONTEND_URL}/login"
LOGIN_REDIRECT_URL = f"{FRONTEND_URL}/dashboard"
LOGOUT_REDIRECT_URL = FRONTEND_URL
ACCOUNT_EMAIL_CONFIRMATION_ANONYMOUS_REDIRECT_URL = f"{FRONTEND_URL}/email-confirmed"
ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = f"{FRONTEND_URL}/dashboard"

# Password Reset Cookies
PASSWORD_RESET_COOKIE_NAME = os.environ.get("PASSWORD_RESET_COOKIE_NAME", "password_reset")
PASSWORD_RESET_COOKIE_AGE = int(os.environ.get("PASSWORD_RESET_COOKIE_AGE", 60 * 15))
PASSWORD_RESET_COOKIE_DOMAIN = os.environ.get("PASSWORD_RESET_COOKIE_DOMAIN", "")

# ----------------------------------------------------------------------
#  CORS - FIXED: Environment-specific configuration
# ----------------------------------------------------------------------
CORS_ALLOW_ALL_ORIGINS = False

if ENVIRONMENT == "production":
    CORS_ALLOWED_ORIGINS = [
        "https://neurastack-agency.vercel.app",
        BACKEND_URL,  # Allow backend to call itself
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

CORS_ALLOW_CREDENTIALS = True

# ----------------------------------------------------------------------
#  CSRF Protection - ADDED: Missing configuration
# ----------------------------------------------------------------------
CSRF_TRUSTED_ORIGINS = [
    "https://neurastack-agency.vercel.app",
    "https://*.elasticbeanstalk.com",
]

if DEBUG or ENVIRONMENT == "development":
    CSRF_TRUSTED_ORIGINS += [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

# Cookie settings
if IS_PRODUCTION:
    SESSION_COOKIE_SAMESITE = "None"  # Required for cross-origin
    CSRF_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
else:
    SESSION_COOKIE_SAMESITE = "Lax"
    CSRF_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False

# ----------------------------------------------------------------------
#  REST Framework
# ----------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'users.authentication.CookieJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# ----------------------------------------------------------------------
#  JWT Configuration - ADDED: Missing JWT settings
# ----------------------------------------------------------------------
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    
    # Cookie-based JWT
    'AUTH_COOKIE': 'access_token',            # Name of the cookie
    'AUTH_COOKIE_REFRESH': 'refresh_token',   # Name of the refresh cookie
    'AUTH_COOKIE_SECURE': IS_PRODUCTION,
    'AUTH_COOKIE_HTTP_ONLY': True,            # Forbidden from JavaScript
    'AUTH_COOKIE_SAMESITE': 'None' if IS_PRODUCTION else 'Lax',
    'AUTH_COOKIE_PATH': '/',
}

# ----------------------------------------------------------------------
#  Email - ENHANCED: Use SMTP if credentials provided, else console
# ----------------------------------------------------------------------
EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

if EMAIL_HOST_USER:
    DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", f"NeuraStack <{EMAIL_HOST_USER}>")
    # If we have credentials, use SMTP backend unless overridden
    if not os.getenv("EMAIL_BACKEND"):
        EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
else:
    # Fallback for dev without credentials
    if ENVIRONMENT != "production":
        EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
        DEFAULT_FROM_EMAIL = "noreply@localhost"
    else:
        DEFAULT_FROM_EMAIL = "noreply@example.com"

# ----------------------------------------------------------------------
#  External Services
# ----------------------------------------------------------------------
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

# ----------------------------------------------------------------------
#  Static & Media Files
# ----------------------------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files (if you're uploading documents/images)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# ----------------------------------------------------------------------
#  Internationalization
# ----------------------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ----------------------------------------------------------------------
#  Logging - Enhanced with more detail
# ----------------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO" if ENVIRONMENT == "production" else "DEBUG",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}

# ----------------------------------------------------------------------
#  Development/Debug Settings
# ----------------------------------------------------------------------
if DEBUG:
    # Show more detailed error pages in development
    INTERNAL_IPS = ['127.0.0.1', 'localhost']