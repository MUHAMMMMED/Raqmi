 
from rest_framework import serializers
from .models import *

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
        extra_kwargs = {
            'program': {'required': False}
        }

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = '__all__'
        extra_kwargs = {
            'grade': {'required': False}
        }

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'
        extra_kwargs = {
            'stage': {'required': False}
        }

class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = '__all__'