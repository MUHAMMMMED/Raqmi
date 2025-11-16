 
from rest_framework import serializers
from .models import *
from flashcard.serializers import CardSerializer


class BlockReelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockReel
        fields = '__all__'


class BlockLearningObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockLearningObjective
        fields = '__all__'

 


 
class BlockMiniSerializer(serializers.ModelSerializer):
    linked_blocks = serializers.PrimaryKeyRelatedField(
        many=True, queryset=BookBlock.objects.all(), required=False
    )
    cards = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Card.objects.all(), required=False
    )

    class Meta:
        model = Block
        fields = '__all__'


 
class BlockSerializer(serializers.ModelSerializer):
    block_objective = BlockLearningObjectiveSerializer(many=True, read_only=True)
    block_reel = BlockReelSerializer(read_only=True)
    linked_cards = CardSerializer(many=True, read_only=True)
    linked_exercises = serializers.SerializerMethodField()
    linked_blocks = serializers.SerializerMethodField()

    class Meta:
        model = Block
        fields = '__all__'

    def get_linked_exercises(self, obj):
        from books.serializers import BlockExerciseSerializer
        qs = obj.exercise.all()      
        return BlockExerciseSerializer(qs, many=True).data

    def get_linked_blocks(self, obj):
        from books.serializers import BookBlockSerializer
        qs = obj.linked_blocks.all()
        return BookBlockSerializer(qs, many=True).data


 


class LessonSerializer(serializers.ModelSerializer):
    lesson_block = BlockSerializer(many=True, read_only=True)
    class Meta:
        model = Lesson
        fields = '__all__'

  
   

class LessonContentSerializer(serializers.ModelSerializer):
    lesson_block = BlockSerializer(many=True, read_only=True)
    book_block = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = '__all__'

    def get_book_block(self, obj):
        from books.models import LessonIndex
        from books.serializers import BookLessonSerializer

        # جلب LessonIndex المرتبط بالـ Lesson
        lesson_index = LessonIndex.objects.filter(lesson=obj).first()
        if lesson_index:
            # جلب book_lesson فقط باستخدام BookLessonSerializer
            book_lessons = lesson_index.book_lesson.all()
            return BookLessonSerializer(book_lessons, many=True).data
        return []