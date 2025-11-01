from rest_framework import viewsets
from .models import Course
from .serializers import CourseSerializer


# class CourseViewSet(viewsets.ModelViewSet):
#     queryset = Course.objects.all()
#     serializer_class = CourseSerializer
    
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Course
from .serializers import CourseSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def create(self, request, *args, **kwargs):
        print("DATA RECEIVED:", request.data)  # عرض البيانات اللي جاية من الفرانت
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("SERIALIZER ERRORS:", serializer.errors)  # عرض الأخطاء
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        print("DATA RECEIVED (UPDATE):", request.data)
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            print("SERIALIZER ERRORS (UPDATE):", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_update(serializer)
        return Response(serializer.data)