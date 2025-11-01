from django.db import models
from django.core.validators import MinValueValidator 
from lessons.models import Lesson
from books.models import BookBlock



class Card(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='lesson_card', null=True, blank=True)
    block = models.ForeignKey(BookBlock, on_delete=models.CASCADE, related_name="book_block_card", null=True, blank=True)
    front_text = models.TextField(blank=True, null=True)
    front_image = models.ImageField(upload_to='Card_front_images/', blank=True, null=True)
    front_video = models.CharField(max_length=100, blank=True, null=True)
    question_text = models.TextField(blank=True, null=True)
    question_image = models.ImageField(upload_to='Card_question_images/', blank=True, null=True)
    option_a = models.CharField(max_length=255, blank=True, null=True)
    option_b = models.CharField(max_length=255, blank=True, null=True)
    option_c = models.CharField(max_length=255, blank=True, null=True)
    option_d = models.CharField(max_length=255, blank=True, null=True)
    correct_answer = models.CharField(
        max_length=1,  choices=[('A', 'Option A'), ('B', 'Option B'), ('C', 'Option C'), ('D', 'Option D')],blank=True, null=True  )
    again_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    hard_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    good_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    easy_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    class Meta:
     indexes = [
        models.Index(fields=['created_at']),
        models.Index(fields=['lesson']),
    ]

    def __str__(self):
        return self.front_text or "Unnamed Card"

