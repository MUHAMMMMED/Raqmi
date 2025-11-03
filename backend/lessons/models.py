from django.db import models
from books.models import  BookBlock
from django.db import models
from medialibrary.models import MediaLibrary  
from courses.models import Course 
from flashcard.models import Card 
  
 
 
class Lesson(models.Model):
    """AI-generated or curated lesson combining multiple sources."""
    course = models.ForeignKey(Course, related_name="lesson", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    summary = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    info = models.JSONField(default=dict, blank=True, null=True)
    reels_count = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Versioning
    version = models.IntegerField(default=1)
    ai_model = models.CharField(max_length=100, blank=True, null=True)
    prompt_version = models.CharField(max_length=50, blank=True, null=True)

    # Review workflow
    reviewed_by = models.CharField(max_length=255, blank=True, null=True)
    review_status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected")],
        default="pending"
    )
    review_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

    # @property
    # def sources_summary(self):
    #     """List of books used to build the lesson."""
    #     return ", ".join(s.book.title for s in self.sources.all())







class Block(models.Model):

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="lesson_block")
    title = models.CharField(max_length=500)
    content = models.TextField()
    embedding_vector = models.JSONField(null=True, blank=True)
    linked_blocks = models.ManyToManyField(BookBlock, related_name="course_linked_blocks")  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cards = models.ManyToManyField(Card,related_name="cards_lesson"  )
    order = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.title} -  Block"
 



class LessonBlockExercise(models.Model):
    """التدريبات أو الأسئلة في نهاية الدروس أو الفصول"""

    block = models.ForeignKey(Block, on_delete=models.CASCADE, related_name="ai_block_exercises", null=True, blank=True)
    question_text = models.TextField()
    question_type = models.CharField(
        max_length=50,
        choices=[
            ("mcq", "اختيار من متعدد"),
            ("true_false", "صح أو خطأ"),
            ("short_answer", "إجابة قصيرة"),
            ("essay", "مقال"),
        ],
        default="mcq",
    )
    options = models.JSONField(null=True, blank=True)  # {"A": "نص", "B": "نص", ...}
    correct_answer = models.CharField(max_length=255, null=True, blank=True)
    explanation = models.TextField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    page_number = models.PositiveIntegerField(null=True, blank=True)
    # def __str__(self):
    #     return f"سؤال {self.order} - {self.lesson or self.part}"
    


class BlockLearningObjective(models.Model):
    block = models.ForeignKey(Block, on_delete=models.CASCADE, related_name="ai_block_objective",)
    title = models.CharField(max_length=255)      
    description = models.TextField()        


class BlockReel(models.Model):
    """
    نموذج مبسط لعرض شكل الريل الخاص بالبلوك.
    لا ينشئ ريل فعلي بل يصف كيف سيكون عرضه.
    """

    block = models.OneToOneField(Block, related_name="ai_block_reel", on_delete=models.CASCADE)
    hook_text = models.CharField(
        max_length=255,
        verbose_name="نص الجذب (Hook)",
        help_text="جملة البداية التي تجذب الانتباه"
    )

    body_summary = models.TextField(
        verbose_name="ملخص الفكرة الرئيسية",
        help_text="ما الذي يشرحه الريل في القسم الرئيسي؟"
    )

    outro_question = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="سؤال ختامي",
        help_text="جملة بسيطة تشجع المشاهد على التفكير أو المتابعة"
    )

    tone = models.CharField(
        max_length=50,
        choices=[
            ("informative", "معلوماتي"),
            ("enthusiastic", "متحمس"),
            ("curious", "فضولي"),
            ("motivational", "تحفيزي"),
        ],        )     

    visual_hint = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="اقتراح بصري",
        help_text="مثلاً: صور متحركة، أمثلة، أو عرض نصي بسيط"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    question_text = models.CharField(max_length=255, blank=True, null=True)
    question_image = models.ImageField(upload_to="real_images/", blank=True, null=True)
    option1 = models.CharField(max_length=255, blank=True, null=True)
    option2 = models.CharField(max_length=255, blank=True, null=True)
    option3 = models.CharField(max_length=255, blank=True, null=True)
    option4 = models.CharField(max_length=255, blank=True, null=True)
 
    CORRECT_CHOICES = [(1, "A"),(2, "B"),(3, "C"),(4, "D"),  ]
    correct_option = models.PositiveSmallIntegerField(choices=CORRECT_CHOICES)

    class Meta:
        verbose_name = "شكل الريل الخاص بالبلوك"
        verbose_name_plural = "أشكال الريلز الخاصة بالبلوكات"

    def __str__(self):
        return f"Reel Preview for {self.block.title}"








