from django.contrib import admin
from .models import MediaLibrary


@admin.register(MediaLibrary)
class MediaLibraryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "media_type",
        "file_size",
        "usage_count",
        "last_used",
        "created_at",
    )
    list_filter = ("media_type", "created_at")
    search_fields = ("name", "title", "description", "tags")
    readonly_fields = ("file_size", "mime_type", "usage_count", "last_used", "created_at", "updated_at")