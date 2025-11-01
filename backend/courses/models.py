from django.db import models
from categories.models import Stage, Grade, Program, Subject

class Course(models.Model):
    name = models.CharField(max_length=100)
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE, related_name="courses")
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name="courses")
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="courses")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="courses")
    # Visual identity
    primary_color = models.CharField(max_length=20, default="#1E90FF")
    secondary_color = models.CharField(max_length=20, default="#FFD700")
    background_color = models.CharField(max_length=20, default="#FFFFFF")
    main_font = models.CharField(max_length=50, default="Cairo")
    desc_font = models.CharField(max_length=50, default="Tajawal")

    # Design parameters
    border_radius = models.IntegerField(default=16)
    padding = models.IntegerField(default=12)

    # Versioning for re-uploaded books
    version = models.IntegerField(default=1)
    checksum = models.CharField(max_length=128, blank=True, null=True)
    license_info = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        verbose_name = "الكورس"
        verbose_name_plural = "الكورسات"
        unique_together = ("stage", "grade", "program", "subject", "name")
        ordering = ['stage__name', 'grade__name', 'program__name', 'subject__name', 'name']

    def __str__(self):
        return f"{self.name} - {self.subject.name}"