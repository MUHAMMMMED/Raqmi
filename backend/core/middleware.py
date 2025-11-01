# # core/middleware.py
# import re
# from django.http import JsonResponse
# from django.utils import translation
# import logging

# logger = logging.getLogger(__name__)

# # ----------------------------
# # Middleware 1: AuthMiddleware
# # ----------------------------
# class AuthMiddleware:
#     """
#     Middleware للتحكم في الوصول للـ API:
#     - روابط مفتوحة للجميع
#     - روابط محمية تتطلب تسجيل الدخول
#     """

#     PUBLIC_PATHS = [
#         r"^/api/books/$",
#         r"^/api/books/\d+/$",
#         r"^/api/auth/login/$",
#     ]

#     PROTECTED_PATHS = [
#         r"^/api/bookparts/$",
#         r"^/api/bookparts/\d+/$",
#         r"^/api/books/create/$",
#         r"^/api/books/update/\d+/$",
#         r"^/api/books/delete/\d+/$",
#     ]

#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         path = request.path

#         # السماح لو الرابط ضمن PUBLIC_PATHS
#         for pattern in self.PUBLIC_PATHS:
#             if re.match(pattern, path):
#                 return self.get_response(request)

#         # التحقق من الحماية
#         for pattern in self.PROTECTED_PATHS:
#             if re.match(pattern, path):
#                 if not request.user.is_authenticated:
#                     return JsonResponse({"detail": "You must be logged in to access this."}, status=401)
#                 break

#         return self.get_response(request)

# # ----------------------------
# # Middleware 2: SmartMiddleware
# # ----------------------------
# class SmartMiddleware:
#     """
#     Middleware ذكي للتحقق من الدولة وتحديد اللغة.
#     يمكن حظر بعض الدول وتفعيل اللغة المناسبة حسب الدولة.
#     """
#     BLOCKED_COUNTRIES = ["North Korea", "Iran"]
#     DEFAULT_LANGUAGE = "en"

#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         ip = request.META.get("REMOTE_ADDR", "")
#         country = self.get_country_from_ip(ip)

#         # حظر دول معينة
#         if country in self.BLOCKED_COUNTRIES:
#             return JsonResponse({"detail": "Access from your country is blocked."}, status=403)

#         # تحديد اللغة
#         lang = self.get_language_from_country(country)
#         translation.activate(lang)
#         request.LANGUAGE_CODE = lang

#         response = self.get_response(request)
#         translation.deactivate()
#         return response

#     def get_country_from_ip(self, ip):
#         # يمكن استخدام مكتبة GeoIP أو API خارجي
#         return "Egypt"  # مثال وهمي

#     def get_language_from_country(self, country):
#         return "ar" if country == "Egypt" else self.DEFAULT_LANGUAGE

# # ----------------------------
# # Middleware 3: FilterLogsMiddleware
# # ----------------------------
# class FilterLogsMiddleware:
#     """
#     Middleware لتصفية اللوجز وتقليل الضغط على السيرفر.
#     يسجل فقط الـ requests المهمة.
#     """
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         ignored_paths = ["/static/", "/media/", "/favicon.ico", "/health/"]
#         important_paths = ["/api/books/", "/api/bookparts/"]

#         # تجاهل الـ requests الغير مهمة
#         if any(request.path.startswith(p) for p in ignored_paths):
#             return self.get_response(request)

#         # تسجيل الـ requests المهمة
#         if any(request.path.startswith(p) for p in important_paths):
#             logger.info(f"[IMPORTANT] {request.method} {request.path} - user: {request.user}")

#         response = self.get_response(request)
#         return response