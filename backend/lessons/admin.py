from django.contrib import admin
from .models import *

 
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course", "order", "review_status", "updated_at")
    list_filter = ("course", "review_status")
    search_fields = ("title", "summary")
    ordering = ("course", "order")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("المعلومات الأساسية", {
            "fields": ("course", "title", "summary", "order", "info")
        }),
        ("إصدار الذكاء الاصطناعي", {
            "fields": ("version", "ai_model", "prompt_version")
        }),
        ("المراجعة", {
            "fields": ("reviewed_by", "review_status", "review_notes")
        }),
        ("تواريخ الإنشاء والتعديل", {
            "fields": ("created_at", "updated_at")
        }),
    )


 
# @admin.register(LessonSource)
# class LessonSourceAdmin(admin.ModelAdmin):
#     list_display = (
#         "id",
#         "lesson",
#         "book",
#         "part",
#         "book_lesson",
#         "block",
#         "page_start",
#         "page_end",
#         "extracted_at",
#     )
#     list_filter = ("book", "part", "book_lesson")
#     search_fields = ("lesson__title", "book__title", "part__title", "book_lesson__title")
#     autocomplete_fields = ("lesson", "book", "part", "book_lesson", "block")

 
# @admin.register(LessonContentLink)
# class LessonContentLinkAdmin(admin.ModelAdmin):
#     list_display = ("id", "lesson", "block", "similarity_score", "created_at")
#     list_filter = ("lesson",)
#     search_fields = ("lesson__title", "block__title", "matched_text")
#     autocomplete_fields = ("lesson", "block")
#     readonly_fields = ("similarity_score", "matched_text", "created_at")


 
# @admin.register(LessonQuestion)
# class LessonQuestionAdmin(admin.ModelAdmin):
#     list_display = (
#         "id",
#         "lesson",
#         "question_type",
#         "difficulty",
#         "review_status",
#         "is_ai_generated",
#         "created_at",
#     )
#     list_filter = ("question_type", "review_status", "is_ai_generated")
#     search_fields = ("lesson__title", "question_text", "answer_text")
#     autocomplete_fields = ("lesson", "source", "question_image", "answer_image")
#     readonly_fields = ("created_at", "updated_at")


 
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