from django.contrib import admin
from .models import Stage, Grade, Program, Subject

@admin.register(Stage)
class StageAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "stage")
    list_filter = ("stage",)
    search_fields = ("name",)


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "grade")
    list_filter = ("grade",)
    search_fields = ("name",)


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "program")
    list_filter = ("program",)
    search_fields = ("name",)