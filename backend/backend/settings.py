"""
Django settings for backend project.
Professional dual-environment configuration (Dev + Prod)
"""
import os
from pathlib import Path
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


# ----------------------------------------------------------------------
#  Core Environment
# ----------------------------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-this")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()  # "production" or "development"

# ----------------------------------------------------------------------
#  Hosts and Security
# ----------------------------------------------------------------------
# Default hosts (safe fallback)
ALLOWED_HOSTS = os.getenv(
    "ALLOWED_HOSTS",
    "agency-platform-i9os.onrender.com,neurastack-agency.vercel.app"
).split(",")

# Strip whitespace
ALLOWED_HOSTS = [h.strip() for h in ALLOWED_HOSTS if h.strip()]


# Add localhost automatically in dev
if DEBUG or ENVIRONMENT == "development":
    ALLOWED_HOSTS += ["127.0.0.1", "localhost", "localhost:8000", "127.0.0.1:8000"]

# Security settings (strict in prod, relaxed in dev)
if DEBUG or ENVIRONMENT == "development":
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SECURE_HSTS_SECONDS = 0
    SECURE_HSTS_INCLUDE_SUBDOMAINS = False
    SECURE_HSTS_PRELOAD = False
else:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

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
    #'chatbot',
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
#  Database
# ----------------------------------------------------------------------
if ENVIRONMENT == "production":
    DATABASES = {
        "default": dj_database_url.parse(
            os.getenv("DATABASE_URL"),
            conn_max_age=600,
            ssl_require=True,
        )
    }
else:
    # Local development / testing uses SQLite
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

ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_CONFIRM_EMAIL_ON_GET = True

LOGIN_REDIRECT_URL = '/dashboard/'
LOGOUT_REDIRECT_URL = '/'

# ----------------------------------------------------------------------
#  URLs / Frontend
# ----------------------------------------------------------------------
if ENVIRONMENT == "production":
    FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://neurastack-agency.vercel.app")
    BACKEND_URL = os.environ.get("BACKEND_URL", "https://your-backend.onrender.com")
else:
    # Force localhost in development
    FRONTEND_URL = "http://localhost:3000"
    BACKEND_URL = "http://127.0.0.1:8000"

PASSWORD_RESET_COOKIE_NAME = os.environ.get("PASSWORD_RESET_COOKIE_NAME", "password_reset")
PASSWORD_RESET_COOKIE_AGE = int(os.environ.get("PASSWORD_RESET_COOKIE_AGE", 60 * 15))
PASSWORD_RESET_COOKIE_DOMAIN = os.environ.get("PASSWORD_RESET_COOKIE_DOMAIN", "")

# ----------------------------------------------------------------------
#  CORS
# ----------------------------------------------------------------------
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://neurastack-agency.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True

SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"


# ----------------------------------------------------------------------
#  REST Framework
# ----------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# ----------------------------------------------------------------------
#  Email
# ----------------------------------------------------------------------
EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")
EMAIL_HOST = os.getenv("EMAIL_HOST", "")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "noreply@example.com")

# ----------------------------------------------------------------------
#  External Services
# ----------------------------------------------------------------------
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

# ----------------------------------------------------------------------
#  Static Files
# ----------------------------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ----------------------------------------------------------------------
#  Internationalization
# ----------------------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ----------------------------------------------------------------------
#  Logging 
# ----------------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO" if ENVIRONMENT == "production" else "DEBUG",
    },
}