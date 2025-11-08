from books.utils.mixins import DebugViewSetMixin
from rest_framework import viewsets 
from .models import*
from .serializers import*
  

class ContentViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = Content.objects.all() 
    serializer_class = ContentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        lesson_id = self.request.query_params.get("lesson")
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        return queryset
    


class SlideViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = Slide.objects.all().order_by("order")
    serializer_class = SlideSerializer

    def get_queryset(self):
      queryset = super().get_queryset()
      content_id = self.request.query_params.get("content")
      if content_id:
        queryset = queryset.filter(content_id=content_id)
      return queryset
    
    

class SlideBlockViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = SlideBlock.objects.all()
    serializer_class = SlideBlockSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        slide_id = self.request.query_params.get("slide")
        if slide_id:
            queryset = queryset.filter(slide_id=slide_id)
        return queryset

    def perform_create(self, serializer):
        slide_id = self.request.data.get('slide')
        if not slide_id:
            raise serializers.ValidationError("slide field is required")
        serializer.save(slide_id=slide_id)




class HistoryLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HistoryLog.objects.all()
    serializer_class = HistoryLogSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        slide_id = self.request.query_params.get("slide")
        if slide_id:
            queryset = queryset.filter(slide_id=slide_id)
        return queryset








