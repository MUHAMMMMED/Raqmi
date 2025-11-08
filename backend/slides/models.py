from django.db import models
from lessons.models import Lesson
from medialibrary.models import MediaLibrary
 
 



class Content(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        related_name='contents',
        on_delete=models.CASCADE,
 
    )
    title = models.CharField(max_length=255, verbose_name="Content Title")
    # image = models.ForeignKey(
    #     'MediaLibrary',
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name='content_images',
    #     verbose_name="Content Image"
    # )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        verbose_name = "Content"
        verbose_name_plural = "Contents"

    def __str__(self):
        return f"{self.lesson.title} - {self.title}"
 



class Slide(models.Model):
    LAYOUT_CHOICES = [
        ('default', 'Default'),
        ('title_content', 'Title and Content'),
        ('image_left', 'Image Left'),
        ('image_right', 'Image Right'),
        ('split_screen', 'Split Screen'),
        ('full_image', 'Full Image'),
    ]
    slide_viewer = models.ImageField(upload_to="slides/", null=True, blank=True)
    # lesson = models.ForeignKey(Lesson, related_name="slides", on_delete=models.CASCADE)
    content = models.ForeignKey(
        Content,
        related_name="slides",
        on_delete=models.CASCADE,
        blank=True, null=True,
    )
    title = models.CharField(max_length=255, blank=True, null=True, verbose_name="Slide Title")
    order = models.IntegerField(default=0, verbose_name="Order")
    background_color = models.CharField(max_length=20, default="#FFFFFF", verbose_name="Background Color")
    background_image = models.ForeignKey(
        MediaLibrary,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='slide_backgrounds',
        verbose_name="Background Image"
    )
    background_opacity = models.FloatField(default=1.0, verbose_name="Background Opacity")
    layout_style = models.CharField(
        max_length=50, 
        choices=LAYOUT_CHOICES, 
        default='default',
        verbose_name="Layout Style"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")
    
    class Meta:
        verbose_name = "Slide"
        verbose_name_plural = "Slides"
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"  - {self.title or 'Slide ' + str(self.order)}"
    
    @property
    def background_image_url(self):
        if self.background_image and self.background_image.file_url:
            self.background_image.increment_usage()
            return self.background_image.file_url
        return None
    
    @property
    def blocks_count(self):
        return self.blocks.count()
    
    # def duplicate(self):
    #     new_slide = Slide.objects.create(
    #         lesson=self.lesson,
    #         title=f"{self.title} (Copy)" if self.title else None,
    #         order=self.order + 1,
    #         background_color=self.background_color,
    #         background_image=self.background_image,
    #         background_opacity=self.background_opacity,
    #         layout_style=self.layout_style
    #     )
        
        # for block in self.blocks.all():
        #     block.duplicate(new_slide)
        
        # return new_slide

 
 

class SlideBlock(models.Model):
    BLOCK_TYPES = [
        ("title", "Title"), ("text", "Text"), ("bullet_points", "Bullet Points"),
        ("image", "Image"), ("video", "Video"), ("quote", "Quote"),
        ("code", "Code"), ("divider", "Divider"), ("shape", "Shape"),
    ]

    slide = models.ForeignKey(Slide, related_name="blocks",
                              on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=BLOCK_TYPES)
    order = models.IntegerField(default=0)

    # ---------- core content ----------
    content = models.TextField(blank=True, null=True)
    media = models.ForeignKey(
        MediaLibrary, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="slide_blocks"
    )

    # ---------- voice narration ----------
    voice_script = models.TextField(blank=True, null=True,
        help_text="النص الذي سيتم تحويله إلى صوت عند عرض الشريحة.")
    speech_duration = models.FloatField(default=0)

    # ---------- layout ----------
    position_x = models.IntegerField(default=100)
    position_y = models.IntegerField(default=100)
    width = models.IntegerField(default=200)
    height = models.IntegerField(default=100)
    z_index = models.IntegerField(default=1)
    opacity = models.FloatField(default=1.0)
    background_opacity = models.FloatField(default=1.0)

    # ---------- text style ----------
    font_family = models.CharField(max_length=100, default="Arial, sans-serif")
    font_size = models.IntegerField(default=18)
    font_color = models.CharField(max_length=20, default="#000000")
    font_weight = models.CharField(max_length=20, default="normal")
    font_style = models.CharField(max_length=20, default="normal")
    text_align = models.CharField(max_length=20, default="right")
    text_decoration = models.CharField(max_length=20, default="none")

    # ---------- visual style ----------
    background_color = models.CharField(max_length=20, blank=True, null=True)
    border_radius = models.IntegerField(default=0)
    border_color = models.CharField(max_length=20, blank=True, null=True)
    border_width = models.IntegerField(default=0)

    # ---------- extra (only for truly custom data) ----------
    extra_data = models.JSONField(default=dict, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Slide Block"
        verbose_name_plural = "Slide Blocks"
        ordering = ['z_index', 'order', 'created_at']

    def __str__(self):
        return f"{self.slide.title} - {self.get_type_display()}"

    # -----------------------------------------------------------------
    # Helper properties – used only by the serializer (read-only)
    # -----------------------------------------------------------------
    @property
    def style(self):
        return {
            "fontFamily": self.font_family,
            "fontSize": f"{self.font_size}px",
            "color": self.font_color,
            "fontWeight": self.font_weight,
            "fontStyle": self.font_style,
            "textAlign": self.text_align,
            "textDecoration": self.text_decoration,
            "backgroundColor": self.background_color or "transparent",
            "borderRadius": f"{self.border_radius}px",
            "border": f"{self.border_width}px solid {self.border_color or 'transparent'}",
        }

    @property
    def position(self):
        return {"x": self.position_x, "y": self.position_y}

    @property
    def size(self):
        return {"width": self.width, "height": self.height}

 

    @property
    def media_url(self):
     if self.media and self.media.file:
        # base_url = getattr(settings, "BASE_URL", "")
        base_url = "http://127.0.0.1:8000"
        if base_url:
            return f"{base_url}{self.media.file.url}"
        return self.media.file.url
     return None


 
class HistoryLog(models.Model):
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('duplicate', 'Duplicate'),
        ('reorder', 'Reorder'),
        ('style_change', 'Style Change'),
        ('content_change', 'Content Change'),
    ]
    
    slide = models.ForeignKey(Slide, related_name="history_logs", on_delete=models.CASCADE, verbose_name="Slide")
    action = models.CharField(max_length=20, choices=ACTION_CHOICES, verbose_name="Action")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Timestamp")
    user = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="User")
    details = models.JSONField(default=dict, blank=True, verbose_name="Details")
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="IP Address")
    
    class Meta:
        verbose_name = "History Log"
        verbose_name_plural = "History Logs"
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.slide.title} - {self.timestamp}"
    
    @classmethod
    def log_action(cls, slide, action, user=None, ip_address=None, **details):
        return cls.objects.create(
            slide=slide,
            action=action,
            user=user,
            ip_address=ip_address,
            details=details
        )
    
    @property
    def action_description(self):
        descriptions = {
            'create': f"Slide '{self.slide.title}' was created",
            'update': f"Slide '{self.slide.title}' was updated",
            'delete': f"Slide '{self.slide.title}' was deleted",
            'duplicate': f"Slide '{self.slide.title}' was duplicated",
            'reorder': f"Slide '{self.slide.title}' was reordered",
            'style_change': f"Slide '{self.slide.title}' style was changed",
            'content_change': f"Slide '{self.slide.title}' content was changed",
        }
        return descriptions.get(self.action, f"Action on slide '{self.slide.title}'")
    
    def get_details_summary(self):
        if self.details:
            if self.action == 'style_change':
                return f"Changed fields: {', '.join(self.details.get('changed_fields', []))}"
            elif self.action == 'content_change':
                return f"Content changed: {self.details.get('block_type', 'element')}"
        return "No additional details"