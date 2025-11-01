 
from rest_framework.routers import DefaultRouter
from .views import *
   
     
router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'lesson-sources', LessonSourceViewSet)
router.register(r'lesson-questions', LessonQuestionViewSet)
router.register(r'prompt-templates', PromptTemplateViewSet)
router.register(r'artifacts', ArtifactViewSet)

urlpatterns = router.urls