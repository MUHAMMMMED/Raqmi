from django.db import models
from django.core.validators import MinValueValidator
from medialibrary.models import MediaLibrary
from books.models import  BookBlock

# ---------- Default Functions for ReelTemplate ----------
def get_default_structure():
    return {
        "intro": [{"type": "talk", "content": "Short hook question", "meta": {}}],
        "body": [{"type": "video_clip", "content": "Visual explanation", "meta": {}}],
        "outro": [{"type": "talk", "content": "Closing question", "meta": {}}],
    }


def get_default_ai_instructions():
    return {
        "intro": "Generate one short hook question (<=10 words).",
        "body": "Explain the concept in a concise 10-15s style with one visual analogy.",
        "outro": "Write a short closing question that hooks the next reel.",
    }


# ---------- Reel Template ----------
class ReelTemplate(models.Model):
    """
    Template that defines segments and AI instructions.
    - default_structure: ordered skeleton used to create ReelSegments.
    - ai_instructions: prompts for AI per part.
    """
    name = models.CharField(max_length=255, verbose_name="Template Name")
    description = models.TextField(blank=True, verbose_name="Description")

    default_structure = models.JSONField(
        default=get_default_structure,
        verbose_name="Default Structure",
        help_text="Skeleton: lists of segment definitions for intro/body/outro"
    )

    ai_instructions = models.JSONField(
        default=get_default_ai_instructions,
        verbose_name="AI Instructions",
        help_text="Prompts used by AI to generate text per part"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    example_hook = models.TextField(blank=True, verbose_name="Example Hook")

    class Meta:
        verbose_name = "Reel Template"
        verbose_name_plural = "Reel Templates"

    def __str__(self):
        return self.name

    def get_segments_as_sequence(self):
        # Returns an ordered list from the template to generate actual segments
        seq = []
        order = 0
        struct = self.default_structure or {}
        for part in ("intro", "body", "outro"):
            items = struct.get(part) or []
            for item in items:
                seq.append({
                    "part": part,
                    "order": order,
                    "type": item.get("type"),
                    "content": item.get("content"),
                    "meta": item.get("meta", {}),
                })
                order += 1
        return seq


# ---------- Reel (instance) ----------
class Reel(models.Model):
    """
    Concrete reel linked to a Lesson.
    - build_from_template copies template structure into ReelSegment rows.
    - auto-generation flags and audio strategy present.
    """
    lesson = models.ForeignKey("lessons.Lesson", related_name="reels", on_delete=models.CASCADE)
    # block = models.ForeignKey(BookBlock, on_delete=models.CASCADE, related_name="reels", null=True, blank=True)
    template = models.ForeignKey(ReelTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255, verbose_name="Reel Title")
    description = models.TextField(blank=True, null=True)
    # audio control
    AUDIO_STRATEGY_CHOICES = [
        ("global", "Global audio track"),
        ("per_segment", "Audio per segment"),
        ("none", "No audio"),
    ]
    audio_strategy = models.CharField(max_length=20, choices=AUDIO_STRATEGY_CHOICES, default="global")
    voice_type = models.CharField(max_length=20, default="ai", verbose_name="Voice Type")
    background_music = models.ForeignKey(MediaLibrary, on_delete=models.SET_NULL, null=True, blank=True, related_name="used_as_background")
    audio_track = models.FileField(upload_to="reels/audio_tracks/", null=True, blank=True, verbose_name="Global audio file")

    ai_generated = models.BooleanField(default=False)
    ai_generated_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Reel"
        verbose_name_plural = "Reels"
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.lesson.title} - {self.title}"

    def build_from_template(self, overwrite_existing=False):
        """
        Copy template sequence into ReelSegment rows tied to this Reel.
        If overwrite_existing True then delete existing segments first.
        """
        if not self.template:
            return []
        if overwrite_existing:
            self.segments.all().delete()
        created = []
        seq = self.template.get_segments_as_sequence()
        for item in seq:
            seg = ReelSegment.objects.create(
                reel=self,
                template=self.template,
                part=item["part"],
                type=item["type"],
                content=item.get("content"),
                meta=item.get("meta", {}),
                order=item["order"],
                duration_seconds=item.get("meta", {}).get("duration_seconds", 3)
            )
            created.append(seg)
        return created


