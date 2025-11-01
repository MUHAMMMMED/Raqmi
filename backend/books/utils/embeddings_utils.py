# # # embeddings_utils.py
# from sentence_transformers import SentenceTransformer

# # نحمّل الموديل
# model = SentenceTransformer('all-MiniLM-L6-v2')  # أو موديل أكبر لو عايز دقة أعلى

# def generate_embedding(text: str) -> list:
#     """
#     يحوّل النص إلى embedding vector جاهز للتخزين
#     """
#     embedding = model.encode(text).tolist()
#     return embedding



from sentence_transformers import SentenceTransformer

# تحميل الموديل
model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embedding(text: str) -> list:
    """
    يحول النص أو العنوان + النص إلى vector
    """
    embedding = model.encode(text).tolist()
    return embedding





# # embeddings_utils.py
# import numpy as np

# def generate_embedding(text: str):
#     """
#     هنا تحط الخوارزم أو النموذج اللي بيحول النص إلى vector
#     ممكن تستخدم نموذج محلي أو أي مكتبة.
#     """
#     # مثال بسيط: تمثيل عشوائي (Placeholder)
#     vec = np.random.rand(512).tolist()
#     return vec