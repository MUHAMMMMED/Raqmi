# from rest_framework import viewsets
# from .models import Slide, SlideBlock, HistoryLog
# from .serializers import SlideSerializer, SlideBlockSerializer, HistoryLogSerializer

# # class SlideViewSet(viewsets.ModelViewSet):
# #     queryset = Slide.objects.all().order_by("order")
# #     serializer_class = SlideSerializer

# #     def get_queryset(self):
# #         queryset = super().get_queryset()
# #         lesson_id = self.request.query_params.get("lesson")
# #         if lesson_id:
# #             queryset = queryset.filter(lesson_id=lesson_id)
# #         return queryset




# from rest_framework import viewsets, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from django.db import transaction

# class SlideViewSet(viewsets.ModelViewSet):
#     queryset = Slide.objects.all().order_by("order")
#     serializer_class = SlideSerializer

#     def get_queryset(self):
#         queryset = super().get_queryset()
#         lesson_id = self.request.query_params.get("lesson")
#         if lesson_id:
#             queryset = queryset.filter(lesson_id=lesson_id)
#         return queryset
    
#     def create(self, request, *args, **kwargs):
#         """إنشاء سلايد جديد مع كتله"""
#         return self._save_slide_data(request)
    
#     def update(self, request, *args, **kwargs):
#         print(request.data)
#         """تحديث سلايد موجود مع كتله"""
#         return self._save_slide_data(request, **kwargs)
    
#     @transaction.atomic
#     def _save_slide_data(self, request, **kwargs):
#         """حفظ بيانات السلايد والكتل في transaction واحدة"""
#         try:
#             slide_data = request.data.copy()
#             blocks_data = slide_data.pop('blocks', [])
            
#             # معالجة بيانات الخلفية إذا كانت من المكتبة
#             background_image_library_id = slide_data.get('background_image_library_id')
#             if background_image_library_id == 'null' or background_image_library_id == '':
#                 slide_data['background_image_library_id'] = None
            
#             # حفظ أو تحديث السلايد
#             if kwargs.get('pk'):
#                 # تحديث سلايد موجود
#                 instance = self.get_object()
#                 serializer = self.get_serializer(instance, data=slide_data, partial=False)
#             else:
#                 # إنشاء سلايد جديد
#                 serializer = self.get_serializer(data=slide_data)
            
#             serializer.is_valid(raise_exception=True)
#             slide = serializer.save()
            
#             # معالجة الكتل
#             self._handle_blocks(slide, blocks_data)
            
#             # إرجاع البيانات المحدثة
#             response_serializer = self.get_serializer(slide)
#             return Response(response_serializer.data, status=status.HTTP_200_OK)
            
#         except Exception as e:
#             return Response(
#                 {'error': str(e)}, 
#                 status=status.HTTP_400_BAD_REQUEST
#             )
    
#     def _handle_blocks(self, slide, blocks_data):
#         """معالجة كتل السلايد"""
#         existing_block_ids = set(slide.blocks.values_list('id', flat=True))
#         received_block_ids = set()
        
#         for block_data in blocks_data:
#             block_id = block_data.get('id')
            
#             # معالجة media_library_id
#             media_library_id = block_data.get('media_library_id')
#             if media_library_id == 'null' or media_library_id == '':
#                 block_data['media_library_id'] = None
            
#             # معالجة حقل extra
#             extra_data = block_data.get('extra', {})
#             if isinstance(extra_data, str):
#                 try:
#                     extra_data = json.loads(extra_data)
#                 except json.JSONDecodeError:
#                     extra_data = {}
            
#             # تحديث الكتل الموجودة أو إنشاء جديدة
#             if block_id and str(block_id).startswith('temp-'):
#                 # كتلة جديدة (ID مؤقت)
#                 block_data.pop('id', None)
#                 self._create_block(slide, block_data)
#             elif block_id and slide.blocks.filter(id=block_id).exists():
#                 # كتلة موجودة - تحديث
#                 self._update_block(block_id, block_data)
#                 received_block_ids.add(block_id)
#             else:
#                 # كتلة جديدة بدون ID
#                 self._create_block(slide, block_data)
        
#         # حذف الكتل التي لم تعد موجودة
#         blocks_to_delete = existing_block_ids - received_block_ids
#         if blocks_to_delete:
#             slide.blocks.filter(id__in=blocks_to_delete).delete()
    
