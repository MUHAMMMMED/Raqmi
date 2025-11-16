from django.db import models
from categories.models import *
 
 
class Book(models.Model):
    stage = models.ForeignKey(Stage, on_delete=models.SET_NULL, null=True, blank=True)
    grade = models.ForeignKey(Grade, on_delete=models.SET_NULL, null=True, blank=True)
    program = models.ForeignKey(Program, on_delete=models.SET_NULL, null=True, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    pdf = models.FileField(upload_to="books/",null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.subject.name if self.subject else ''} - {self.title}"


class BookPart(models.Model):
    """الوحدة أو الفصل"""
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="parts")
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    start_page = models.PositiveIntegerField(null=True, blank=True)
    end_page = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.book.title} - {self.title}"

 
class BookLesson(models.Model):
    """الدرس داخل الفصل"""
    part = models.ForeignKey(BookPart, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=500)
    order = models.PositiveIntegerField(default=0)
    start_page = models.PositiveIntegerField()
    end_page = models.PositiveIntegerField()
    embedding_vector = models.JSONField(null=True, blank=True) 
    def __str__(self):
        return f"{self.part.title} - {self.title}"
    
 

class BookBlock(models.Model):
    """فقرة أو عنصر داخل الدرس"""
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lesson = models.ForeignKey(BookLesson, on_delete=models.CASCADE, related_name="blocks")
    order = models.PositiveIntegerField(default=0)
    title = models.CharField(max_length=500)
    content = models.TextField()
    image = models.ImageField(upload_to="book_blocks/", null=True, blank=True)
    page_number = models.PositiveIntegerField(null=True, blank=True)
    block_type = models.CharField(
        max_length=50,
        choices=[
            ("text", "نص"),
            ("image", "صورة"),
            ("table", "جدول"),
            ("example", "مثال توضيحي"),
            ("note", "ملاحظة"),
        ],
        default="text",
    )
    embedding_vector = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True,null=True, blank=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.lesson.title} - Block {self.order}"

    @property
    def image_url(self):
        if self.image and hasattr(self.image, 'url'):
            return self.image.url
        return None

 
 

class BlockExercise(models.Model):
 
    part = models.ForeignKey(BookPart, on_delete=models.CASCADE, related_name="exercises", null=True, blank=True)
    lesson = models.ForeignKey(BookLesson, on_delete=models.CASCADE, related_name="exercises", null=True, blank=True)
    block = models.ForeignKey(BookBlock, on_delete=models.CASCADE, related_name="exercises", null=True, blank=True)
    question_image = models.ImageField(upload_to="block_exercises/", null=True, blank=True)
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
    def __str__(self):
        return f"سؤال {self.order} - {self.lesson or self.part}"
    


class BlockLearningObjective(models.Model):
    block = models.ForeignKey(BookBlock, on_delete=models.CASCADE, related_name="objective_block",)
    title = models.CharField(max_length=255)      
    description = models.TextField()        

  

class BlockReel(models.Model):
    """
    نموذج مبسط لعرض شكل الريل الخاص بالبلوك.
    لا ينشئ ريل فعلي بل يصف كيف سيكون عرضه.
    """

    block = models.OneToOneField(BookBlock, related_name="reel_block", on_delete=models.CASCADE)
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

  
class LessonIndex(models.Model):
    title = models.CharField(max_length=500)
    lesson = models.OneToOneField(
       "lessons.Lesson", 
        blank=True, 
        null=True, 
        on_delete=models.SET_NULL,
        related_name="course_lesson_index"
    )
    book_lesson = models.ManyToManyField(BookLesson,related_name="book_lesson_index"  )
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE)
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    embedding_vector = models.JSONField(null=True, blank=True)

    class Meta:
        unique_together = ('title', 'stage', 'grade', 'program', 'subject')

    def __str__(self):
        return f"{self.title} ({self.subject.name} - {self.grade.name})"












 