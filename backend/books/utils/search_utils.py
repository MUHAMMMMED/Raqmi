import numpy as np
from .models import BookBlock
from .embeddings_utils import generate_embedding

def cosine_similarity(vec1, vec2):
    a = np.array(vec1)
    b = np.array(vec2)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def search_similar_blocks(query: str, top_k: int = 5):
    """
    البحث عن أقرب Blocks للمحتوى query
    """
    query_vec = generate_embedding(query)
    blocks = BookBlock.objects.exclude(embedding_vector__isnull=True)
    
    scored = []
    for block in blocks:
        score = cosine_similarity(query_vec, block.embedding_vector)
        scored.append((score, block))
    
    scored.sort(key=lambda x: x[0], reverse=True)
    return [b for score, b in scored[:top_k]]



# from book_blocks.search_utils import search_similar_blocks

# results = search_similar_blocks("كيف يتحول الماء إلى بخار؟", top_k=3)
# for b in results:
#     print(b.title, b.content[:100])












# import numpy as np
# from .models import BookBlock
# from .embeddings_utils import generate_embedding

# def cosine_similarity(vec1, vec2):
#     a = np.array(vec1)
#     b = np.array(vec2)
#     return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# def search_similar_blocks(query: str, top_k: int = 5):
#     """
#     البحث عن أقرب Blocks للمحتوى query باستخدام embeddings محلية
#     """
#     query_vec = generate_embedding(query)  # توليد embedding للنص
#     blocks = BookBlock.objects.exclude(embedding_vector__isnull=True)
    
#     scored = []
#     for block in blocks:
#         score = cosine_similarity(query_vec, block.embedding_vector)
#         scored.append((score, block))
    
#     # ترتيب حسب التشابه الأعلى
#     scored.sort(key=lambda x: x[0], reverse=True)
    
#     # نرجع أفضل top_k بلوك
#     return [b for score, b in scored[:top_k]]




# import numpy as np
# from .models import BookBlock
# from .embeddings_utils import generate_embedding

# def cosine_similarity(vec1, vec2):
#     a = np.array(vec1)
#     b = np.array(vec2)
#     return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# def search_similar_blocks_by_title(title: str, top_k: int = 5):
#     """
#     البحث عن أقرب BookBlocks للعنوان المعطى
#     """
#     query_vec = generate_embedding(title)
#     blocks = BookBlock.objects.exclude(embedding_vector__isnull=True)
    
#     scored = []
#     for block in blocks:
#         score = cosine_similarity(query_vec, block.embedding_vector)
#         scored.append((score, block))
    
#     scored.sort(key=lambda x: x[0], reverse=True)
#     return [b for score, b in scored[:top_k]]


# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from .models import BookBlock
# from .serializers import BookBlockSerializer
# from .search_utils import search_similar_blocks_by_title

# class BookBlockSearchViewSet(viewsets.ViewSet):
#     """
#     ViewSet للبحث عن بلوكات مشابهة بالـ title
#     """
    
#     @action(detail=False, methods=["get"])
#     def search(self, request):
#         title = request.query_params.get("title", None)
#         top_k = int(request.query_params.get("top_k", 5))
        
#         if not title:
#             return Response({"error": "title parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
#         results = search_similar_blocks_by_title(title, top_k)
#         serializer = BookBlockSerializer(results, many=True)
#         return Response(serializer.data)








# # search_utils.py
# import numpy as np
# from .models import BookLesson, BookBlock
# from .embeddings_utils import generate_embedding

# def cosine_similarity(vec1, vec2):
#     a = np.array(vec1)
#     b = np.array(vec2)
#     return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# def search_similar_lessons(query: str, top_k: int = 5):
#     query_vec = generate_embedding(query)
#     lessons = BookLesson.objects.exclude(embedding_vector__isnull=True)
    
#     scored = [(cosine_similarity(query_vec, l.embedding_vector), l) for l in lessons]
#     scored.sort(key=lambda x: x[0], reverse=True)
#     return [l for score, l in scored[:top_k]]

