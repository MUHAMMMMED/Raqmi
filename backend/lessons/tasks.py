# from celery import shared_task
# import fitz
# from .models import Lesson
# from books.models import Book
# from videos.models import VideoTask

# @shared_task
# def extract_lessons_from_book(book_id):
#     book = Book.objects.get(id=book_id)
#     doc = fitz.open(book.pdf.path)
#     for i, page in enumerate(doc):
#         text = page.get_text("text").strip()
#         if not text:
#             continue
#         title = f"الصفحة {i+1}"
#         lesson = Lesson.objects.create(book=book, title=title, content=text, order=i)
#         VideoTask.objects.create(lesson=lesson, status='pending')
#     return True