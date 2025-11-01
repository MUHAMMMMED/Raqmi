 
from django.conf import settings
from django.db import models
import os
from django.utils import timezone
from PIL import Image
 


class MediaLibrary(models.Model):
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('document', 'Document'),
    ]

    name = models.CharField(max_length=255, verbose_name="Name")
    file = models.FileField(upload_to='media_library/%Y/%m/%d/', verbose_name="File")
    media_type = models.CharField(max_length=20, choices=MEDIA_TYPES, verbose_name="Media Type")
    file_size = models.BigIntegerField(default=0, verbose_name="File Size")
    mime_type = models.CharField(max_length=100, blank=True, verbose_name="MIME Type")

    title = models.CharField(max_length=255, blank=True, verbose_name="Title")
    description = models.TextField(blank=True, verbose_name="Description")
    tags = models.JSONField(default=list, blank=True, verbose_name="Tags")

    usage_count = models.IntegerField(default=0, verbose_name="Usage Count")
    last_used = models.DateTimeField(null=True, blank=True, verbose_name="Last Used")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Media Library"

    def __str__(self):
        return f"{self.name} ({self.media_type})"

    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
            self.mime_type = getattr(self.file.file, 'content_type', '')

            super().save(*args, **kwargs)

            if self.media_type == 'image':
                try:
                    img_path = self.file.path
                    if os.path.exists(img_path):
                        img = Image.open(img_path)
                        if img.height > 1200 or img.width > 1200:
                            img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                            img.save(img_path, optimize=True, quality=85)
                except Exception as e:
                    print(f"Error processing image: {e}")
        else:
            super().save(*args, **kwargs)
    @property
    def file_url(self):
        """Return full absolute URL for file."""
        if self.file and hasattr(self.file, 'url'):
            # base_url = getattr(settings, "BASE_URL", "")
            base_url = 'http://127.0.0.1:8000/media/'
            # يرجع الرابط الكامل مثل http://127.0.0.1:8000/media/....
            return f"{base_url}{self.file.url}" if base_url else self.file.url
        return None

 
    def increment_usage(self):
        self.usage_count += 1
        self.last_used = timezone.now()
        self.save()
 