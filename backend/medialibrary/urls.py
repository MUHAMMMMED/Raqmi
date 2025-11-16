 
from django.urls import path
from . import views

urlpatterns = [
    path('media/', views.MediaListView.as_view(), name='media-list'),
    path('media/upload/', views.MediaUploadView.as_view(), name='media-upload'),
    path('media/<int:media_id>/', views.MediaDetailView.as_view(), name='media-detail'),
    path('media/bulk-delete/', views.MediaBulkDeleteView.as_view(), name='media-bulk-delete'),
]