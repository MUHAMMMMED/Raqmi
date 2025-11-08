 
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'contents', views.ContentViewSet, basename='content')
router.register(r'slides', views.SlideViewSet, basename='slide')
router.register(r'blocks', views.SlideBlockViewSet, basename='block')
router.register(r'history-logs', views.HistoryLogViewSet, basename='historylog')

 
urlpatterns = [
 
    path('', include(router.urls)),
]