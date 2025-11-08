from .base import *

DEBUG = True
ALLOWED_HOSTS = ["*"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

base_url = "http://localhost:8000"

BASE_URL= "http://127.0.0.1:8000"
 
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


# مثال لتشغيل dev
# export DJANGO_SETTINGS_MODULE="core.settings.dev"
# python manage.py runserver

