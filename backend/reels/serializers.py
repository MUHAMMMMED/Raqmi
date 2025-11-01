from rest_framework import serializers
from .models import Reel, ReelTemplate, ReelSegment, ReelBlock

class ReelTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReelTemplate
        fields = ['id', 'name', 'description']

class ReelBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReelBlock
        fields = ['id', 'type', 'content', 'order', 'meta']

class ReelSegmentSerializer(serializers.ModelSerializer):
    blocks = ReelBlockSerializer(many=True, read_only=True)
    
    class Meta:
        model = ReelSegment
        fields = [
            'id', 'part', 'type', 'content', 'media', 
            'meta', 'order', 'duration_seconds', 
            'transition_in', 'audio_file', 'blocks'
        ]

class ReelSerializer(serializers.ModelSerializer):
    template = ReelTemplateSerializer(read_only=True)
    segments = ReelSegmentSerializer(many=True, read_only=True)
    background_music_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Reel
        fields = [
            'id', 'lesson', 'template', 'title', 'description',
            'audio_strategy', 'voice_type', 'background_music', 
            'background_music_info', 'audio_track',
            'ai_generated', 'ai_generated_at',
            'created_at', 'updated_at', 'segments'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_background_music_info(self, obj):
        if obj.background_music:
            return {
                'id': obj.background_music.id,
                'name': obj.background_music.name,
                'file_url': obj.background_music.file.url if obj.background_music.file else None
            }
        return None