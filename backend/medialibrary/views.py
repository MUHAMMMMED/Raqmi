 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.base import ContentFile
import json
import os
import requests
from django.db import models
from django.shortcuts import get_object_or_404
from urllib.parse import urlparse
from .models import MediaLibrary
from .serializers import MediaLibrarySerializer
 
 
class MediaListView(APIView):
    def get(self, request):
        media_type = request.query_params.get("type", "")
        search = request.query_params.get("search", "")
        page = int(request.query_params.get("page", 1))
        per_page = int(request.query_params.get("per_page", 20))

        queryset = MediaLibrary.objects.all()
        if media_type:
            queryset = queryset.filter(media_type=media_type)
        if search:
            queryset = queryset.filter(models.Q(name__icontains=search) | models.Q(title__icontains=search))

        total = queryset.count()
        total_pages = (total + per_page - 1) // per_page
        start = (page - 1) * per_page
        end = start + per_page
        media = queryset[start:end]

        serializer = MediaLibrarySerializer(media, many=True)
        return Response({
            "media": serializer.data,
            "total_pages": total_pages
        })
    


# class MediaUploadView(APIView):
#     def post(self, request):
#         try:
#             file = request.FILES.get("file")
#             if not file:
#                 return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

#             name = request.POST.get("name", file.name)
#             media_type = request.POST.get("media_type", "")
#             title = request.POST.get("title", "")
#             description = request.POST.get("description", "")
#             tags = request.POST.get("tags", "[]")

#             # ✅ Try to load tags as JSON first, fallback to manual parsing
#             try:
#                 tags = json.loads(tags)
#                 if not isinstance(tags, list):
#                     raise ValueError("Tags is not a list")
#             except Exception:
#                 # fallback: handle comma or space-separated strings
#                 tags = [t.strip() for t in tags.replace(",", " ").split() if t.strip()]
        
#             # ✅ Validate media_type
#             valid_media_types = [choice[0] for choice in MediaLibrary.MEDIA_TYPES]
#             if media_type and media_type not in valid_media_types:
#                 return Response(
#                     {"error": f"Invalid media_type. Must be one of: {', '.join(valid_media_types)}"},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             # ✅ Save media
#             media = MediaLibrary(
#                 file=file,
#                 name=name,
#                 media_type=media_type,
#                 title=title,
#                 description=description,
#                 tags=tags
#             )
#             media.save()
#             serializer = MediaLibrarySerializer(media)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)







class MediaUploadView(APIView):
    def post(self, request):
        try:
            file = request.FILES.get("file")
            url = request.POST.get("url", "").strip()

            # ---------- التحقق من وجود ملف أو رابط ----------
            if not file and not url:
                return Response(
                    {"error": "يجب تقديم ملف أو رابط URL"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ---------- استخراج البيانات ----------
            name = request.POST.get("name", "")
            media_type = request.POST.get("media_type", "")
            title = request.POST.get("title", "")
            description = request.POST.get("description", "")
            tags = request.POST.get("tags", "[]")

            # ---------- معالجة التاجز ----------
            try:
                tags = json.loads(tags)
                if not isinstance(tags, list):
                    raise ValueError()
            except Exception:
                tags = [t.strip() for t in tags.replace(",", " ").split() if t.strip()]

            # ---------- تحديد نوع الوسائط ----------
            if file:
                name = name or file.name
                media_type = media_type or self._detect_media_type(file.name)
            else:
                # رفع من URL → فقط صور حاليًا
                if not self._is_valid_image_url(url):
                    return Response(
                        {"error": "الرابط يجب أن يكون لصورة (jpg, png, webp, ...)"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                name = name or self._extract_filename_from_url(url) or "image-from-url.jpg"
                media_type = "image"

            # ---------- التحقق من نوع الوسائط ----------
            valid_types = [choice[0] for choice in MediaLibrary.MEDIA_TYPES]
            if media_type not in valid_types:
                return Response(
                    {"error": f"نوع الوسائط غير صالح: {media_type}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ---------- إنشاء الكائن ----------
            media = MediaLibrary(
                name=name,
                media_type=media_type,
                title=title,
                description=description,
                tags=tags,
            )

            # ---------- حفظ الملف ----------
            if file:
                media.file = file
            else:
                # تنزيل من URL
                try:
                    resp = requests.get(url, timeout=15)
                    resp.raise_for_status()
                except Exception as e:
                    return Response(
                        {"error": f"فشل تنزيل الصورة: {str(e)}"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                content_type = resp.headers.get("Content-Type", "image/jpeg")
                ext = self._ext_from_content_type(content_type) or ".jpg"
                filename = f"{os.path.splitext(name)[0]}{ext}"
                media.file.save(filename, ContentFile(resp.content), save=False)

            # ---------- حفظ في قاعدة البيانات ----------
            media.save()
            serializer = MediaLibrarySerializer(media)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # ====================== دوال مساعدة ======================
    def _detect_media_type(self, filename):
        ext = os.path.splitext(filename)[1].lower()
        if ext in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}:
            return "image"
        if ext in {".mp4", ".webm", ".ogg", ".mov"}:
            return "video"
        if ext in {".mp3", ".wav", ".ogg"}:
            return "audio"
        return "document"

    def _is_valid_image_url(self, url):
        return any(url.lower().endswith(ext) for ext in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"})

    def _extract_filename_from_url(self, url):
        path = urlparse(url).path
        filename = os.path.basename(path)
        return filename if "." in filename else None

    def _ext_from_content_type(self, content_type):
        mapping = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/gif": ".gif",
            "image/webp": ".webp",
            "image/svg+xml": ".svg",
        }
        return mapping.get(content_type.split(";")[0])


class MediaDetailView(APIView):
    """
    API view for retrieving, updating and deleting a single media item
    """
    def get(self, request, media_id):
        try:
            media = get_object_or_404(MediaLibrary, id=media_id)
            serializer = MediaLibrarySerializer(media)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, media_id):
        try:
            media = get_object_or_404(MediaLibrary, id=media_id)
            media_name = media.name
            media.delete()
            return Response({
                "message": f"تم حذف الملف '{media_name}' بنجاح",
                "deleted_id": media_id
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MediaBulkDeleteView(APIView):
    """
    API view for bulk deleting multiple media items
    """
    def post(self, request):
        try:
            media_ids = request.data.get("media_ids", [])
            
            if not media_ids:
                return Response(
                    {"error": "لم يتم تقديم أي معرّفات وسائط"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not isinstance(media_ids, list):
                return Response(
                    {"error": "media_ids يجب أن تكون قائمة"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # التحقق من وجود الوسائط
            media_items = MediaLibrary.objects.filter(id__in=media_ids)
            found_ids = list(media_items.values_list('id', flat=True))
            not_found_ids = set(media_ids) - set(found_ids)

            if not_found_ids:
                return Response({
                    "error": f"لم يتم العثور على الوسائط ذات المعرّفات: {list(not_found_ids)}"
                }, status=status.HTTP_404_NOT_FOUND)

            # الحذف
            deleted_count = media_items.count()
            media_items.delete()

            return Response({
                "message": f"تم حذف {deleted_count} ملف بنجاح",
                "deleted_count": deleted_count,
                "deleted_ids": found_ids
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)