from rest_framework import serializers
from .models import *

 
# class SlideBlockSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SlideBlock
#         fields = "__all__"


# class SlideSerializer(serializers.ModelSerializer):
#     blocks = SlideBlockSerializer(many=True, read_only=True)

#     class Meta:
#         model = Slide
#         fields = "__all__"






from rest_framework import serializers
from django.core.files.base import ContentFile
import base64
import uuid
import json

class SlideBlockSerializer(serializers.ModelSerializer):
    extra = serializers.JSONField(required=False, default=dict)
    
    class Meta:
        model = SlideBlock
        fields = "__all__"
    
    def to_internal_value(self, data):
        # معالجة حقل extra إذا كان string
        if 'extra' in data and isinstance(data['extra'], str):
            try:
                data['extra'] = json.loads(data['extra'])
            except json.JSONDecodeError:
                data['extra'] = {}
        return super().to_internal_value(data)


class SlideSerializer(serializers.ModelSerializer):
    blocks = SlideBlockSerializer(many=True, read_only=True)
    slide_preview = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = Slide
        fields = "__all__"
        read_only_fields = ('slide_viewer',)
    
    def create(self, validated_data):
        slide_preview_data = validated_data.pop('slide_preview', None)
        
        # إنشاء السلايد
        slide = Slide.objects.create(**validated_data)
        
        # معالجة معاينة السلايد إذا وجدت
        if slide_preview_data:
            self._handle_slide_preview(slide, slide_preview_data)
        
        return slide
    
    def update(self, instance, validated_data):
        slide_preview_data = validated_data.pop('slide_preview', None)
        
        # تحديث حقول السلايد
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # معالجة معاينة السلايد إذا وجدت
        if slide_preview_data:
            self._handle_slide_preview(instance, slide_preview_data)
        
        return instance
    
    def _handle_slide_preview(self, slide, slide_preview_data):
        """معالجة صورة معاينة السلايد"""
        if not slide_preview_data:
            return
        
        try:
            # فصل بيانات Base64
            if ';base64,' in slide_preview_data:
                format, imgstr = slide_preview_data.split(';base64,')
                ext = format.split('/')[-1]
            else:
                # إذا كانت البيانات بدون prefix
                imgstr = slide_preview_data
                ext = 'jpg'
            
            # إنشاء اسم ملف فريد
            filename = f"slide_preview_{uuid.uuid4()}.{ext}"
            
            # فك تشفير Base64 وإنشاء ملف
            slide_preview_file = ContentFile(
                base64.b64decode(imgstr), 
                name=filename
            )
            
            # حفظ الملف في حقل slide_viewer
            slide.slide_viewer.save(filename, slide_preview_file, save=True)
            
        except Exception as e:
            print(f"Error processing slide preview: {e}")
            # لا نرفض الحفظ إذا فشلت معالجة الصورة






class HistoryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryLog
        fields = "__all__"



class MediaLibrarySerializer(serializers.ModelSerializer):
    file_url = serializers.ReadOnlyField()
    file_size_display = serializers.SerializerMethodField()

    class Meta:
        model = MediaLibrary
        fields = [
            'id', 'name', 'file', 'file_url', 'media_type', 'file_size',
            'file_size_display', 'mime_type', 'title', 'description', 'tags',
            'usage_count', 'last_used', 'created_at', 'updated_at'
        ]

    def get_file_size_display(self, obj):
        # readable size (e.g., 1.2 MB)
        if obj.file_size < 1024:
            return f"{obj.file_size} B"
        elif obj.file_size < 1024 ** 2:
            return f"{obj.file_size / 1024:.1f} KB"
        else:
            return f"{obj.file_size / (1024 ** 2):.1f} MB"