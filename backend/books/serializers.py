from rest_framework import serializers
from .models import *
from categories.serializers import  *
from flashcard.serializers import CardSerializer
from lessons.models import Lesson
from lessons.serializers import BlockSerializer



class BlockLearningObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockLearningObjective
        fields = "__all__"
 
class BlockExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockExercise
        fields = '__all__'
        extra_kwargs = {
            'question_text': {'required': False, 'allow_blank': True},
        }

    def validate(self, data):
        question_text = (data.get('question_text') or '').strip()
        question_image = data.get('question_image')

        if not question_text and not question_image:
            raise serializers.ValidationError({
                'question_text': 'يجب توفير نص السؤال أو صورة السؤال.'
            })

        return data

class BlockReelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockReel
        fields = "__all__"

 
class BookBlockSerializer(serializers.ModelSerializer):
    objective_block = BlockLearningObjectiveSerializer(
        many=True, read_only=True
    )
    exercises = BlockExerciseSerializer(many=True, read_only=True)
    book_block_card = CardSerializer(many=True, read_only=True)
    reel_block = BlockReelSerializer(read_only=True)
 

    class Meta:
        model = BookBlock
        fields = "__all__"

 
 
 
class BookLessonSerializer(serializers.ModelSerializer):
    blocks = BookBlockSerializer(many=True, read_only=True)
    exercises = BlockExerciseSerializer(many=True, read_only=True)

    book_title = serializers.CharField(source="part.book.title", read_only=True)
    part_title = serializers.CharField(source="part.title", read_only=True)
    part_start_page = serializers.IntegerField(source="part.start_page", read_only=True)
    part_end_page = serializers.IntegerField(source="part.end_page", read_only=True)

    class Meta:
        model = BookLesson
        fields = "__all__"  

 

class BookPartSerializer(serializers.ModelSerializer):
    lessons = BookLessonSerializer(many=True, read_only=True)
    exercises = BlockExerciseSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = BookPart
        fields = "__all__"

 
class BookSerializer(serializers.ModelSerializer):
    parts = BookPartSerializer(many=True, read_only=True)

    stage = serializers.PrimaryKeyRelatedField(queryset=Stage.objects.all())
    grade = serializers.PrimaryKeyRelatedField(queryset=Grade.objects.all())
    program = serializers.PrimaryKeyRelatedField(queryset=Program.objects.all())
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    pdf = serializers.FileField(required=False, allow_null=True) 

    stage_title = serializers.CharField(source='stage.name', read_only=True)
    grade_title = serializers.CharField(source='grade.name', read_only=True)
    program_title = serializers.CharField(source='program.name', read_only=True)
    subject_title = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Book
        fields = "__all__"
        # exclude = ['embedding_vector']  

  

class LessonSerializer(serializers.ModelSerializer):
    lesson_block = BlockSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson 
        fields = '__all__'
  

 
class LessonMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title' ] 



class BookLessonMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookLesson
        fields = ['id', 'title' ] 





