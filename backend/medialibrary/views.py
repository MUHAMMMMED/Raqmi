# from rest_framework import viewsets, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from django.db.models import Q, Sum
# import json
# from .models import*
# from .serializers import*
 

# class MediaLibraryViewSet(viewsets.ModelViewSet):
#     queryset = MediaLibrary.objects.all().order_by('-created_at')
#     serializer_class = MediaLibrarySerializer

#     def get_queryset(self):
#         queryset = MediaLibrary.objects.all().order_by('-created_at')
#         media_type = self.request.query_params.get('type', '')
#         search = self.request.query_params.get('search', '')

#         if media_type:
#             queryset = queryset.filter(media_type=media_type)

#         if search:
#             queryset = queryset.filter(
#                 Q(name__icontains=search) |
#                 Q(title__icontains=search) |
#                 Q(description__icontains=search) |
#                 Q(tags__icontains=search)
#             )

#         return queryset

#     def create(self, request, *args, **kwargs):
#         try:
#             file = request.FILES.get('file')
#             if not file:
#                 return Response({'error': 'No file provided'}, status=400)

#             name = request.data.get('name', file.name)
#             title = request.data.get('title', '')
#             description = request.data.get('description', '')
#             media_type = request.data.get('media_type', '')
#             tags = json.loads(request.data.get('tags', '[]'))

#             # Detect media type automatically
#             if not media_type:
#                 if file.content_type.startswith('image/'):
#                     media_type = 'image'
#                 elif file.content_type.startswith('video/'):
#                     media_type = 'video'
#                 elif file.content_type.startswith('audio/'):
#                     media_type = 'audio'
#                 else:
#                     media_type = 'document'

#             media_item = MediaLibrary.objects.create(
#                 name=name,
#                 file=file,
#                 media_type=media_type,
#                 title=title,
#                 description=description,
#                 tags=tags
#             )

#             serializer = self.get_serializer(media_item)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         except Exception as e:
#             return Response({'error': str(e)}, status=500)

#     @action(detail=False, methods=['get'])
#     def stats(self, request):
#         stats = {
#             'total_media': MediaLibrary.objects.count(),
#             'images_count': MediaLibrary.objects.filter(media_type='image').count(),
#             'videos_count': MediaLibrary.objects.filter(media_type='video').count(),
#             'audio_count': MediaLibrary.objects.filter(media_type='audio').count(),
#             'documents_count': MediaLibrary.objects.filter(media_type='document').count(),
#             'total_usage': MediaLibrary.objects.aggregate(Sum('usage_count'))['usage_count__sum'] or 0,
#         }
#         return Response(stats)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MediaLibrary
from .serializers import MediaLibrarySerializer
import json
from django.db import models

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

#             try:
#                 tags = json.loads(tags)
#                 if not isinstance(tags, list):
#                     return Response({"error": "Tags must be a JSON array"}, status=status.HTTP_400_BAD_REQUEST)
#             except json.JSONDecodeError:
#                 return Response({"error": "Invalid tags format"}, status=status.HTTP_400_BAD_REQUEST)

#             # Validate media_type
#             valid_media_types = [choice[0] for choice in MediaLibrary.MEDIA_TYPES]
#             if media_type and media_type not in valid_media_types:
#                 return Response({"error": f"Invalid media_type. Must be one of: {', '.join(valid_media_types)}"}, 
#                               status=status.HTTP_400_BAD_REQUEST)

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
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MediaLibrary
from .serializers import MediaLibrarySerializer
import json

class MediaUploadView(APIView):
    def post(self, request):
        try:
            file = request.FILES.get("file")
            if not file:
                return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

            name = request.POST.get("name", file.name)
            media_type = request.POST.get("media_type", "")
            title = request.POST.get("title", "")
            description = request.POST.get("description", "")
            tags = request.POST.get("tags", "[]")

            # ✅ Try to load tags as JSON first, fallback to manual parsing
            try:
                tags = json.loads(tags)
                if not isinstance(tags, list):
                    raise ValueError("Tags is not a list")
            except Exception:
                # fallback: handle comma or space-separated strings
                tags = [t.strip() for t in tags.replace(",", " ").split() if t.strip()]
                print("⚙️ Auto-converted tags to list:", tags)

            # ✅ Validate media_type
            valid_media_types = [choice[0] for choice in MediaLibrary.MEDIA_TYPES]
            if media_type and media_type not in valid_media_types:
                return Response(
                    {"error": f"Invalid media_type. Must be one of: {', '.join(valid_media_types)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # ✅ Save media
            media = MediaLibrary(
                file=file,
                name=name,
                media_type=media_type,
                title=title,
                description=description,
                tags=tags
            )
            media.save()

            serializer = MediaLibrarySerializer(media)
            print("✅ Media created:", serializer.data)  # Debug print
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("❌ Error in upload:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)