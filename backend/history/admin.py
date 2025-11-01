 
from django.contrib import admin
from .models import HistoryLog

@admin.register(HistoryLog)
class HistoryLogAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'action', 'timestamp')
    list_filter = ('timestamp', 'lesson')
    search_fields = ('action',)
    ordering = ('-timestamp',)