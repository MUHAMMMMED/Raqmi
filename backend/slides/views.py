from books.utils.mixins import DebugViewSetMixin
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
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
     

class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.all().order_by("order")
    serializer_class = SlideSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        content_id = self.request.query_params.get("content")
        if content_id:
            queryset = queryset.filter(content_id=content_id)
        return queryset

    # ✅ Endpoint لتحديث ترتيب الشرائح
    @action(detail=False, methods=["post"], url_path="update-order")
    def update_order(self, request):
        slides_data = request.data 
        for slide_data in slides_data:
            try:
                slide = Slide.objects.get(id=slide_data["id"])
                slide.order = slide_data["order"]
                slide.save()
            except Slide.DoesNotExist:
                continue
        return Response({"status": "ok"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="duplicate")
    def duplicate(self, request, pk=None):
     slide = self.get_object()
     new_slide = slide.duplicate()
    #  print("Duplicated slide:", new_slide)
     serializer = self.get_serializer(new_slide)
     return Response(serializer.data, status=status.HTTP_201_CREATED)




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








