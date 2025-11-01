# from rest_framework import viewsets
# from rest_framework.response import Response
# from .models import Lesson
# from .serializers import LessonSerializer

# class LessonViewSet(viewsets.ModelViewSet):
#     queryset = Lesson.objects.all().order_by('order')
#     serializer_class = LessonSerializer

#     def get_queryset(self):
#         """
#         ترجع الدروس الخاصة بكتاب معين إذا تم تمرير ?book=<id>
#         """
#         queryset = super().get_queryset()
#         book_id = self.request.query_params.get('book')
#         if book_id:
#             queryset = queryset.filter(book_id=book_id)
#         return queryset



from rest_framework import viewsets
from .models import Lesson, LessonSource, LessonQuestion, PromptTemplate, Artifact
from .serializers import (
    LessonSerializer,
    LessonSourceSerializer,
    LessonQuestionSerializer,
    PromptTemplateSerializer,
    ArtifactSerializer
)


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course')
        if course_id:
            queryset = queryset.filter(course_id=course_id).distinct()
        return queryset


class LessonSourceViewSet(viewsets.ModelViewSet):
    queryset = LessonSource.objects.all()
    serializer_class = LessonSourceSerializer


class LessonQuestionViewSet(viewsets.ModelViewSet):
    queryset = LessonQuestion.objects.all()
    serializer_class = LessonQuestionSerializer


class PromptTemplateViewSet(viewsets.ModelViewSet):
    queryset = PromptTemplate.objects.all()
    serializer_class = PromptTemplateSerializer


class ArtifactViewSet(viewsets.ModelViewSet):
    queryset = Artifact.objects.all()
    serializer_class = ArtifactSerializer