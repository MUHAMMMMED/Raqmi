 
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/books/", include("books.urls")),
    path("api/lessons/", include("lessons.urls")), 
    path("api/slides/", include("slides.urls")),
    path("api/videos/", include("videos.urls")),
    path("api/history/", include("history.urls")),
    path("api/media-library/", include("medialibrary.urls")),
    path("api/flashcard/", include("flashcard.urls")),
    path("api/courses/", include("courses.urls")),
    path("api/categories/",include("categories.urls")),
    path("api/reels/",include("reels.urls"))
    
    
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)