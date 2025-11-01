from django.db.models.signals import post_save,post_delete
from django.dispatch import receiver
from books.models import Book

@receiver(post_save, sender=Book)
def book_created(sender, instance, created, **kwargs):
    if created:
        print(f"تم إنشاء كتاب جديد: {instance.title}")


 
@receiver(post_delete, sender=Book)
def book_deleted(sender, instance, **kwargs):
    print(f"تم حذف الكتاب: {instance.title}")





# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import BookBlock
# from .utils.embeddings_utils import generate_embedding

# @receiver(post_save, sender=BookBlock)
# def save_block_embedding(sender, instance, created, **kwargs):
#     """
#     يحسب embedding لكل BookBlock عند الإنشاء أو التعديل
#     """
#     if instance.content:
#         text = f"{instance.title}. {instance.content}"
#         instance.embedding_vector = generate_embedding(text)
#         instance.save()


# # lesson.embedding_vector = generate_embedding(lesson.title + " " + lesson.content)
# # lesson.save()

# # block.embedding_vector = generate_embedding(block.title + " " + block.content)
# # block.save()


from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import BookBlock
from .utils.embeddings_utils import generate_embedding

@receiver(post_save, sender=BookBlock)
def save_block_embedding(sender, instance, created, **kwargs):
    if getattr(instance, '_embedding_saved', False):
        return  # خرج إذا كان تم حفظ embedding مسبقًا

    if instance.content:
        text = f"{instance.title}. {instance.content}"
        instance.embedding_vector = generate_embedding(text)

        # علم الـ instance أنه تم الحفظ لتجنب recursion
        instance._embedding_saved = True

        # استخدم update_fields لتحديث الحقل فقط وتجنب loop إضافي
        instance.save(update_fields=['embedding_vector'])