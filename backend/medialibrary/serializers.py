from rest_framework import serializers
from .models import MediaLibrary


class MediaLibrarySerializer(serializers.ModelSerializer):
    file_url = serializers.ReadOnlyField()
    file_size_display = serializers.SerializerMethodField()

    class Meta:
        model = MediaLibrary
        fields = [
            'id', 'name', 'file_url', 'media_type', 'file_size',
            'file_size_display', 'mime_type', 'title', 'description', 'tags',
            'usage_count', 'last_used', 'created_at', 'updated_at'
        ]

    def get_file_size_display(self, obj):
        if obj.file_size < 1024:
            return f"{obj.file_size} B"
        elif obj.file_size < 1024 ** 2:
            return f"{obj.file_size / 1024:.1f} KB"
        else:
            return f"{obj.file_size / (1024 ** 2):.1f} MB"