class LessonIndexSerializer(serializers.ModelSerializer):
    book_lesson = BookLessonSerializer(many=True, read_only=True)
    lesson = LessonSerializer(read_only=True)
    stage = serializers.PrimaryKeyRelatedField(queryset=Stage.objects.all())
    grade = serializers.PrimaryKeyRelatedField(queryset=Grade.objects.all())
    program = serializers.PrimaryKeyRelatedField(queryset=Program.objects.all())
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
   
    stage_title = serializers.CharField(source='stage.name', read_only=True)
    grade_title = serializers.CharField(source='grade.name', read_only=True)
    program_title = serializers.CharField(source='program.name', read_only=True)
    subject_title = serializers.CharField(source='subject.name', read_only=True)
   
    class Meta:
        model = LessonIndex
        fields = "__all__"

    def to_internal_value(self, data):
        """
        معالجة البيانات الواردة لتحويلها للشكل المناسب
        """

        processed_data = data.copy()
    
        # معالجة حقل lesson
        if 'lesson' in processed_data:
            lesson_value = processed_data['lesson']

            if isinstance(lesson_value, dict) and 'id' in lesson_value:
                processed_data['lesson'] = lesson_value['id']
            elif lesson_value is None:
                processed_data['lesson'] = None

        # معالجة حقل book_lessons
        if 'book_lessons' in processed_data:
            book_lessons_value = processed_data['book_lessons']
 
            if isinstance(book_lessons_value, list) and len(book_lessons_value) > 0:
                if isinstance(book_lessons_value[0], dict):
                    book_lesson_ids = [item.get('id') for item in book_lessons_value if item.get('id')]
                    processed_data['book_lessons'] = book_lesson_ids
 
        result = super().to_internal_value(processed_data)
        return result

    def validate(self, data):
        """
        التحقق من عدم وجود تعارض في OneToOneField قبل أي عملية
        """
     
        instance = self.instance  # None في الإنشاء، الكائن في التحديث
        lesson = data.get('lesson')
 
        # إذا كان هناك lesson محاول ربطه
        if lesson:
            # البحث عن أي LessonIndex آخر يستخدم نفس الـ Lesson
            existing_index = LessonIndex.objects.filter(lesson=lesson)
            
            # إذا كان هذا تحديث، استثني الكائن الحالي
            if instance:
                existing_index = existing_index.exclude(pk=instance.pk)
            
            if existing_index.exists():
                conflicting_index = existing_index.first()
                error_message = f'⚠️ هذا الدرس "{lesson.title}" مرتبط بالفعل بفهرس آخر: "{conflicting_index.title}"'
    
                raise serializers.ValidationError({
                    'lesson': error_message,
                    'conflicting_index_id': conflicting_index.id,
                    'conflicting_index_title': conflicting_index.title
                })
        
 
        return data
 
    def update(self, instance, validated_data):
        """
        تحديث كائن مع التحقق النهائي من التعارضات
        """
        # الحصول على البيانات الأصلية من الطلب
        request_data = self.context['request'].data
        
        # تحديث الحقول الأساسية من validated_data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # معالجة LESSON من request data
        lesson_to_set = None
        if 'lesson' in request_data:
            lesson_data = request_data['lesson']
       
            if lesson_data and isinstance(lesson_data, dict) and 'id' in lesson_data:
                try:
                    lesson_to_set = Lesson.objects.get(id=lesson_data['id'])
           
                    # التحقق النهائي من التعارض قبل التحديث
                    existing_index = LessonIndex.objects.filter(lesson=lesson_to_set).exclude(pk=instance.pk).first()
                    if existing_index:
                        error_message = f'❌ لا يمكن التحديث: الدرس "{lesson_to_set.title}" مرتبط بالفعل بفهرس "{existing_index.title}"'
             
                        raise serializers.ValidationError({
                            'lesson': error_message,
                            'conflicting_index_id': existing_index.id,
                            'conflicting_index_title': existing_index.title
                        })
                    
                    instance.lesson = lesson_to_set
        
                    
                except Lesson.DoesNotExist:
                    instance.lesson = None
                    print("❌ لم يتم العثور على الدرس")
            elif lesson_data is None:
                instance.lesson = None
         
        else:
            print("⚠️ لا يوجد حقل lesson في البيانات")
        
        # معالجة BOOK_LESSONS من request data
        if 'book_lessons' in request_data:
            book_lessons_data = request_data['book_lessons']
   
            if isinstance(book_lessons_data, list):
                book_lesson_ids = []
                for item in book_lessons_data:
                    if isinstance(item, dict) and 'id' in item:
                        book_lesson_ids.append(item['id'])
                    elif isinstance(item, int):
                        book_lesson_ids.append(item)
                
                if book_lesson_ids:
                    book_lessons = BookLesson.objects.filter(id__in=book_lesson_ids)
                    instance.book_lesson.set(book_lessons)
                else:
                    instance.book_lesson.clear()

        instance.save()
  
        
        return instance