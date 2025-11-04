 
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


class LessonBlockExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonBlockExercise
        fields = '__all__'






    # @property
    # def sources_summary(self):
    #     """List of books used to build the lesson."""
    #     return ", ".join(s.book.title for s in self.sources.all())





  
class BlockSerializer(serializers.ModelSerializer):
    course_block_objective = BlockLearningObjectiveSerializer(many=True, read_only=True)
    course_block_exercises = LessonBlockExerciseSerializer(many=True, read_only=True)
    course_block_reel = BlockReelSerializer(read_only=True)

    linked_blocks = serializers.SerializerMethodField()
    cards= CardSerializer(many=True, read_only=True)

    class Meta:
        model = Block
        fields = '__all__'
 
    def get_linked_blocks(self, obj):
        from books.serializers import BookBlockSerializer  # import inside method
        qs = obj.linked_blocks.all()
        return BookBlockSerializer(qs, many=True).data




class LessonSerializer(serializers.ModelSerializer):
    lesson_block = BlockSerializer(many=True, read_only=True)
    class Meta:
        model = Lesson
        fields = '__all__'

















# class LessonSourceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LessonSource
#         fields = '__all__'


# class LessonQuestionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LessonQuestion
#         fields = '__all__'


# class PromptTemplateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PromptTemplate
#         fields = '__all__'


# class ArtifactSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Artifact
#         fields = '__all__'


 
# class LessonSerializer(serializers.ModelSerializer):
#     lesson_block = BlockSerializer(read_only=True)
#     # sources = LessonSourceSerializer(many=True, read_only=True)
#     # questions = LessonQuestionSerializer(many=True, read_only=True)
#     # artifacts = ArtifactSerializer(many=True, read_only=True)

#     class Meta:
#         model = Lesson
#         fields = '__all__'