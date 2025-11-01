from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Lesson

@receiver(pre_save, sender=Lesson)
def handle_versioning(sender, instance, **kwargs):
    if instance.pk:
        old = Lesson.objects.get(pk=instance.pk)
        if instance.summary != old.summary or instance.info != old.info:
            instance.version += 1