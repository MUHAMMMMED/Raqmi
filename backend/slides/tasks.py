# from celery import shared_task

# # مهمة Celery لتوليد فيديو من VideoTask
# @shared_task
# def generate_video_task(task_id):
#     # استيراد النماذج والمكتبات داخل الدالة لتجنّب مشاكل الاستيراد المتبادل
#     from .models import VideoTask
#     from slides.models import Slide
#     from gtts import gTTS                       # لتحويل النص إلى صوت
#     import moviepy.editor as mp                 # استيراد آمن لـ moviepy
#     from django.conf import settings
#     import os, tempfile

#     # تعريف العناصر الأساسية من moviepy
#     TextClip = mp.TextClip
#     concatenate_videoclips = mp.concatenate_videoclips
#     AudioFileClip = mp.AudioFileClip

#     # جلب كائن مهمة الفيديو من DB باستخدام المعرف الممرّر
#     task = VideoTask.objects.get(id=task_id)
#     try:
#         # الدرس المرتبط بالمهمة
#         lesson = task.lesson

#         # جلب جميع الشرائح المرتبطة بالدرس مرتبة حسب الحقل order
#         slides = list(lesson.slides.all().order_by('order'))

#         # إذا لم توجد شرائح، نقسم محتوى الدرس إلى فقرات وننشئ شرائح مؤقتة
#         if not slides:
#             paras = [p for p in lesson.content.split('\n') if p.strip()][:10]
#             for idx, p in enumerate(paras):
#                 Slide.objects.create(lesson=lesson, text=p, order=idx)
#             slides = list(lesson.slides.all().order_by('order'))

#         # دمج نصوص الشرائح في نص واحد لتوليد ملف صوتي موحّد
#         combined_text = "\n\n".join([s.text for s in slides])

#         # إنشاء مجلد مؤقت لتخزين الملف الصوتي
#         tmpdir = tempfile.mkdtemp()
#         audio_path = os.path.join(tmpdir, "voice.mp3")

#         # توليد الصوت بالنص المدمج وباللغة العربية وحفظه كملف mp3
#         gTTS(combined_text, lang='ar').save(audio_path)

#         # تحميل المسار الصوتي كمقطع صوتي عبر moviepy
#         audio = AudioFileClip(audio_path)

#         # تحضير قائمة مقاطع الفيديو
#         clips = []
#         for s in slides:
#             duration = max(3, min(8, len(s.text.split()) // 2))
#             txt_clip = TextClip(
#                 s.text,
#                 fontsize=40,
#                 size=(1280, 720),
#                 method='caption',
#                 align='center'
#             )
#             txt_clip = txt_clip.set_duration(duration)
#             clips.append(txt_clip)

#         # دمج كل مقاطع الشرائح في فيديو واحد
#         video = concatenate_videoclips(clips, method="compose")

#         # إذا كان الصوت أطول من الفيديو نقص من الصوت ليتطابق الطول
#         if audio.duration > video.duration:
#             audio = audio.subclip(0, video.duration)

#         # تعيين الصوت للفيديو
#         video = video.set_audio(audio)

#         # التأكد من وجود مجلد الإخراج داخل MEDIA_ROOT
#         os.makedirs(os.path.join(settings.MEDIA_ROOT, "videos"), exist_ok=True)
#         out = os.path.join(settings.MEDIA_ROOT, f"videos/lesson_{lesson.id}_{task.id}.mp4")

#         # حفظ الفيديو النهائي
#         video.write_videofile(
#             out,
#             fps=24,
#             codec='libx264',
#             audio_codec='aac',
#             verbose=False,
#             logger=None
#         )

#         # تخزين مسار الملف في كائن المهمة وتحديث الحالة
#         task.output.name = out.replace(str(settings.MEDIA_ROOT) + '/', '')
#         task.status = 'done'
#         task.save()

#     except Exception as e:
#         # في حال حدوث خطأ، نحفظ حالة الفشل وتفاصيل الخطأ
#         task.status = 'failed'
#         task.log = str(e)
#         task.save()