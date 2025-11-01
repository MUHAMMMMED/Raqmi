# backend/videos/admin.py
from django.contrib import admin
from .models import VideoTask

@admin.register(VideoTask)
class VideoTaskAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'status', 'created_at', 'output')
    list_filter = ('status', 'created_at')
    search_fields = ('lesson__title',)
    readonly_fields = ('created_at', 'log')