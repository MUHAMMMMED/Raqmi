from django.urls import path
from .views import get_history

urlpatterns = [
    path("history/", get_history),
]