# from celery import shared_task
# from .models import VideoTask
# from slides.models import Slide
# from gtts import gTTS
# from moviepy.video.VideoClip import TextClip
# from moviepy.editor import concatenate_videoclips, AudioFileClip
# from django.conf import settings
# import os
# import tempfile

# @shared_task
# def generate_video_task(task_id):
#     """
#     توليد فيديو كامل من الشرائح الخاصة بالدرس.
#     """
#     task = VideoTask.objects.get(id=task_id)
#     try:
#         lesson = task.lesson
#         slides = lesson.slides.all().order_by("order")

#         # إذا لم توجد شرائح، نقسم النص إلى فقرات وننشئ شرائح مؤقتة
#         if not slides:
#             paras = [p for p in lesson.content.split("\n") if p.strip()][:10]
#             for idx, p in enumerate(paras):
#                 Slide.objects.create(lesson=lesson, text=p, order=idx)
#             slides = lesson.slides.all().order_by("order")

#         # توليد الصوت لجميع الشرائح
#         combined_text = "\n\n".join([s.text for s in slides])
#         tmpdir = tempfile.mkdtemp()
#         audio_path = os.path.join(tmpdir, "voice.mp3")
#         gTTS(combined_text, lang="ar").save(audio_path)
#         audio = AudioFileClip(audio_path)

#         # إنشاء مقاطع الفيديو من كل شريحة
#         clips = []
#         for s in slides:
#             duration = max(4, min(10, len(s.text.split()) // 2))
#             txt_clip = TextClip(
#                 s.text,
#                 fontsize=42,
#                 color=getattr(s, "color", "white"),
#                 font=getattr(s, "font", "Arial"),
#                 size=(1280, 720),
#                 method="caption",
#                 align="center"
#             ).set_duration(duration)
#             clips.append(txt_clip)

#         # دمج كل المقاطع في فيديو واحد
#         video = concatenate_videoclips(clips, method="compose")
#         if audio.duration > video.duration:
#             audio = audio.subclip(0, video.duration)
#         video = video.set_audio(audio)

#         # حفظ الفيديو النهائي
#         os.makedirs(os.path.join(settings.MEDIA_ROOT, "videos"), exist_ok=True)
#         out_path = os.path.join(settings.MEDIA_ROOT, f"videos/lesson_{lesson.id}_{task.id}.mp4")
#         video.write_videofile(
#             out_path,
#             fps=24,
#             codec="libx264",
#             audio_codec="aac",
#             verbose=False,
#             logger=None
#         )

#         # تحديث المهمة
#         task.output.name = out_path.replace(str(settings.MEDIA_ROOT) + "/", "")
#         task.status = "done"
#         task.save()

#     except Exception as e:
#         task.status = "failed"
#         task.log = str(e)
#         task.save()