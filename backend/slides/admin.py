from django.contrib import admin
from .models import Content, Slide, SlideBlock, HistoryLog

 


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'created_at']
    list_filter = ['lesson', 'created_at']
    search_fields = ['title', 'lesson__title']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['lesson', 'title']


@admin.register(Slide)
class SlideAdmin(admin.ModelAdmin):
    list_display = ['title', 'content', 'order', 'layout_style', 'blocks_count', 'created_at']
    list_filter = ['layout_style', 'created_at', 'content']
    search_fields = ['title', 'content__title']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['content', 'order']

# @admin.register(SlideBlock)
# class SlideBlockAdmin(admin.ModelAdmin):
#     list_display = ['type', 'slide', 'order', 'z_index', 'created_at']
#     list_filter = ['type', 'created_at']
#     search_fields = ['content', 'slide__title']
#     readonly_fields = ['created_at', 'updated_at']



@admin.register(SlideBlock)
class SlideBlockAdmin(admin.ModelAdmin):
    list_display = ['type', 'slide', 'order', 'z_index', 'created_at']


@admin.register(HistoryLog)
class HistoryLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'slide', 'user', 'timestamp', 'ip_address']
    list_filter = ['action', 'timestamp']
    search_fields = ['slide__title', 'user__username']
    readonly_fields = ['timestamp']
    ordering = ['-timestamp']