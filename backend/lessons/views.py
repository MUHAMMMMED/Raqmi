from books.utils.mixins import DebugViewSetMixin

from rest_framework import viewsets
from .models import *
from .serializers import*


class LessonViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course')
        if course_id:
            queryset = queryset.filter(course_id=course_id).distinct()
        return queryset


# class LessonSourceViewSet(viewsets.ModelViewSet):
#     queryset = LessonSource.objects.all()
#     serializer_class = LessonSourceSerializer


# class LessonQuestionViewSet(viewsets.ModelViewSet):
#     queryset = LessonQuestion.objects.all()
#     serializer_class = LessonQuestionSerializer


# class PromptTemplateViewSet(viewsets.ModelViewSet):
#     queryset = PromptTemplate.objects.all()
#     serializer_class = PromptTemplateSerializer


# class ArtifactViewSet(viewsets.ModelViewSet):
#     queryset = Artifact.objects.all()
#     serializer_class = ArtifactSerializer