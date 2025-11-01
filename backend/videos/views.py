
# from rest_framework import viewsets
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from .models import VideoTask
# from .serializers import VideoTaskSerializer
# from .tasks import generate_video_task

# class VideoTaskViewSet(viewsets.ModelViewSet):
#     queryset = VideoTask.objects.all().order_by('-created_at')
#     serializer_class = VideoTaskSerializer

#     @action(detail=True, methods=['post'])
#     def start(self, request, pk=None):
#         task = self.get_object()
#         if task.status != 'pending':
#             return Response({'detail':'already started'}, status=400)
#         task.status = 'processing'
#         task.save()
#         generate_video_task.delay(task.id)
#         return Response({'detail':'started'})
    





from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import VideoTask
# from .tasks import generate_video_task

# @api_view(["POST"])
# def start_video_generation(request):
#     """
#     بدء عملية توليد الفيديو وإرسالها إلى Celery.
#     """
#     lesson_id = request.data.get("lesson_id")
#     task = VideoTask.objects.create(lesson_id=lesson_id, status="pending")
#     generate_video_task.delay(task.id)
#     return Response({"task_id": task.id})

@api_view(["GET"])
def check_video_status(request, task_id):
    """
    التحقق من حالة التوليد (قيد التنفيذ / مكتمل / فشل).
    """
    task = VideoTask.objects.get(id=task_id)
    return Response({
        "status": task.status,
        "video_url": task.output.url if task.output else None,
        "log": task.log
    })