# ---------- ReelSegment ----------
class ReelSegment(models.Model):
    """
    Segment is the timeline unit inside a Reel.
    It can contain multiple ReelBlocks for slide-like composition.
    """
    PART_CHOICES = [
        ("intro", "Intro"),
        ("body", "Body"),
        ("outro", "Outro"),
    ]

    TYPE_CHOICES = [
        ("talk", "Person speaking"),
        ("text_overlay", "Text overlay"),
        ("video_clip", "Video clip"),
        ("image", "Image"),
        ("music", "Music bed"),
        ("pause", "Pause"),
        ("animation", "Animation"),
    ]

    # link to Reel and origin template (optional)
    reel = models.ForeignKey(Reel, related_name="segments", on_delete=models.CASCADE)
    template = models.ForeignKey(ReelTemplate, related_name="template_segments", on_delete=models.SET_NULL, null=True, blank=True)

    part = models.CharField(max_length=20, choices=PART_CHOICES, default="body")
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    content = models.TextField(blank=True, null=True, verbose_name="Primary content (text or pointer)")
    media = models.ForeignKey(MediaLibrary, on_delete=models.SET_NULL, null=True, blank=True, related_name="segment_media")
    meta = models.JSONField(default=dict, blank=True, verbose_name="Display meta (position, font, transition, etc.)")
    order = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    duration_seconds = models.PositiveIntegerField(default=3)
    # transition that will be applied from previous segment into this one
    TRANSITION_CHOICES = [
        ("none", "None"),
        ("fade", "Fade"),
        ("slide", "Slide"),
        ("zoom", "Zoom"),
        ("cut", "Cut"),
    ]
    transition_in = models.CharField(max_length=20, choices=TRANSITION_CHOICES, default="none", verbose_name="Transition from previous")
    # segment-level audio file (overrides or complements global)
    audio_file = models.FileField(upload_to="reels/segments/audio/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "created_at"]
        verbose_name = "Reel Segment"
        verbose_name_plural = "Reel Segments"

    def __str__(self):
        base = self.reel.title if self.reel else "Unlinked"
        return f"{base} | {self.part} | {self.type} | #{self.order}"


# ---------- ReelBlock (fine-grained piece inside segment) ----------
class ReelBlock(models.Model):
    """
    Fine-grained element inside a Segment.
    Acts like slide-blocks (title, text, bullets, image, video).
    """
    BLOCK_TYPE_CHOICES = [
        ("title", "Title"),
        ("text", "Text"),
        ("bullets", "Bullet Points"),
        ("image", "Image"),
        ("video", "Video"),
        ("quote", "Quote"),
    ]

    segment = models.ForeignKey(ReelSegment, related_name="blocks", on_delete=models.CASCADE)
    type = models.CharField(max_length=50, choices=BLOCK_TYPE_CHOICES)
    content = models.TextField(blank=True, null=True)
    image = models.ForeignKey(MediaLibrary, on_delete=models.SET_NULL, null=True, blank=True, related_name="block_images")
    video = models.ForeignKey(MediaLibrary, on_delete=models.SET_NULL, null=True, blank=True, related_name="block_videos")
    order = models.PositiveIntegerField(default=0)
    meta = models.JSONField(default=dict, blank=True, help_text="position, style, animation...")

    def __str__(self):
        return f"{self.segment} | {self.type} | #{self.order}"


# ---------- AI generation log ----------
class ReelAILog(models.Model):
    """
    Log the AI prompts and responses per reel for traceability and re-generation.
    """
    reel = models.ForeignKey(Reel, related_name="ai_logs", on_delete=models.CASCADE)
    prompt = models.TextField()
    ai_response = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Log - {self.reel.title} - {self.created_at}"