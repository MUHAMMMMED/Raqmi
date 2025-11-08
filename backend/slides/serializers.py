from rest_framework import serializers
from django.core.files.base import ContentFile
import base64
import uuid
from .models import *

  
class SlideBlockSerializer(serializers.ModelSerializer):
    media = serializers.PrimaryKeyRelatedField(
        queryset=MediaLibrary.objects.all(),
        required=False,
        allow_null=True,
        write_only=True
    )
    media_library_id = serializers.IntegerField(source='media.id', read_only=True)

    style = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    zIndex = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = SlideBlock
        fields = [
            'id', 'type', 'content', 'media', 'media_library_id',
            'voice_script', 'speech_duration',
            'position_x', 'position_y', 'width', 'height',
            'z_index', 'opacity', 'background_opacity',
            'font_family', 'font_size', 'font_color',
            'font_weight', 'font_style', 'text_align', 'text_decoration',
            'background_color', 'border_radius', 'border_color', 'border_width',
            'extra_data',
            'style', 'position', 'size', 'zIndex', 'image_url'
        ]

    def get_style(self, obj):
        return obj.style

    def get_position(self, obj):
        return obj.position

    def get_size(self, obj):
        return obj.size

    def get_zIndex(self, obj):
        return obj.z_index

    def get_image_url(self, obj):
        return obj.media_url




 
 

class SlideSerializer(serializers.ModelSerializer):
    blocks = SlideBlockSerializer(many=True, read_only=True)
    background_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Slide
        fields = '__all__'

    def get_background_image_url(self, obj):
        return obj.background_image_url

    def update(self, instance, validated_data):
        slide_viewer_data = validated_data.get('slide_viewer')

        if slide_viewer_data and isinstance(slide_viewer_data, str) and slide_viewer_data.startswith('data:image'):
            format_, imgstr = slide_viewer_data.split(';base64,')
            ext = format_.split('/')[-1]
            filename = f"slide_preview_{uuid.uuid4()}.{ext}"
            data = ContentFile(base64.b64decode(imgstr), name=filename)
            validated_data['slide_viewer'] = data

        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.slide_viewer:
            data['slide_viewer'] = request.build_absolute_uri(instance.slide_viewer.url)
        return data

class ContentSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Content
        fields = '__all__'

   

class HistoryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryLog
        fields = "__all__"

 