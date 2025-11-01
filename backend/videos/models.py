 
from django.db import models
from lessons.models import Lesson

class VideoTask(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default="pending")
    output = models.FileField(upload_to="videos/", null=True, blank=True)
    log = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


