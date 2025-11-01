 
from rest_framework import viewsets
from .models import Card
from .serializers import CardSerializer
from books.utils.mixins import DebugViewSetMixin

class CardViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = Card.objects.all().order_by('-created_at')
    serializer_class = CardSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        lesson_id = self.request.query_params.get("lesson")
        block_id = self.request.query_params.get("block")

        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        if block_id:
            queryset = queryset.filter(block_id=block_id)

        return queryset