# -----------------------------
# LESSON SOURCES (MAPPING)
# -----------------------------
 
 
# class LessonSource(models.Model):
#     """Links lessons to their originating books or specific book elements."""
#     lesson = models.ForeignKey(Lesson, related_name="sources", on_delete=models.CASCADE)
#     book = models.ForeignKey(Book, on_delete=models.CASCADE)
#     part = models.ForeignKey(BookPart, null=True, blank=True, on_delete=models.SET_NULL)
#     book_lesson = models.ForeignKey(BookLesson, null=True, blank=True, on_delete=models.SET_NULL)
#     block = models.ForeignKey(BookBlock, null=True, blank=True, on_delete=models.SET_NULL)

#     page_start = models.IntegerField(null=True, blank=True)
#     page_end = models.IntegerField(null=True, blank=True)
#     summary_notes = models.TextField(blank=True)

#     checksum = models.CharField(max_length=128, blank=True, null=True)
#     extracted_text = models.TextField(blank=True, null=True)
#     license_info = models.TextField(blank=True, null=True)
#     extracted_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         target = self.block or self.book_lesson or self.part or self.book
#         return f"{self.lesson.title} ← {target}"

# -----------------------------
# Lesson Content Link
# -----------------------------
 
# class LessonContentLink(models.Model):
#     lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="content_links")
#     block = models.ForeignKey(BookBlock, on_delete=models.CASCADE)
#     similarity_score = models.FloatField(default=0.0)
#     matched_text = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

# -----------------------------
# QUESTIONS (TEXT / IMAGE / AI)
# -----------------------------
# class LessonQuestion(models.Model):
#     """Question generated manually or by AI."""
#     QUESTION_TYPES = [
#         ("text", "Text Only"),
#         ("image", "Image Based"),
#         ("mixed", "Text + Image"),
#     ]

#     lesson = models.ForeignKey(Lesson, related_name="questions", on_delete=models.CASCADE)
#     question_type = models.CharField(max_length=10, choices=QUESTION_TYPES, default="text")

#     # Question content
#     question_text = models.TextField(blank=True, null=True)
#     question_image = models.ForeignKey(
#         MediaLibrary,
#         null=True,
#         blank=True,
#         on_delete=models.SET_NULL,
#         related_name="question_images"
#     )

#     # Answer content
#     answer_text = models.TextField(blank=True, null=True)
#     answer_image = models.ForeignKey(
#         MediaLibrary,
#         null=True,
#         blank=True,
#         on_delete=models.SET_NULL,
#         related_name="answer_images"
#     )

#     # Extra metadata
#     difficulty = models.CharField(max_length=20, blank=True, null=True)
#     topic = models.CharField(max_length=100, blank=True, null=True)
#     metadata = models.JSONField(default=dict, blank=True)

#     # Provenance + AI info
#     source = models.ForeignKey(LessonSource, null=True, blank=True, on_delete=models.SET_NULL)
#     ai_model = models.CharField(max_length=100, blank=True, null=True)
#     ai_confidence = models.FloatField(default=0.0)
#     is_ai_generated = models.BooleanField(default=False)

#     # Review system
#     review_status = models.CharField(
#         max_length=20,
#         choices=[("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected")],
#         default="pending"
#     )
#     review_notes = models.TextField(blank=True, null=True)

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ["created_at"]

#     def __str__(self):
#         return f"Question for {self.lesson.title}"

#     @property
#     def question_media_url(self):
#         if self.question_image:
#             return self.question_image.file_url
#         return None


# -----------------------------
# PROMPT & VERSION MANAGEMENT
# -----------------------------
class PromptTemplate(models.Model):
    """Store reusable AI prompt templates for transparency and reproducibility."""
    name = models.CharField(max_length=255)
    version = models.CharField(max_length=20)
    content = models.TextField()
    used_for = models.CharField(max_length=50, help_text="e.g. lesson_summary, question_generation")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} v{self.version}"


# -----------------------------
# ARTIFACTS (FILES GENERATED)
# -----------------------------
class Artifact(models.Model):
    """Any file produced by the AI system (audio, video, image, reel, etc.)."""
    lesson = models.ForeignKey(Lesson, related_name="artifacts", on_delete=models.CASCADE)
    media_type = models.CharField(max_length=50)  # e.g. "video", "audio", "image"
    file = models.FileField(upload_to="artifacts/")
    checksum = models.CharField(max_length=128, blank=True, null=True)
    render_params = models.JSONField(default=dict, blank=True)
    generated_by = models.CharField(max_length=100, blank=True, null=True)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lesson.title} [{self.media_type}]"