from django.contrib import admin
from .models import (
    Book, BookPart, BookLesson, BookBlock,
    BookExercise,BlockLearningObjective,
    BlockReel
)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "subject", "uploaded_at")
    search_fields = ("title", "subject__name")
    list_filter = ("subject",)
    ordering = ("uploaded_at",)


@admin.register(BookPart)
class BookPartAdmin(admin.ModelAdmin):
    list_display = ("title", "book", "order", "start_page", "end_page")
    list_filter = ("book",)
    search_fields = ("title", "book__title")
    ordering = ("book", "order")


@admin.register(BookLesson)
class BookLessonAdmin(admin.ModelAdmin):
    list_display = ("title", "part", "order", "start_page", "end_page")
    list_filter = ("part",)
    search_fields = ("title", "part__title")
    ordering = ("part", "order")


@admin.register(BookBlock)
class BookBlockAdmin(admin.ModelAdmin):
    list_display = ("lesson", "order", "block_type", "page_number")
    list_filter = ("lesson", "block_type")
    search_fields = ("content",)
    ordering = ("lesson", "order")


@admin.register(BookExercise)
class BookExerciseAdmin(admin.ModelAdmin):
    list_display = ("question_text", "question_type", "lesson", "part", "order")
    list_filter = ("question_type", "lesson", "part")
    search_fields = ("question_text",)
    ordering = ("lesson", "order")


@admin.register(BlockLearningObjective)
class LearningObjectiveAdmin(admin.ModelAdmin):
    list_display = ("title",)
    search_fields = ("title", "description")

   
@admin.register(BlockReel)
class BlockReelAdmin(admin.ModelAdmin):
    list_display = ("block", "created_at")
    list_filter = ("created_at",)
    search_fields = ("block__content",)



from django.contrib import admin
from .models import AIBookLesson, AIBlock, LessonIndex

@admin.register(AIBookLesson)
class AIBookLessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'order')
    search_fields = ('title',)
    filter_horizontal = ('linked_lessons',)  # لتسهيل اختيار الدروس المرتبطة

@admin.register(AIBlock)
class AIBlockAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'created_at')
    search_fields = ('title', 'content')
    list_filter = ('lesson', 'created_at')
    filter_horizontal = ('linked_blocks',)  # لتسهيل اختيار البلوكات المرتبطة

@admin.register(LessonIndex)
class LessonIndexAdmin(admin.ModelAdmin):
    list_display = ('title', 'stage', 'grade', 'program', 'subject')
    search_fields = ('title',)
    list_filter = ('stage', 'grade', 'program', 'subject')
    raw_id_fields = ('ai_lesson',)  # لتسهيل اختيار درس AI عند وجود كمية كبيرة من الدروس