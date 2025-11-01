from django.urls import path
from .views import *

urlpatterns = [
    # path("generate-video/", start_video_generation),
    path("generate-video/<int:task_id>/status/", check_video_status),
]