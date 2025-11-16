from rest_framework import viewsets
from .utils.mixins import DebugViewSetMixin
from .utils.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
import torch
from sentence_transformers import SentenceTransformer, util
from books.utils.service import increment_counter, double_value  

from .models import *
from .serializers import *
from lessons.models import Lesson, Course

model = SentenceTransformer('all-MiniLM-L6-v2')
 
class BookViewSet(DebugViewSetMixin,viewsets.ModelViewSet):

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



class BookPartViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
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


class BookExerciseViewSet(viewsets.ModelViewSet):
    queryset = BlockExercise.objects.all().order_by('order')
    serializer_class = BlockExerciseSerializer

   


class BlockObjectiveViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = BlockLearningObjective.objects.all()
    serializer_class = BlockLearningObjectiveSerializer

 
class BlockReelViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = BlockReel.objects.all()
    serializer_class = BlockReelSerializer

#   DebugViewSetMixin,
class LessonIndexViewSet(viewsets.ModelViewSet):
    queryset = LessonIndex.objects.all()
    serializer_class = LessonIndexSerializer
  
   
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
    



 
class LessonIndexView(APIView):
    def get(self, request, id):
        index = get_object_or_404(LessonIndex, pk=id)

        filters = dict(
            stage=index.stage,
            grade=index.grade,
            program=index.program,
            subject=index.subject,
        )

        courses = Course.objects.filter(**filters)
        lessons = Lesson.objects.filter(course__in=courses)
        books = Book.objects.filter(**filters)
        parts = BookPart.objects.filter(book__in=books)
        book_lessons = BookLesson.objects.filter(part__in=parts)

        lesson_serializer = LessonMiniSerializer(lessons, many=True)
        book_lessons_serializer = BookLessonMiniSerializer(book_lessons, many=True)

        data = {
            "lessons": lesson_serializer.data,
            "book_lessons": book_lessons_serializer.data,
        }

        return Response(data, status=status.HTTP_200_OK)
    

  