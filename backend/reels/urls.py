 
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import*

router = DefaultRouter()
router.register(r'reels', ReelViewSet, basename='reel')
router.register(r'reel-templates', ReelTemplateViewSet, basename='reel-template')

urlpatterns = [
    path('', include(router.urls)),
]