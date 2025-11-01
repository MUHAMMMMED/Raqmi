from rest_framework import serializers
from .models import *
from categories.serializers import SubjectSerializer
from flashcard.serializers import CardSerializer


class BlockLearningObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockLearningObjective
        fields = "__all__"



  


class BookExerciseSerializer(serializers.ModelSerializer):
    block_title = serializers.CharField(source="block.title", read_only=True)
    class Meta:
        model = BookExercise
        fields = "__all__"



class BlockReelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockReel
        fields = "__all__"



# class BookBlockSerializer(serializers.ModelSerializer):
#     blockobjectives = BlockObjectiveSerializer(many=True, read_only=True, source='blockobjective_set')
#     exercises = BookExerciseSerializer(
#         many=True,
#         read_only=True
#     )
#     book_block_card = CardSerializer(
#         many=True,
#         read_only=True
#     )
#     reel_block = BlockReelSerializer(
  
#         read_only=True
#     )
#     class Meta:
#         model = BookBlock
#         fields = "__all__"

# from rest_framework import serializers
# from .models import BookBlock
# from books.models import BookLesson

class BookBlockSerializer(serializers.ModelSerializer):
    objective_block = BlockLearningObjectiveSerializer(
        many=True, read_only=True
    )
    exercises = BookExerciseSerializer(many=True, read_only=True)
    book_block_card = CardSerializer(many=True, read_only=True)
    reel_block = BlockReelSerializer(read_only=True)
 

    class Meta:
        model = BookBlock
        fields = "__all__"

 

# class BookBlockSerializer(serializers.ModelSerializer):
#     # lesson = serializers.PrimaryKeyRelatedField(
#     #     queryset=BookLesson.objects.all()
#     # )
#     # blockobjectives = BlockObjectiveSerializer(many=True, read_only=True, source='blockobjective_set')
#     # exercises = BookExerciseSerializer(many=True, read_only=True)
#     # book_block_card = CardSerializer(many=True, read_only=True)
#     # reel_block = BlockReelSerializer(read_only=True)

#     class Meta:
#         model = BookBlock
#         fields = "__all__"


class BookLessonSerializer(serializers.ModelSerializer):
    blocks = BookBlockSerializer(many=True, read_only=True)
    exercises = BookExerciseSerializer(many=True, read_only=True)

 
    class Meta:
        model = BookLesson
        fields = "__all__"


class BookPartSerializer(serializers.ModelSerializer):
    lessons = BookLessonSerializer(many=True, read_only=True)
    exercises = BookExerciseSerializer(
        many=True,
        read_only=True
    )
 

    
    class Meta:
        model = BookPart
        fields = "__all__"


class BookSerializer(serializers.ModelSerializer):
    parts = BookPartSerializer(many=True, read_only=True)
    subject = SubjectSerializer(read_only=True)

    class Meta:
        model = Book
        fields = "__all__"
        exclode = ['embedding_vector']







 
class AIBookLessonSerializer(serializers.ModelSerializer):
    linked_lessons = BookLessonSerializer(many=True, read_only=True)

    class Meta:
        model = AIBookLesson
        fields = ['id', 'title', 'order', 'embedding_vector', 'linked_lessons']

class AIBlockSerializer(serializers.ModelSerializer):
    linked_blocks = BookBlockSerializer(many=True, read_only=True)
    lesson = AIBookLessonSerializer(read_only=True)

    class Meta:
        model = AIBlock
        fields = ['id', 'title', 'content', 'embedding_vector', 'lesson', 'linked_blocks', 'created_at', 'updated_at']

class LessonIndexSerializer(serializers.ModelSerializer):
    ai_lesson = AIBookLessonSerializer(read_only=True)
    stage = serializers.StringRelatedField()
    grade = serializers.StringRelatedField()
    program = serializers.StringRelatedField()
    subject = serializers.StringRelatedField()

    class Meta:
        model = LessonIndex
        fields = ['id', 'title', 'ai_lesson', 'stage', 'grade', 'program', 'subject', 'embedding_vector']