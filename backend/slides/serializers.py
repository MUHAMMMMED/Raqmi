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

# class SlideBlockSerializer(serializers.ModelSerializer):
#     extra = serializers.JSONField(required=False, default=dict)
    
#     class Meta:
#         model = SlideBlock
#         fields = "__all__"
    
#     def to_internal_value(self, data):
#         # معالجة حقل extra إذا كان string
#         if 'extra' in data and isinstance(data['extra'], str):
#             try:
#                 data['extra'] = json.loads(data['extra'])
#             except json.JSONDecodeError:
#                 data['extra'] = {}
#         return super().to_internal_value(data)





# class SlideBlockSerializer(serializers.ModelSerializer):
#     extra = serializers.SerializerMethodField()
#     media_library_id = serializers.IntegerField(source='media_id', read_only=True)
    
#     class Meta:
#         model = SlideBlock
#         fields = '__all__'
    
#     def get_extra(self, obj):
#         # إرجاع كل البيانات من extra_data
#         return obj.extra_data
    
#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         # التأكد من وجود القيم الافتراضية
#         if 'extra' not in data or not data['extra']:
#             data['extra'] = {
#                 'position': {'x': 100, 'y': 100},
#                 'size': {'width': 200, 'height': 100},
#                 'style': {},
#                 'zIndex': 1,
#                 'opacity': 1,
#                 'backgroundOpacity': 1
#             }
#         return data
    
#     def update(self, instance, validated_data):
#         # معالجة بيانات الـ extra
#         extra_data = self.context['request'].data.get('extra')
#         if extra_data:
#             if isinstance(extra_data, str):
#                 try:
#                     extra_data = json.loads(extra_data)
#                 except json.JSONDecodeError:
#                     extra_data = {}
            
#             instance.extra_data = extra_data
        
#         return super().update(instance, validated_data)

 
 
# class SlideBlockSerializer(serializers.ModelSerializer):
#     media = serializers.PrimaryKeyRelatedField(
#         queryset=MediaLibrary.objects.all(),
#         required=False,
#         allow_null=True,
#         write_only=True  # Accept {"id": 5} on write, but don't return dict
#     )
#     media_library_id = serializers.IntegerField(source='media.id', read_only=True)

#     style = serializers.SerializerMethodField()
#     position = serializers.SerializerMethodField()
#     size = serializers.SerializerMethodField()
#     zIndex = serializers.SerializerMethodField()
#     image_url = serializers.SerializerMethodField()
#     class Meta:
#         model = SlideBlock
#         fields = [
#             'id', 'type', 'content', 'media', 'media_library_id',
#             'voice_script', 'speech_duration',
#             'position_x', 'position_y', 'width', 'height',
#             'z_index', 'opacity', 'background_opacity',
#             'font_family', 'font_size', 'font_color',
#             'font_weight', 'font_style', 'text_align', 'text_decoration',
#             'background_color', 'border_radius', 'border_color', 'border_width',
#             'extra_data',
#             'style', 'position', 'size', 'zIndex', 'image_url'
#         ]

#     def get_style(self, obj):    return obj.style
#     def get_position(self, obj): return obj.position
#     def get_size(self, obj):     return obj.size
#     def get_zIndex(self, obj):   return obj.z_index
#     @property
#     def media_url(self):
#      return self.media.file.url if self.media and self.media.file else None







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








# class SlideSerializer(serializers.ModelSerializer):
#     blocks = SlideBlockSerializer(many=True, read_only=True)
#     background_image_url = serializers.SerializerMethodField()

#     class Meta:
#         model = Slide
#         fields = '__all__'

#     def get_background_image_url(self, obj):
#         return obj.background_image_url



# # serializers.py
# import base64
# from django.core.files.base import ContentFile
# from rest_framework import serializers

# class SlideSerializer(serializers.ModelSerializer):
#     blocks = SlideBlockSerializer(many=True, read_only=True)
#     background_image_url = serializers.SerializerMethodField()

#     class Meta:
#         model = Slide
#         fields = '__all__'

#     def get_background_image_url(self, obj):
#         return obj.background_image_url

#     def update(self, instance, validated_data):
#         # معالجة slide_viewer إذا كان base64
#         slide_viewer_data = validated_data.pop('slide_viewer', None)
        
#         if slide_viewer_data and isinstance(slide_viewer_data, str) and slide_viewer_data.startswith('data:image'):
#             # استخراج base64 من البيانات
#             format, imgstr = slide_viewer_data.split(';base64,')
#             ext = format.split('/')[-1]
            
#             # إنشاء اسم ملف فريد
#             import uuid
#             filename = f"slide_preview_{uuid.uuid4()}.{ext}"
            