# def search_similar_blocks(query: str, top_k: int = 5):
#     query_vec = generate_embedding(query)
#     blocks = BookBlock.objects.exclude(embedding_vector__isnull=True)
    
#     scored = [(cosine_similarity(query_vec, b.embedding_vector), b) for b in blocks]
#     scored.sort(key=lambda x: x[0], reverse=True)
#     return [b for score, b in scored[:top_k]]



# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from .models import BookLesson, BookBlock
# from .serializers import BookLessonSerializer, BookBlockSerializer
# from .search_utils import search_similar_lessons, search_similar_blocks

# class SearchViewSet(viewsets.ViewSet):

#     @action(detail=False, methods=["get"])
#     def lessons(self, request):
#         query = request.query_params.get("query", "")
#         top_k = int(request.query_params.get("top_k", 5))
#         results = search_similar_lessons(query, top_k)
#         serializer = BookLessonSerializer(results, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=["get"])
#     def blocks(self, request):
#         query = request.query_params.get("query", "")
#         top_k = int(request.query_params.get("top_k", 5))
#         results = search_similar_blocks(query, top_k)
#         serializer = BookBlockSerializer(results, many=True)
#         return Response(serializer.data)














# import numpy as np

# def cosine_similarity(vec1, vec2):
#     """
#     تحسب تشابه cos بين متجهين
#     """
#     a = np.array(vec1)
#     b = np.array(vec2)
#     if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
#         return 0.0
#     return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


# البحث عن البلوكات الأكثر تشابهاً (مع caching)
# from .models import BookBlock

# def search_top_blocks(query_embedding, top_k=5):
#     """
#     ترجع أفضل N بلوكات مشابهة مع السكور
#     """
#     blocks = BookBlock.objects.exclude(embedding_vector__isnull=True)
#     scored = []

#     for block in blocks:
#         # إذا كان عندنا score محفوظ مسبقاً مع هذا query يمكن استخدامه (Optional)
#         score = cosine_similarity(query_embedding, block.embedding_vector)
#         scored.append((score, block))

#     scored.sort(key=lambda x: x[0], reverse=True)
#     return scored[:top_k]

#  دمج الـ embeddings للبلوكات المختارة

# def merge_top_block_embeddings(top_blocks):
#     """
#     تأخذ قائمة (score, block) وتعيد متوسط المتجهات
#     """
#     embeddings = [np.array(block.embedding_vector) for score, block in top_blocks]
#     merged_vec = np.mean(embeddings, axis=0)
#     return merged_vec

#  توليد النص الموحد من البلوكات


# def generate_summary_from_blocks(top_blocks):
#     """
#     تأخذ قائمة البلوكات وتولد نص موحد
#     """
#     combined_text = " ".join([block.content for score, block in top_blocks])
#     # هنا يمكن استخدام أي طريقة للتلخيص أو AI
#     summary = combined_text[:500]  # مثال بسيط: أول 500 حرف
#     return summary

#  إنشاء بلوك جديد مع embedding

# import uuid

# def create_generated_block(top_blocks, lesson):
#     summary_text = generate_summary_from_blocks(top_blocks)
#     merged_vec = merge_top_block_embeddings(top_blocks)
    
#     new_block = BookBlock.objects.create(
#         id=uuid.uuid4(),
#         lesson=lesson,
#         order=lesson.blocks.count() + 1,
#         title="Generated Block",
#         content=summary_text,
#         embedding_vector=merged_vec.tolist()
#     )
#     return new_block

# #  استخدام كل شيء في عملية كاملة

# def process_query_and_generate_block(query, lesson, top_k=5):
#     # افترض أن لدينا دالة generate_embedding
#     from .embeddings_utils import generate_embedding
#     query_vec = generate_embedding(query)

#     top_blocks = search_top_blocks(query_vec, top_k)
    
#     # تحقق من وجود بلوكات مطابقة مسبقاً (Optional)
#     # لو عايز تخزن score في DB ممكن نضيف model score_field هنا

