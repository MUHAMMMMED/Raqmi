# # دالة Celery تعمل كمهام خلفية لمعالجة كتاب بعد رفعه
# # تستخدم لتقسيم ملف PDF إلى دروس (Lesson) وإنشاء مهمة فيديو لكل درس (VideoTask)
# @shared_task
# def extract_lessons_from_book(book_id):
#     # استيراد النماذج داخل الدالة لتجنّب مشاكل الاستيراد المتبادل عند تشغيل Celery
#     from .models import Book
#     from lessons.models import Lesson
#     from videos.models import VideoTask
#     import fitz  # PyMuPDF: مكتبة لقراءة محتوى صفحات PDF

#     # جلب كائن الكتاب من قاعدة البيانات بناءً على المعرّف الممرّر
#     book = Book.objects.get(id=book_id)

#     # فتح ملف الـ PDF الموجود في الحقل book.pdf.path باستخدام PyMuPDF
#     doc = fitz.open(book.pdf.path)

#     # تكرار على كل صفحة في المستند
#     for i, page in enumerate(doc):
#         # استخراج النص من الصفحة بصيغة نصّية عادية وإزالة المسافات الزائدة من الطرفين
#         text = page.get_text("text").strip()

#         # إذا كانت الصفحة لا تحتوي على نص (فارغة) نتخطاها
#         if not text:
#             continue

#         # إنشاء كائن Lesson جديد في قاعدة البيانات.
#         # عنوان الدرس نضعه مؤقتًا كـ "الصفحة N" حيث N هو رقم الصفحة.
#         # المحتوى هو النص المستخرج من الصفحة، و order لتحديد ترتيب الدروس.
#         lesson = Lesson.objects.create(
#             book=book,
#             title=f"الصفحة {i+1}",
#             content=text,
#             order=i
#         )

#         # بعد إنشاء الدرس ننشئ مهمة فيديو (VideoTask) حالة افتراضية 'pending'
#         # ليتم لاحقًا معالجتها بواسطة عامل Celery آخر الذي يولّد الفيديو من الشرائح.
#         VideoTask.objects.create(lesson=lesson, status='pending')

#     # تُعيد True عند الانتهاء بنجاح (يمكن استخدام القيمة للتوافق أو للتسجيل)
#     return True