#     def _create_block(self, slide, block_data):
#         """إنشاء كتلة جديدة"""
#         # استخراج بيانات extra من block_data
#         extra_fields = ['position', 'size', 'style', 'zIndex', 'opacity', 'backgroundOpacity']
#         extra_data = {}
        
#         for field in extra_fields:
#             if field in block_data:
#                 extra_data[field] = block_data.pop(field)
        
#         # تعيين بيانات extra
#         block_data['extra'] = extra_data
        
#         # إنشاء الكتلة
#         SlideBlock.objects.create(slide=slide, **block_data)
    
#     def _update_block(self, block_id, block_data):
#         """تحديث كتلة موجودة"""
#         block = SlideBlock.objects.get(id=block_id)
        
#         # استخراج بيانات extra من block_data
#         extra_fields = ['position', 'size', 'style', 'zIndex', 'opacity', 'backgroundOpacity']
#         extra_data = block.extra.copy() if block.extra else {}
        
#         for field in extra_fields:
#             if field in block_data:
#                 extra_data[field] = block_data.pop(field)
        
#         # تحديث حقول الكتلة
#         for attr, value in block_data.items():
#             if attr != 'id':  # نتجنب تحديث الـ ID
#                 setattr(block, attr, value)
        
#         # تحديث بيانات extra
#         block.extra = extra_data
#         block.save()
    
#     @action(detail=True, methods=['post'])
#     def duplicate(self, request, pk=None):
#         """نسخ السلايد"""
#         try:
#             original_slide = self.get_object()
#             new_slide = original_slide.duplicate()
            
#             serializer = self.get_serializer(new_slide)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
            
#         except Exception as e:
#             return Response(
#                 {'error': str(e)}, 
#                 status=status.HTTP_400_BAD_REQUEST
#             )
    