#             # تحويل base64 إلى ملف
#             data = ContentFile(base64.b64decode(imgstr), name=filename)
#             validated_data['slide_viewer'] = data
        
#         return super().update(instance, validated_data)






import base64
import uuid
from django.core.files.base import ContentFile
from rest_framework import serializers


# class SlideSerializer(serializers.ModelSerializer):
#     blocks = SlideBlockSerializer(many=True, read_only=True)
#     background_image_url = serializers.SerializerMethodField()

#     class Meta:
#         model = Slide
#         fields = '__all__'

#     def get_background_image_url(self, obj):
#         return obj.background_image_url

#     def update(self, instance, validated_data):
#         slide_viewer_data = validated_data.get('slide_viewer')

#         if slide_viewer_data and isinstance(slide_viewer_data, str) and slide_viewer_data.startswith('data:image'):
#             format_, imgstr = slide_viewer_data.split(';base64,')
#             ext = format_.split('/')[-1]
#             filename = f"slide_preview_{uuid.uuid4()}.{ext}"
#             data = ContentFile(base64.b64decode(imgstr), name=filename)
#             validated_data['slide_viewer'] = data

#         return super().update(instance, validated_data)

#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         request = self.context.get('request')
#         if instance.slide_viewer:
#             data['slide_viewer'] = request.build_absolute_uri(instance.slide_viewer.url)
#         return data








import base64
import uuid
from django.core.files.base import ContentFile
from rest_framework import serializers

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

  


    #     read_only_fields = ('slide_viewer',)
    #     extra_kwargs = {
    #         'opacity': {'required': False, 'default': 1.0},
    #         'background_opacity': {'required': False, 'default': 1.0},
    #         'z_index': {'required': False, 'default': 1},
    #         # ... باقي الحقول ...
    #     }



    # def create(self, validated_data):
    #     slide_preview_data = validated_data.pop('slide_preview', None)
        
    #     # إنشاء السلايد
    #     slide = Slide.objects.create(**validated_data)
        
    #     # معالجة معاينة السلايد إذا وجدت
    #     if slide_preview_data:
    #         self._handle_slide_preview(slide, slide_preview_data)
        
    #     return slide
    
    # def update(self, instance, validated_data):
    #     slide_preview_data = validated_data.pop('slide_preview', None)
        
    #     # تحديث حقول السلايد
    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)
    #     instance.save()
        
    #     # معالجة معاينة السلايد إذا وجدت
    #     if slide_preview_data:
    #         self._handle_slide_preview(instance, slide_preview_data)
        
    #     return instance
    
    # def _handle_slide_preview(self, slide, slide_preview_data):
    #     """معالجة صورة معاينة السلايد"""
    #     if not slide_preview_data:
    #         return
        
    #     try:
    #         # فصل بيانات Base64
    #         if ';base64,' in slide_preview_data:
    #             format, imgstr = slide_preview_data.split(';base64,')
    #             ext = format.split('/')[-1]
    #         else:
    #             # إذا كانت البيانات بدون prefix
    #             imgstr = slide_preview_data
    #             ext = 'jpg'
            
    #         # إنشاء اسم ملف فريد
    #         filename = f"slide_preview_{uuid.uuid4()}.{ext}"
            
    #         # فك تشفير Base64 وإنشاء ملف
    #         slide_preview_file = ContentFile(
    #             base64.b64decode(imgstr), 
    #             name=filename
    #         )
            
    #         # حفظ الملف في حقل slide_viewer
    #         slide.slide_viewer.save(filename, slide_preview_file, save=True)
            
    #     except Exception as e:
    #         print(f"Error processing slide preview: {e}")
    #         # لا نرفض الحفظ إذا فشلت معالجة الصورة






class HistoryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryLog
        fields = "__all__"



# class MediaLibrarySerializer(serializers.ModelSerializer):
#     file_url = serializers.ReadOnlyField()
#     file_size_display = serializers.SerializerMethodField()

#     class Meta:
#         model = MediaLibrary
#         fields = [
#             'id', 'name', 'file', 'file_url', 'media_type', 'file_size',
#             'file_size_display', 'mime_type', 'title', 'description', 'tags',
#             'usage_count', 'last_used', 'created_at', 'updated_at'
#         ]

#     def get_file_size_display(self, obj):
#         # readable size (e.g., 1.2 MB)
#         if obj.file_size < 1024:
#             return f"{obj.file_size} B"
#         elif obj.file_size < 1024 ** 2:
#             return f"{obj.file_size / 1024:.1f} KB"
#         else:
#             return f"{obj.file_size / (1024 ** 2):.1f} MB"