#     new_block = create_generated_block(top_blocks, lesson)
#     return new_block









# from .embeddings_utils import generate_embedding

# def compute_content_similarity(top_blocks):
#     """
#     توليد embeddings من المحتوى وحساب التشابه بينهم
#     """
#     # توليد embedding لكل بلوك بناءً على المحتوى
#     embeddings = [generate_embedding(block.content) for score, block in top_blocks]

#     # حساب cosine similarity بين كل زوج
#     import numpy as np
#     n = len(embeddings)
#     similarity_matrix = np.zeros((n, n))

#     for i in range(n):
#         for j in range(i, n):
#             sim = np.dot(embeddings[i], embeddings[j]) / (np.linalg.norm(embeddings[i]) * np.linalg.norm(embeddings[j]))
#             similarity_matrix[i, j] = sim
#             similarity_matrix[j, i] = sim
#     return similarity_matrix


# ليد embeddings مسبق لكل بلوك

# أفضل طريقة للأداء على المدى الطويل، خاصة إذا كان لديك آلاف البلوكات:
# 	•	عند حفظ أو تعديل كل بلوك، توليد embedding تلقائيًا وحفظه في embedding_vector.
# 	•	بهذا، عند البحث عن التشابه بين البلوكات، لا تحتاج لتوليد embeddings ديناميكيًا، فقط تستخدم embeddings الموجودة.

# مثال:


# def save_block_embedding(block):
#     if not block.embedding_vector:
#         block.embedding_vector = generate_embedding(block.content)
#         block.save()



# عند إضافة بلوك جديد
# 	•	أول شيء: توليد الـ embedding الخاص بالمحتوى تلقائيًا.
# 	•	إذا كان هذا البلوك موجود مسبقًا (نفس المحتوى أو مشابه جدًا)، يمكن تجاهل إنشاء embedding جديد، أو تحديثه إذا تم تغييره.

# مثال:


def ensure_block_embedding(block):
    """تأكد أن كل بلوك له embedding مُحدث"""
    if not block.embedding_vector:
        block.embedding_vector = generate_embedding(block.content)
        block.save()




#  البحث عن بلوكات مشابهة
# 	•	بعد توليد embedding للبلوك الجديد، نبحث في قاعدة البيانات عن بلوكات أخرى تشبهه جدًا باستخدام cosine similarity:


# from .search_utils import cosine_similarity
# from .models import BookBlock

# def find_similar_blocks(new_block, threshold=0.85):
#     similar_blocks = []
#     blocks = BookBlock.objects.exclude(id=new_block.id).exclude(embedding_vector__isnull=True)
    
#     for block in blocks:
#         score = cosine_similarity(new_block.embedding_vector, block.embedding_vector)
#         if score >= threshold:
#             similar_blocks.append((score, block))
    
#     similar_blocks.sort(key=lambda x: x[0], reverse=True)
#     return similar_blocks


#  إنشاء أو تحديث البلوك النهائي (aggregated)
# 	•	إذا تم العثور على عدة بلوكات متشابهة، يمكنك تجميعها في بلوك واحد جديد أو تحديث البلوك الحالي ليعكس أفضل محتوى.
# 	•	يمكن أن يكون التجميع إما بطريقة ذكية (مثل اختيار أفضل جملة من كل بلوك) أو أخذ المتوسط embeddings للمعالجة لاحقًا.

# مثال:


# def aggregate_blocks(blocks):
#     """تجميع محتوى عدة بلوكات مشابهة لإنشاء بلوك واحد"""
#     combined_content = " ".join([b.content for b in blocks])
#     combined_title = blocks[0].title  # ممكن اختيار العنوان الأول أو توليد عنوان جديد
#     new_block = BookBlock(
#         lesson=blocks[0].lesson,
#         title=combined_title,
#         content=combined_content
#     )
#     new_block.embedding_vector = generate_embedding(combined_content)
#     new_block.save()
#     return new_block