from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'book-parts', BookPartViewSet)    
router.register(r'lessons', BookLessonViewSet)
router.register(r'blocks', BookBlockViewSet)
router.register(r'exercises', BookExerciseViewSet)
router.register(r'reel', BlockReelViewSet)
router.register(r'objectives', BlockObjectiveViewSet)
router.register(r'ai-lessons', AIBookLessonViewSet)
router.register(r'ai-blocks', AIBlockViewSet)
router.register(r'lesson-index', LessonIndexViewSet)

urlpatterns = [
    path('similar-blocks/', SimilarBlockView.as_view(), name='similar-blocks'),
] + router.urls