from django.urls import path
from .views import MediaListView, MediaUploadView

app_name = 'media_library'

urlpatterns = [
    path('media/', MediaListView.as_view(), name='media-list'),
    path('media/upload/', MediaUploadView.as_view(), name='media-upload'),
]