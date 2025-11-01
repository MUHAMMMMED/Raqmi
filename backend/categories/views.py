# from rest_framework import viewsets
# from .models import *
# from .serializers import *

# class StageViewSet(viewsets.ModelViewSet):
#     queryset = Stage.objects.all()
#     serializer_class = StageSerializer


# class GradeViewSet(viewsets.ModelViewSet):
#     queryset = Grade.objects.all()
#     serializer_class = GradeSerializer


# class ProgramViewSet(viewsets.ModelViewSet):
#     queryset = Program.objects.all()
#     serializer_class = ProgramSerializer


# class SubjectViewSet(viewsets.ModelViewSet):
#     queryset = Subject.objects.all()
#     serializer_class = SubjectSerializer



from rest_framework import viewsets, decorators, response
from .models import Stage, Grade, Program, Subject
from .serializers import StageSerializer, GradeSerializer, ProgramSerializer, SubjectSerializer


class StageViewSet(viewsets.ModelViewSet):
    queryset = Stage.objects.all()
    serializer_class = StageSerializer

    @decorators.action(detail=True, methods=['get'])
    def grades(self, request, pk=None):
        """إرجاع الصفوف التابعة لمرحلة معينة"""
        grades = Grade.objects.filter(stage_id=pk)
        serializer = GradeSerializer(grades, many=True)
        return response.Response(serializer.data)


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer

    @decorators.action(detail=True, methods=['get'])
    def programs(self, request, pk=None):
        """إرجاع البرامج التابعة للصف"""
        programs = Program.objects.filter(grade_id=pk)
        serializer = ProgramSerializer(programs, many=True)
        return response.Response(serializer.data)


class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer

    @decorators.action(detail=True, methods=['get'])
    def subjects(self, request, pk=None):
        """إرجاع المواد التابعة للبرنامج"""
        subjects = Subject.objects.filter(program_id=pk)
        serializer = SubjectSerializer(subjects, many=True)
        return response.Response(serializer.data)


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer