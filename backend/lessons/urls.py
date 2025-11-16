from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'blocks', BlockViewSet)

urlpatterns = [
    path('<int:id>/content/', LessonContentView.as_view(), name='lesson-content'),
    path('linked-blocks/', LinkedBlocks.as_view(), name='linked-blocks'),
    path('linked-cards/', LinkedCards.as_view(), name='linked-cards'),
    path('linked-exercises/', LinkedExercises.as_view(), name='linked-exercises'),

    path('', include(router.urls)),  
]