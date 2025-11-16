from books.utils.mixins import DebugViewSetMixin
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import*
from books.models import   BlockExercise


class LessonViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course')
        if course_id:
            queryset = queryset.filter(course_id=course_id).distinct()
        return queryset



class BlockViewSet(DebugViewSetMixin,viewsets.ModelViewSet):
    queryset = Block.objects.all()
    serializer_class = BlockMiniSerializer
  
class LessonContentView(APIView):
    def get(self, request, id):
        lesson = get_object_or_404(Lesson, pk=id)
        serializer = LessonContentSerializer(lesson)
        return Response(serializer.data, status=status.HTTP_200_OK)
  
 
class LinkedBlocks(APIView):
    def post(self, request):
        block_id = request.data.get('id')
        linked_block_id = request.data.get('linked_id')

        # تحقق من صحة البيانات
        if not block_id or not linked_block_id:
            return Response({'detail': 'بيانات ناقصة'}, status=status.HTTP_400_BAD_REQUEST)

        block = get_object_or_404(Block, pk=block_id)

        # تحقق إذا كان الـ linked block موجود مسبقًا لتجنب التكرار
        if block.linked_blocks.filter(pk=linked_block_id).exists():
            return Response({'detail': 'هذا البلوك مرتبط بالفعل'}, status=status.HTTP_400_BAD_REQUEST)

        block.linked_blocks.add(linked_block_id)
        return Response({'detail': 'تمت الإضافة بنجاح'}, status=status.HTTP_200_OK)

    def delete(self, request):
        block_id = request.data.get('id')
        linked_block_id = request.data.get('linked_id')

        # تحقق من صحة البيانات
        if not block_id or not linked_block_id:
            return Response({'detail': 'بيانات ناقصة'}, status=status.HTTP_400_BAD_REQUEST)

        block = get_object_or_404(Block, pk=block_id)

        # تحقق إذا كان الرابط موجود قبل الحذف
        if not block.linked_blocks.filter(pk=linked_block_id).exists():
            return Response({'detail': 'هذا البلوك غير مرتبط بهذا الدرس'}, status=status.HTTP_400_BAD_REQUEST)

        block.linked_blocks.remove(linked_block_id)
        return Response({'detail': 'تم الحذف بنجاح'}, status=status.HTTP_200_OK)

 
 
class LinkedCards(APIView):
    def post(self, request):
        block_id = request.data.get('id')
        card_id = request.data.get('linked_id')

        # التحقق من صحة البيانات
        if not block_id or not card_id:
            return Response({'detail': 'بيانات ناقصة'}, status=status.HTTP_400_BAD_REQUEST)

        block = get_object_or_404(Block, pk=block_id)
        card = get_object_or_404(Card, pk=card_id)

        # منع الإضافة المكررة
        if block.cards.filter(pk=card_id).exists():
            return Response({'detail': 'هذا الكارت مرتبط بالفعل بهذا البلوك'}, status=status.HTTP_400_BAD_REQUEST)

        block.cards.add(card)
        return Response({'detail': 'تمت إضافة الكارت بنجاح'}, status=status.HTTP_200_OK)

    def delete(self, request):
        block_id = request.data.get('id')
        card_id = request.data.get('linked_id')

        # التحقق من صحة البيانات
        if not block_id or not card_id:
            return Response({'detail': 'بيانات ناقصة'}, status=status.HTTP_400_BAD_REQUEST)

        block = get_object_or_404(Block, pk=block_id)
        card = get_object_or_404(Card, pk=card_id)

        # التحقق من أن الكارت مرتبط فعلاً قبل الحذف
        if not block.cards.filter(pk=card_id).exists():
            return Response({'detail': 'هذا الكارت غير مرتبط بهذا البلوك'}, status=status.HTTP_400_BAD_REQUEST)

        block.cards.remove(card)
        return Response({'detail': 'تم حذف الكارت بنجاح'}, status=status.HTTP_200_OK)
 

class LinkedExercises(APIView):
    def post(self, request):
        print("===== POST LinkedExercises =====")
        print("البيانات المستلمة:", request.data)

        block_id = request.data.get('id')
        exercise_id = request.data.get('linked_id')
        print("block_id:", block_id)
        print("exercise_id:", exercise_id)

        # التحقق من صحة البيانات
        if not block_id or not exercise_id:
            print("❌ بيانات ناقصة")
            return Response({'detail': 'بيانات ناقصة'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            block = get_object_or_404(Block, pk=block_id)
            print("✅ تم العثور على Block:", block.id)
        except Exception as e:
            print("❌ خطأ أثناء جلب Block:", e)
            return Response({'detail': f'خطأ أثناء جلب البلوك: {e}'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exercise = get_object_or_404(BlockExercise, pk=exercise_id)
            print("✅ تم العثور على Exercise:", exercise.id)
        except Exception as e:
            print("❌ خطأ أثناء جلب Exercise:", e)
            return Response({'detail': f'خطأ أثناء جلب التمرين: {e}'}, status=status.HTTP_400_BAD_REQUEST)

        # منع التكرار
        exists = block.exercise.filter(pk=exercise_id).exists()
        print("هل التمرين مرتبط بالفعل؟", exists)
        if exists:
            print("❌ التمرين مرتبط مسبقاً")
            return Response({'detail': 'هذا التمرين مرتبط بالفعل بهذا البلوك'}, status=status.HTTP_400_BAD_REQUEST)

        block.exercise.add(exercise)
        print("✅ تمت إضافة التمرين بنجاح")
        return Response({'detail': 'تمت إضافة التمرين بنجاح'}, status=status.HTTP_200_OK)

    def delete(self, request):
        print("===== DELETE LinkedExercises =====")
        print("البيانات المستلمة:", request.data)

        block_id = request.data.get('id')
        exercise_id = request.data.get('linked_id')
        print("block_id:", block_id)
        print("exercise_id:", exercise_id)

        # التحقق من صحة البيانات
        if not block_id or not exercise_id:
            print("❌ بيانات ناقصة")
            return Response({'detail': 'بيانات ناقصة'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            block = get_object_or_404(Block, pk=block_id)
            print("✅ تم العثور على Block:", block.id)
        except Exception as e:
            print("❌ خطأ أثناء جلب Block:", e)
            return Response({'detail': f'خطأ أثناء جلب البلوك: {e}'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exercise = get_object_or_404(BlockExercise, pk=exercise_id)
            print("✅ تم العثور على Exercise:", exercise.id)
        except Exception as e:
            print("❌ خطأ أثناء جلب Exercise:", e)
            return Response({'detail': f'خطأ أثناء جلب التمرين: {e}'}, status=status.HTTP_400_BAD_REQUEST)

        exists = block.exercise.filter(pk=exercise_id).exists()
        print("هل التمرين مرتبط بالبلوك؟", exists)
        if not exists:
            print("❌ التمرين غير مرتبط بالبلوك")
            return Response({'detail': 'هذا التمرين غير مرتبط بهذا البلوك'}, status=status.HTTP_400_BAD_REQUEST)

        block.exercise.remove(exercise)
        print("✅ تم حذف التمرين بنجاح")
        return Response({'detail': 'تم حذف التمرين بنجاح'}, status=status.HTTP_200_OK)