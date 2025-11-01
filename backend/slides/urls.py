 
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
 
router.register(r'slides', views.SlideViewSet, basename='slide')
router.register(r'slide-blocks', views.SlideBlockViewSet, basename='slideblock')
router.register(r'history-logs', views.HistoryLogViewSet, basename='historylog')

 
urlpatterns = [
 
    path('', include(router.urls)),
]