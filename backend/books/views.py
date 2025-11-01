from rest_framework import viewsets
from .utils.mixins import DebugViewSetMixin
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import torch
from sentence_transformers import SentenceTransformer, util
from .models import *
from .serializers import *
from .utils.permissions import IsOwnerOrReadOnly
from books.utils.service import increment_counter, double_value  


model = SentenceTransformer('all-MiniLM-L6-v2')


# ===================== BookViewSet =====================

 

class BookViewSet(viewsets.ModelViewSet):

    # permission_classes = [IsAuthenticated],IsOwnerOrReadOnly

    queryset = Book.objects.all().order_by('id')
    serializer_class = BookSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        اختبار الحقول الوهمية عند GET على تفاصيل كتاب
        """
        instance = self.get_object()

        # # استخدام الفانكشنات مع بيانات وهمية
        # fake_counter = increment_counter(getattr(instance, "view_count", 0))
        # fake_double = double_value(getattr(instance, "view_count", 0))

        serializer = self.get_serializer(instance)
        data = serializer.data
        # data["view_count_mock"] = fake_counter
        # data["view_count_double"] = fake_double
        return Response(data)



class BookPartViewSet(viewsets.ModelViewSet):
    queryset = BookPart.objects.all().order_by('order')
    serializer_class = BookPartSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course')
        if course_id:
            queryset = queryset.filter(course_id=course_id).distinct()
        return queryset


class BookLessonViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = BookLesson.objects.all().order_by('order')
    serializer_class = BookLessonSerializer
 

class BookBlockViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = BookBlock.objects.all().order_by('order')
    serializer_class = BookBlockSerializer

class BookExerciseViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = BookExercise.objects.all().order_by('order')
    serializer_class = BookExerciseSerializer

class BlockObjectiveViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = BlockLearningObjective.objects.all()
    serializer_class = BlockLearningObjectiveSerializer



class BlockReelViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = BlockReel.objects.all()
    serializer_class = BlockReelSerializer






 


class AIBookLessonViewSet(viewsets.ModelViewSet):
    queryset = AIBookLesson.objects.all()
    serializer_class = AIBookLessonSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['order', 'title']

class AIBlockViewSet(viewsets.ModelViewSet):
    queryset = AIBlock.objects.all()
    serializer_class = AIBlockSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'title']

class LessonIndexViewSet(viewsets.ModelViewSet):
    queryset = LessonIndex.objects.all()
    serializer_class = LessonIndexSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'ai_lesson__title']
    ordering_fields = ['title']


 
 
 

class SimilarBlockView(APIView):
    """
    يأخذ وصف نصي ويرجع أقرب BookBlock حسب التشابه
    """

    def get(self, request, *args, **kwargs):
        title = request.GET.get('title', '')
        top_k = int(request.GET.get('top_k', 5))
     
        threshold = 0.80 
        if not title:
            return Response({"error": "title is required"}, status=400)

        blocks = BookBlock.objects.exclude(embedding_vector__isnull=True)
        if not blocks.exists():
            return Response({"error": "No blocks with embeddings found"}, status=404)

        device = "cuda" if torch.cuda.is_available() else "cpu"

        block_embeddings = torch.tensor([b.embedding_vector for b in blocks], device=device)
        query_embedding = model.encode(title, convert_to_tensor=True, device=device)

        cos_scores = util.cos_sim(query_embedding, block_embeddings)[0]
        top_results = torch.topk(cos_scores, k=min(top_k, len(blocks)))

        indices = top_results.indices.tolist()
        values = top_results.values.tolist()

        response_data = []
        for score, idx in zip(values, indices):
            if score < threshold:
                continue  # تجاهل النتائج الأقل من العتبة
            block = blocks[idx]
            response_data.append({
                "id": block.id,
                "title": block.title,
                "similarity_score": float(score)
            })

        if not response_data:
            return Response({"message": "No similar blocks above threshold"}, status=200)

        return Response(response_data)