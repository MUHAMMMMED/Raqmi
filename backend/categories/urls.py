from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'stages', StageViewSet)
router.register(r'grades', GradeViewSet)
router.register(r'programs', ProgramViewSet)
router.register(r'subjects', SubjectViewSet)

urlpatterns = router.urls