#     @action(detail=False, methods=['get'])
#     def previews(self, request):
#         """الحصول على معاينات السلايدات لدرس معين"""
#         lesson_id = request.query_params.get('lesson')
#         if not lesson_id:
#             return Response(
#                 {'error': 'lesson parameter is required'}, 
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         slides = Slide.objects.filter(lesson_id=lesson_id).only(
#             'id', 'title', 'order', 'slide_viewer'
#         ).order_by('order')
        
#         data = []
#         for slide in slides:
#             data.append({
#                 'id': slide.id,
#                 'title': slide.title,
#                 'order': slide.order,
#                 'preview_url': slide.slide_preview_url,
#                 'has_preview': bool(slide.slide_viewer)
#             })
        
#         return Response(data)






# class SlideBlockViewSet(viewsets.ModelViewSet):
#     queryset = SlideBlock.objects.all().order_by("order")
#     serializer_class = SlideBlockSerializer


# class HistoryLogViewSet(viewsets.ModelViewSet):
#     queryset = HistoryLog.objects.all().order_by("-timestamp")
#     serializer_class = HistoryLogSerializer


from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Sum
from django.core.paginator import Paginator
from django.db import transaction
import json
from .models import*
from .serializers import*
 
class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.all().order_by("order")
    serializer_class = SlideSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        lesson_id = self.request.query_params.get("lesson")
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        return queryset
    
    def create(self, request, *args, **kwargs):
        """إنشاء سلايد جديد مع كتله"""
        return self._save_slide_data(request)
    
    def update(self, request, *args, **kwargs):
        """تحديث سلايد موجود مع كتله"""
        return self._save_slide_data(request, **kwargs)
    
    @transaction.atomic
    def _save_slide_data(self, request, **kwargs):
        """حفظ بيانات السلايد والكتل في transaction واحدة"""
        try:
            slide_data = request.data.copy()
            blocks_data = slide_data.pop('blocks', [])
            
            # معالجة بيانات الخلفية إذا كانت من المكتبة
            background_image_library_id = slide_data.get('background_image_library_id')
            if background_image_library_id == 'null' or background_image_library_id == '':
                slide_data['background_image_library_id'] = None
            
            # حفظ أو تحديث السلايد
            if kwargs.get('pk'):
                # تحديث سلايد موجود
                instance = self.get_object()
                serializer = self.get_serializer(instance, data=slide_data, partial=False)
            else:
                # إنشاء سلايد جديد
                serializer = self.get_serializer(data=slide_data)
            
            serializer.is_valid(raise_exception=True)
            slide = serializer.save()
            
            # معالجة الكتل
            self._handle_blocks(slide, blocks_data)
            
            # إرجاع البيانات المحدثة
            response_serializer = self.get_serializer(slide)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def _handle_blocks(self, slide, blocks_data):
        """معالجة كتل السلايد"""
        existing_block_ids = set(slide.blocks.values_list('id', flat=True))
        received_block_ids = set()
        
        for block_data in blocks_data:
            block_id = block_data.get('id')
            
            # معالجة media_library_id
            media_library_id = block_data.get('media_library_id')
            if media_library_id == 'null' or media_library_id == '':
                block_data['media_library_id'] = None
            
            # معالجة حقل extra
            extra_data = block_data.get('extra', {})
            if isinstance(extra_data, str):
                try:
                    extra_data = json.loads(extra_data)
                except json.JSONDecodeError:
                    extra_data = {}
            
            # تحديث الكتل الموجودة أو إنشاء جديدة
            if block_id and str(block_id).startswith('temp-'):
                # كتلة جديدة (ID مؤقت)
                block_data.pop('id', None)
                self._create_block(slide, block_data)
            elif block_id and slide.blocks.filter(id=block_id).exists():
                # كتلة موجودة - تحديث
                self._update_block(block_id, block_data)
                received_block_ids.add(block_id)
            else:
                # كتلة جديدة بدون ID
                self._create_block(slide, block_data)
        
        # حذف الكتل التي لم تعد موجودة
        blocks_to_delete = existing_block_ids - received_block_ids
        if blocks_to_delete:
            slide.blocks.filter(id__in=blocks_to_delete).delete()
    
    def _create_block(self, slide, block_data):
        """إنشاء كتلة جديدة"""
        # استخراج بيانات extra من block_data
        extra_fields = ['position', 'size', 'style', 'zIndex', 'opacity', 'backgroundOpacity']
        extra_data = {}
        
        for field in extra_fields:
            if field in block_data:
                extra_data[field] = block_data.pop(field)
        
        # تعيين بيانات extra
        block_data['extra_data'] = extra_data
        
        # إنشاء الكتلة
        SlideBlock.objects.create(slide=slide, **block_data)
    
    def _update_block(self, block_id, block_data):
        """تحديث كتلة موجودة"""
        block = SlideBlock.objects.get(id=block_id)
        
        # استخراج بيانات extra من block_data
        extra_fields = ['position', 'size', 'style', 'zIndex', 'opacity', 'backgroundOpacity']
        extra_data = block.extra_data.copy() if block.extra_data else {}
        
        for field in extra_fields:
            if field in block_data:
                extra_data[field] = block_data.pop(field)
        
        # تحديث حقول الكتلة
        for attr, value in block_data.items():
            if attr != 'id':  # نتجنب تحديث الـ ID
                setattr(block, attr, value)
        
        # تحديث بيانات extra
        block.extra_data = extra_data
        block.save()
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """نسخ السلايد"""
        try:
            original_slide = self.get_object()
            new_slide = original_slide.duplicate()
            
            serializer = self.get_serializer(new_slide)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def previews(self, request):
        """الحصول على معاينات السلايدات لدرس معين"""
        lesson_id = request.query_params.get('lesson')
        if not lesson_id:
            return Response(
                {'error': 'lesson parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        slides = Slide.objects.filter(lesson_id=lesson_id).only(
            'id', 'title', 'order', 'slide_viewer'
        ).order_by('order')
        
        data = []
        for slide in slides:
            data.append({
                'id': slide.id,
                'title': slide.title,
                'order': slide.order,
                'preview_url': slide.slide_preview_url,
                'has_preview': bool(slide.slide_viewer)
            })
        
        return Response(data)


class SlideBlockViewSet(viewsets.ModelViewSet):
    queryset = SlideBlock.objects.all()
    serializer_class = SlideBlockSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        slide_id = self.request.query_params.get("slide")
        if slide_id:
            queryset = queryset.filter(slide_id=slide_id)
        return queryset


class HistoryLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HistoryLog.objects.all()
    serializer_class = HistoryLogSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        slide_id = self.request.query_params.get("slide")
        if slide_id:
            queryset = queryset.filter(slide_id=slide_id)
        return queryset








