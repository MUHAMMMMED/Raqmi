from django.db import models
from categories.models import *
import uuid
 
class Book(models.Model):

    stage = models.ForeignKey(Stage,on_delete=models.SET_NULL, on_delete=models.CASCADE)
    grade = models.ForeignKey(Grade,on_delete=models.SET_NULL, on_delete=models.CASCADE)
    program = models.ForeignKey(Program,on_delete=models.SET_NULL, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject,on_delete=models.SET_NULL, on_delete=models.CASCADE)
    
    title = models.CharField(max_length=255)
    pdf = models.FileField(upload_to="books/")
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

    def __str__(self):
        return f"{self.part.title} - {self.title}"
    
 







# from openai import OpenAI

# client = OpenAI(api_key="YOUR_OPENAI_KEY")

# def generate_block_embedding(text: str) -> list:
#     """
#     يحول نص البلوك إلى embedding vector جاهز للتخزين
#     """
#     response = client.embeddings.create(
#         model="text-embedding-3-small",
#         input=text
#     )
#     return response.data[0].embedding

# def save_block_with_embedding(block: BookBlock):
#     if block.content:
#         block.embedding_vector = generate_block_embedding(block.content)
#         block.save()




# import numpy as np

# def cosine_similarity(vec1, vec2):
#     a = np.array(vec1)
#     b = np.array(vec2)
#     return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# def search_blocks(query: str, top_k: int = 5):
#     query_vec = generate_block_embedding(query)
#     blocks = BookBlock.objects.exclude(embedding_vector__isnull=True)
    
#     scored = []
#     for block in blocks:
#         score = cosine_similarity(query_vec, block.embedding_vector)
#         scored.append((score, block))
    
#     scored.sort(key=lambda x: x[0], reverse=True)
#     return [b for score, b in scored[:top_k]]



# •	هنا مثال باستخدام sentence-transformers (خيار مفتوح المصدر بدون API خارجي):

# from sentence_transformers import SentenceTransformer

# model = SentenceTransformer('all-MiniLM-L6-v2')

# def generate_embedding(text: str) -> list:
#     """يحول النص إلى vector"""
#     embedding = model.encode(text).tolist()
#     return embedding





class BookBlock(models.Model):
    """فقرة أو عنصر داخل الدرس"""
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

# def save_block_embedding(block: BookBlock):
#     if block.content:
#         block.embedding_vector = generate_embedding(block.content)
#         block.save()

    @property
    def image_url(self):
        if self.image and hasattr(self.image, 'url'):
            return self.image.url
        return None
    


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
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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








 
class AIBookLesson(models.Model):
    """
    درس AI يمثل الدرس الكامل، ويحتوي على embedding vector للبحث السريع
    """
    part = models.ForeignKey(BookPart, on_delete=models.CASCADE, related_name="ai_lessons")
    title = models.CharField(max_length=500)
    order = models.PositiveIntegerField(default=0)
    start_page = models.PositiveIntegerField()
    end_page = models.PositiveIntegerField()
    embedding_vector = models.JSONField(null=True, blank=True)  # vector للبحث

    def __str__(self):
        return f"{self.part.title} - {self.title}"


class AIBlock(models.Model):
    """
    AI Block هو ملخص للبلوكات المشابهة داخل الدرس
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lesson = models.ForeignKey(AIBookLesson, on_delete=models.CASCADE, related_name="ai_blocks")
    title = models.CharField(max_length=500)
    content = models.TextField()
    embedding_vector = models.JSONField(null=True, blank=True)
    linked_blocks = models.ManyToManyField(BookBlock, related_name="linked_ai_blocks")  # يربط بالبلوكات الأصلية
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.lesson.title} - AI Block"


class LessonIndex(models.Model):
    title = models.CharField(max_length=500)
 
    # ربط بـ AI Lesson بشكل 1-to-1
    ai_lesson = models.OneToOneField(
        AIBookLesson, 
        blank=True, 
        null=True, 
        on_delete=models.SET_NULL,
        related_name="lesson_index"
    )
    
    # الربط الكامل بالهيراركية لضمان التفرد
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE)
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    
    embedding_vector = models.JSONField(null=True, blank=True)

    class Meta:
        unique_together = ('title', 'stage', 'grade', 'program', 'subject')

    def __str__(self):
        return f"{self.title} ({self.subject.name} - {self.grade.name})"




class BookExercise(models.Model):
    """التدريبات أو الأسئلة في نهاية الدروس أو الفصول"""
    part = models.ForeignKey(BookPart, on_delete=models.CASCADE, related_name="exercises", null=True, blank=True)
    lesson = models.ForeignKey(BookLesson, on_delete=models.CASCADE, related_name="exercises", null=True, blank=True)
    block = models.ForeignKey(BookBlock, on_delete=models.CASCADE, related_name="exercises", null=True, blank=True)

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





# id
# title
# description
# 1
# فهم دورة الماء في الطبيعة
# أن يشرح الطالب كيف تتحول المياه بين الحالات الثلاث
# 2
# التمييز بين النباتات البرية والمنزلية
# أن يذكر الطالب الفروق بين البيئات
# 3
# حل المسائل الحسابية البسيطة






# 	الفقرة رقم 12 في درس “دورة الماء” تشرح عملية التبخر.
# 	•	الهدف رقم 1 هو “فهم دورة الماء في الطبيعة”.

# إذن يُضاف صف في BlockObjective:


 