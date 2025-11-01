from rest_framework import serializers
from .models import VideoTask

class VideoTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoTask
        fields = '__all__'
        read_only_fields = ('status','output','log','created_at')