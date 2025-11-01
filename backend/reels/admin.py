from django.contrib import admin
from .models import (
    ReelTemplate,
    Reel,
    ReelSegment,
    ReelBlock,
    ReelAILog,
)


@admin.register(ReelTemplate)
class ReelTemplateAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at", "updated_at")
    search_fields = ("name", "description")
    list_filter = ("created_at",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(Reel)
class ReelAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "lesson", "template", "audio_strategy", "ai_generated", "created_at")
    list_filter = ("audio_strategy", "ai_generated", "created_at")
    search_fields = ("title", "description", "lesson__title")
    readonly_fields = ("ai_generated_at", "created_at", "updated_at")


@admin.register(ReelSegment)
class ReelSegmentAdmin(admin.ModelAdmin):
    list_display = ("id", "reel", "part", "type", "order", "duration_seconds", "transition_in")
    list_filter = ("part", "type", "transition_in")
    search_fields = ("reel__title", "content")
    ordering = ("reel", "order")


@admin.register(ReelBlock)
class ReelBlockAdmin(admin.ModelAdmin):
    list_display = ("id", "segment", "type", "order")
    list_filter = ("type",)
    search_fields = ("segment__reel__title", "content")
    ordering = ("segment", "order")


@admin.register(ReelAILog)
class ReelAILogAdmin(admin.ModelAdmin):
    list_display = ("id", "reel", "created_at")
    search_fields = ("reel__title", "prompt")
    readonly_fields = ("created_at",)