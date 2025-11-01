# reels/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Reel, ReelTemplate, ReelSegment
from .serializers import ReelSerializer, ReelTemplateSerializer

class ReelViewSet(viewsets.ModelViewSet):
    queryset = Reel.objects.all()
    serializer_class = ReelSerializer
    
    def get_queryset(self):
        queryset = Reel.objects.all()
        
        # فلترة حسب الـ lesson إذا كان موجوداً في الـ query params
        lesson_id = self.request.query_params.get('lesson_id')
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
            
        return queryset.select_related(
            'template', 'background_music', 'lesson'
        ).prefetch_related(
            'segments', 'segments__blocks'
        ).order_by('created_at')
    
    @action(detail=False, methods=['get'], url_path='by-lesson/(?P<lesson_id>[^/.]+)')
    def by_lesson(self, request, lesson_id=None):
        """
        الحصول على جميع الريلز الخاصة بدرس معين
        """
        try:
            reels = self.get_queryset().filter(lesson_id=lesson_id)
            serializer = self.get_serializer(reels, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class ReelTemplateViewSet(viewsets.ModelViewSet):
    queryset = ReelTemplate.objects.all()
    serializer_class = ReelTemplateSerializer