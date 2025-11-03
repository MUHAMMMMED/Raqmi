from rest_framework import serializers
from .models import *
from categories.serializers import  *
from flashcard.serializers import CardSerializer


class BlockLearningObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockLearningObjective
        fields = "__all__"


 

class BlockExerciseSerializer(serializers.ModelSerializer):
    block_title = serializers.CharField(source="block.title", read_only=True)
    class Meta:
        model = BlockExercise
        fields = "__all__"



class BlockReelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockReel
        fields = "__all__"

 
class BookBlockSerializer(serializers.ModelSerializer):
    objective_block = BlockLearningObjectiveSerializer(
        many=True, read_only=True
    )
    exercises = BlockExerciseSerializer(many=True, read_only=True)
    book_block_card = CardSerializer(many=True, read_only=True)
    reel_block = BlockReelSerializer(read_only=True)
 

    class Meta:
        model = BookBlock
        fields = "__all__"

 
 

class BookLessonSerializer(serializers.ModelSerializer):
    blocks = BookBlockSerializer(many=True, read_only=True)
    exercises = BlockExerciseSerializer(many=True, read_only=True)

 
    class Meta:
        model = BookLesson
        fields = "__all__"


class BookPartSerializer(serializers.ModelSerializer):
    lessons = BookLessonSerializer(many=True, read_only=True)
    exercises = BlockExerciseSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = BookPart
        fields = "__all__"

 
class BookSerializer(serializers.ModelSerializer):
    parts = BookPartSerializer(many=True, read_only=True)

    stage = serializers.PrimaryKeyRelatedField(queryset=Stage.objects.all())
    grade = serializers.PrimaryKeyRelatedField(queryset=Grade.objects.all())
    program = serializers.PrimaryKeyRelatedField(queryset=Program.objects.all())
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    pdf = serializers.FileField(required=False, allow_null=True) 

    stage_title = serializers.CharField(source='stage.name', read_only=True)
    grade_title = serializers.CharField(source='grade.name', read_only=True)
    program_title = serializers.CharField(source='program.name', read_only=True)
    subject_title = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Book
        fields = "__all__"
        # exclude = ['embedding_vector']  



 
 
class LessonIndexSerializer(serializers.ModelSerializer):
    # ai_lesson = AIBookLessonSerializer(read_only=True)
    stage = serializers.PrimaryKeyRelatedField(queryset=Stage.objects.all())
    grade = serializers.PrimaryKeyRelatedField(queryset=Grade.objects.all())
    program = serializers.PrimaryKeyRelatedField(queryset=Program.objects.all())
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
   
    stage_title = serializers.CharField(source='stage.name', read_only=True)
    grade_title = serializers.CharField(source='grade.name', read_only=True)
    program_title = serializers.CharField(source='program.name', read_only=True)
    subject_title = serializers.CharField(source='subject.name', read_only=True)


    class Meta:
        model = LessonIndex
        fields = "__all__"