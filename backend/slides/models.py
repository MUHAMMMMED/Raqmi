from django.db import models
from lessons.models import Lesson
from medialibrary.models import MediaLibrary
 
 
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
    lesson = models.ForeignKey(Lesson, related_name="slides", on_delete=models.CASCADE)
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
        return f"{self.lesson.title} - {self.title or 'Slide ' + str(self.order)}"
    
    @property
    def background_image_url(self):
        if self.background_image and self.background_image.file_url:
            self.background_image.increment_usage()
            return self.background_image.file_url
        return None
    
    @property
    def blocks_count(self):
        return self.blocks.count()
    
    def duplicate(self):
        new_slide = Slide.objects.create(
            lesson=self.lesson,
            title=f"{self.title} (Copy)" if self.title else None,
            order=self.order + 1,
            background_color=self.background_color,
            background_image=self.background_image,
            background_opacity=self.background_opacity,
            layout_style=self.layout_style
        )
        
        for block in self.blocks.all():
            block.duplicate(new_slide)
        
        return new_slide


class SlideBlock(models.Model):
    BLOCK_TYPES = [
        ("title", "Title"),
        ("text", "Text"),
        ("bullet_points", "Bullet Points"),
        ("image", "Image"),
        ("video", "Video"),
        ("quote", "Quote"),
        ("code", "Code"),
        ("divider", "Divider"),
        ("shape", "Shape"),
    ]
    
    slide = models.ForeignKey(Slide, related_name="blocks", on_delete=models.CASCADE, verbose_name="Slide")
    type = models.CharField(max_length=20, choices=BLOCK_TYPES, verbose_name="Block Type")
    order = models.IntegerField(default=0, verbose_name="Order")
    content = models.TextField(blank=True, null=True, verbose_name="Content")
    

    # New field: voice narration
    voice_script = models.TextField(
        blank=True,
        null=True,
        verbose_name="Voice Script",
        help_text="النص الذي سيتم تحويله إلى صوت عند عرض الشريحة."
    )
 
    layer_index = models.IntegerField(default=0, verbose_name="Layer Index")
    speech_duration = models.FloatField(default=0, verbose_name="Speech Duration (seconds)")
    # Media from library
    media = models.ForeignKey(
        MediaLibrary,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='slide_blocks',
        verbose_name="Media"
    )
    
    # Design properties
    position_x = models.IntegerField(default=100, verbose_name="X Position")
    position_y = models.IntegerField(default=100, verbose_name="Y Position")
    width = models.IntegerField(default=200, verbose_name="Width")
    height = models.IntegerField(default=100, verbose_name="Height")
    z_index = models.IntegerField(default=1, verbose_name="Z-Index")
    opacity = models.FloatField(default=1.0, verbose_name="Opacity")
    background_opacity = models.FloatField(default=1.0, verbose_name="Background Opacity")
    
    # Text properties
    font_family = models.CharField(max_length=100, default="Arial, sans-serif", verbose_name="Font Family")
    font_size = models.IntegerField(default=18, verbose_name="Font Size")
    font_color = models.CharField(max_length=20, default="#000000", verbose_name="Font Color")
    font_weight = models.CharField(max_length=20, default="normal", verbose_name="Font Weight")
    font_style = models.CharField(max_length=20, default="normal", verbose_name="Font Style")
    text_align = models.CharField(max_length=20, default="right", verbose_name="Text Align")
    text_decoration = models.CharField(max_length=20, default="none", verbose_name="Text Decoration")
    
    # Additional properties
    background_color = models.CharField(max_length=20, blank=True, null=True, verbose_name="Background Color")
    border_radius = models.IntegerField(default=0, verbose_name="Border Radius")
    border_color = models.CharField(max_length=20, blank=True, null=True, verbose_name="Border Color")
    border_width = models.IntegerField(default=0, verbose_name="Border Width")
    
    # Extra data
    extra_data = models.JSONField(default=dict, blank=True, verbose_name="Extra Data")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        verbose_name = "Slide Block"
        verbose_name_plural = "Slide Blocks"
        ordering = ['z_index', 'order', 'created_at']
    
    def __str__(self):
        return f"{self.slide.title} - {self.get_type_display()}"
    
    @property
    def position(self):
        return {'x': self.position_x, 'y': self.position_y}
    
    @property
    def size(self):
        return {'width': self.width, 'height': self.height}
    
    @property
    def style(self):
        return {
            'fontFamily': self.font_family,
            'fontSize': f"{self.font_size}px",
            'color': self.font_color,
            'fontWeight': self.font_weight,
            'fontStyle': self.font_style,
            'textAlign': self.text_align,
            'textDecoration': self.text_decoration,
            'backgroundColor': self.background_color,
            'borderRadius': f"{self.border_radius}px",
            'borderColor': self.border_color,
            'borderWidth': f"{self.border_width}px",
        }
    
    @property
    def media_url(self):
        if self.media and self.media.file_url:
            self.media.increment_usage()
            return self.media.file_url
        return None
    
    def duplicate(self, new_slide=None):
        new_block = SlideBlock.objects.create(
            slide=new_slide or self.slide,
            type=self.type,
            order=self.order,
            content=self.content,
            media=self.media,
            position_x=self.position_x,
            position_y=self.position_y,
            width=self.width,
            height=self.height,
            z_index=self.z_index,
            opacity=self.opacity,
            background_opacity=self.background_opacity,
            font_family=self.font_family,
            font_size=self.font_size,
            font_color=self.font_color,
            font_weight=self.font_weight,
            font_style=self.font_style,
            text_align=self.text_align,
            text_decoration=self.text_decoration,
            background_color=self.background_color,
            border_radius=self.border_radius,
            border_color=self.border_color,
            border_width=self.border_width,
            extra_data=self.extra_data.copy() if self.extra_data else {}
        )
        return new_block
    
    def update_from_designer(self, designer_data):
        self.position_x = designer_data.get('position', {}).get('x', 100)
        self.position_y = designer_data.get('position', {}).get('y', 100)
        self.width = designer_data.get('size', {}).get('width', 200)
        self.height = designer_data.get('size', {}).get('height', 100)
        self.z_index = designer_data.get('zIndex', 1)
        self.opacity = designer_data.get('opacity', 1.0)
        self.background_opacity = designer_data.get('backgroundOpacity', 1.0)
        
        style_data = designer_data.get('style', {})
        if style_data:
            self.font_family = style_data.get('fontFamily', 'Arial, sans-serif')
            self.font_size = int(style_data.get('fontSize', '18').replace('px', ''))
            self.font_color = style_data.get('color', '#000000')
            self.font_weight = style_data.get('fontWeight', 'normal')
            self.font_style = style_data.get('fontStyle', 'normal')
            self.text_align = style_data.get('textAlign', 'right')
            self.text_decoration = style_data.get('textDecoration', 'none')
            self.background_color = style_data.get('backgroundColor')
            
            if 'borderRadius' in style_data:
                self.border_radius = int(style_data['borderRadius'].replace('px', ''))
            if 'borderWidth' in style_data:
                self.border_width = int(style_data['borderWidth'].replace('px', ''))
            self.border_color = style_data.get('borderColor')
        
        self.save()


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