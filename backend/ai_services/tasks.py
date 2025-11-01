from celery import shared_task
from lessons.models import Lesson
from slides.models import Slide
from .text_engine import parse_lesson_into_slides
from .design_engine import generate_slide_design
from .voice_engine import generate_voice_for_text

@shared_task
def process_lesson_into_slides(lesson_id):
    """
    المهمة الرئيسية: تأخذ درس واحد وتحوله لشرائح كاملة.
    """
    lesson = Lesson.objects.get(id=lesson_id)

    # 1. تحليل النص إلى شرائح
    slides_data = parse_lesson_into_slides(lesson.content)

    for order, slide_data in enumerate(slides_data):
        slide = Slide.objects.create(
            lesson=lesson,
            title=slide_data["title"],
            body=slide_data["body"],
            order=order
        )

        # 2. توليد التصميم والصورة
        layout_data, image_path = generate_slide_design(slide_data)
        slide.layout = layout_data
        slide.image = image_path

        # 3. توليد الصوت
        voice_path = generate_voice_for_text(slide_data["body"])
        slide.voice = voice_path
        slide.save()

    return True