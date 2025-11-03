from rest_framework import serializers
from .models import Course
from categories. serializers import *
 
class CourseSerializer(serializers.ModelSerializer):
    stage_name = serializers.CharField(source='stage.name', read_only=True)
    grade_name = serializers.CharField(source='grade.name', read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    # إضافة حقول للقراءة فقط بالصيغة البديلة
    stage_id = serializers.IntegerField(write_only=True, required=False)
    grade_id = serializers.IntegerField(write_only=True, required=False)
    program_id = serializers.IntegerField(write_only=True, required=False)
    subject_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Course
        fields = [
            'id', 'name', 
            'stage', 'stage_name', 'stage_id',
            'grade', 'grade_name', 'grade_id', 
            'program', 'program_name', 'program_id',
            'subject', 'subject_name', 'subject_id',
            'primary_color', 'secondary_color', 'background_color',
            'main_font', 'desc_font',
            'border_radius', 'padding',
            'version', 'checksum', 'license_info',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['version', 'checksum', 'created_at', 'updated_at']

    def create(self, validated_data):
        # معالجة البيانات سواء أتت كـ stage أو stage_id
        stage = validated_data.pop('stage', None)
        if not stage and 'stage_id' in validated_data:
            stage = Stage.objects.get(id=validated_data.pop('stage_id'))
        
        grade = validated_data.pop('grade', None)
        if not grade and 'grade_id' in validated_data:
            grade = Grade.objects.get(id=validated_data.pop('grade_id'))
            
        program = validated_data.pop('program', None)
        if not program and 'program_id' in validated_data:
            program = Program.objects.get(id=validated_data.pop('program_id'))
            
        subject = validated_data.pop('subject', None)
        if not subject and 'subject_id' in validated_data:
            subject = Subject.objects.get(id=validated_data.pop('subject_id'))
        
        return Course.objects.create(
            stage=stage,
            grade=grade,
            program=program,
            subject=subject,
            **validated_data
        )

    def update(self, instance, validated_data):
        # معالجة التحديث بنفس الطريقة
        if 'stage_id' in validated_data:
            instance.stage = Stage.objects.get(id=validated_data.pop('stage_id'))
        elif 'stage' in validated_data:
            instance.stage = validated_data.pop('stage')
            
        if 'grade_id' in validated_data:
            instance.grade = Grade.objects.get(id=validated_data.pop('grade_id'))
        elif 'grade' in validated_data:
            instance.grade = validated_data.pop('grade')
            
        if 'program_id' in validated_data:
            instance.program = Program.objects.get(id=validated_data.pop('program_id'))
        elif 'program' in validated_data:
            instance.program = validated_data.pop('program')
            
        if 'subject_id' in validated_data:
            instance.subject = Subject.objects.get(id=validated_data.pop('subject_id'))
        elif 'subject' in validated_data:
            instance.subject = validated_data.pop('subject')
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()
        return instance