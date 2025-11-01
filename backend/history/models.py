from django.db import models
from lessons.models import Lesson

class HistoryLog(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)