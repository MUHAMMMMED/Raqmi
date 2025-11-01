from django.contrib import admin
from .models import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("name", "stage", "grade", "program", "subject")
    list_filter = ("stage", "grade", "program", "subject")
    search_fields = ("name",)