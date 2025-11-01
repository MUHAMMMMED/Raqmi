from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Slide, SlideBlock, HistoryLog


@receiver(post_save, sender=Slide)
def slide_post_save(sender, instance, created, **kwargs):
    """تسجيل إجراء عند حفظ السلايد"""
    action = 'create' if created else 'update'
    HistoryLog.log_action(
        slide=instance,
        action=action,
        details={
            'title': instance.title,
            'background_color': instance.background_color,
            'layout_style': instance.layout_style,
            'blocks_count': instance.blocks_count,
        }
    )


@receiver(post_save, sender=SlideBlock)
def slide_block_post_save(sender, instance, created, **kwargs):
    """تسجيل إجراء عند حفظ عنصر السلايد"""
    action = 'create' if created else 'update'
    HistoryLog.log_action(
        slide=instance.slide,
        action=action,
        details={
            'block_type': instance.type,
            'block_id': instance.id,
            'content_preview': instance.content[:100] if instance.content else None,
        }
    )


@receiver(post_delete, sender=Slide)
def slide_post_delete(sender, instance, **kwargs):
    """تسجيل إجراء عند حذف السلايد"""
    HistoryLog.log_action(
        slide=instance,
        action='delete',
        details={
            'title': instance.title,
            'blocks_count': instance.blocks_count,
        }
    )


@receiver(post_delete, sender=SlideBlock)
def slide_block_post_delete(sender, instance, **kwargs):
    """تسجيل إجراء عند حذف بلوك من السلايد"""
    HistoryLog.log_action(
        slide=instance.slide,
        action='delete',
        details={
            'block_type': instance.type,
            'block_id': instance.id,
            'content_preview': instance.content[:100] if instance.content else None,
        }
    )