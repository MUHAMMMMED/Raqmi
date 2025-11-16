from django.contrib import admin
from .models import Lesson, Block,  BlockLearningObjective, BlockReel, PromptTemplate, Artifact


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course", "order", "review_status", "updated_at")
    list_filter = ("course", "review_status")
    search_fields = ("title", "summary")
    ordering = ("course", "order")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "lesson", "order", "created_at")
    list_filter = ("lesson",)
    search_fields = ("title", "content")
    autocomplete_fields = ("lesson", "linked_blocks", "cards")


# @admin.register(LessonBlockExercise)
# class LessonBlockExerciseAdmin(admin.ModelAdmin):
#     list_display = ("id", "block", "question_type", "order", "page_number")
#     list_filter = ("question_type",)
#     search_fields = ("question_text",)
#     autocomplete_fields = ("block",)


@admin.register(BlockLearningObjective)
class BlockLearningObjectiveAdmin(admin.ModelAdmin):
    list_display = ("id", "block", "title")
    search_fields = ("title", "description")
    autocomplete_fields = ("block",)


@admin.register(BlockReel)
class BlockReelAdmin(admin.ModelAdmin):
    list_display = ("id", "block", "tone", "hook_text", "created_at")
    list_filter = ("tone",)
    search_fields = ("hook_text", "body_summary")
    autocomplete_fields = ("block",)


@admin.register(PromptTemplate)
class PromptTemplateAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "version", "used_for", "created_at")
    list_filter = ("used_for",)
    search_fields = ("name", "content")
    readonly_fields = ("created_at",)


@admin.register(Artifact)
class ArtifactAdmin(admin.ModelAdmin):
    list_display = ("id", "lesson", "media_type", "generated_by", "generated_at")
    list_filter = ("media_type", "generated_by")
    search_fields = ("lesson__title",)
    autocomplete_fields = ("lesson",)
    readonly_fields = ("generated_at",)