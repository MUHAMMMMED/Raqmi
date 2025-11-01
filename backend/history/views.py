from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import HistoryLog

@api_view(["GET"])
def get_history(request):
    lesson_id = request.GET.get("lesson")
    logs = HistoryLog.objects.filter(lesson_id=lesson_id).order_by("-timestamp")
    data = [
        {"id": log.id, "action": log.action, "timestamp": log.timestamp}
        for log in logs
    ]
    return Response(data)