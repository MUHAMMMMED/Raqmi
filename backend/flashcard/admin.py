from django.contrib import admin
from .models import Card
@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = (
        "front_text",
        "correct_answer",
        "again_count",
        "hard_count",
        "good_count",
        "easy_count",
        "created_at",
    )
    list_filter = ("correct_answer",)  
    search_fields = ("front_text", "question_text")