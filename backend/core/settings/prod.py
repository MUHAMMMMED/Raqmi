from .base import *

DEBUG = False
ALLOWED_HOSTS = ["my-production-domain.com"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB"),
        "USER": os.getenv("POSTGRES_USER"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD"),
        "HOST": os.getenv("POSTGRES_HOST"),
        "PORT": os.getenv("POSTGRES_PORT"),
    }
}

base_url = "https://my-production-domain.com"


# مثال لتشغيل prod
# export DJANGO_SETTINGS_MODULE="core.settings.prod"
# python manage.py runserver