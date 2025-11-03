 
from rest_framework import serializers
from .models import *


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


class LessonSerializer(serializers.ModelSerializer):
    # sources = LessonSourceSerializer(many=True, read_only=True)
    # questions = LessonQuestionSerializer(many=True, read_only=True)
    # artifacts = ArtifactSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = '__all__'