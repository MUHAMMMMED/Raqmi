
import React, { useEffect, useState } from 'react';
import {
    FaBook,
    FaFilter, FaPlus,
    FaSearch,
    FaTimes
} from 'react-icons/fa';
import { getGradePrograms, getProgramSubjects, getStageGrades, getStages } from '../../api/categories';
import { createLessonIndex, deleteLessonIndex, getLessonIndex, updateLessonIndex } from '../../api/lessonIndex';
import styles from './LessonIndexManager.module.css';
import LessonIndexCard from './components/LessonIndexCard/LessonIndexCard';
import LessonIndexForm from './components/LessonIndexForm/LessonIndexForm';

const LessonIndexManager = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);

    // حالات البحث والتصفية
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStage, setSelectedStage] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [hasAiLesson, setHasAiLesson] = useState('');

    // بيانات الفلاتر
    const [stages, setStages] = useState([]);
    const [grades, setGrades] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // حالة عرض الفلاتر
    const [showFilters, setShowFilters] = useState(false);

    // جلب البيانات الأولية
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [lessonsData, stagesData] = await Promise.all([
                getLessonIndex(),
                getStages()
            ]);

            setLessons(lessonsData);
            setStages(stagesData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // جلب البيانات المتسلسلة
    useEffect(() => {
        const loadGrades = async () => {
            if (selectedStage) {
                try {
                    const gradesData = await getStageGrades(selectedStage);
                    setGrades(gradesData);
                } catch (error) {
                    console.error('Error loading grades:', error);
                }
            } else {
                setGrades([]);
            }
        };
        loadGrades();
    }, [selectedStage]);

    useEffect(() => {
        const loadPrograms = async () => {
            if (selectedGrade) {
                try {
                    const programsData = await getGradePrograms(selectedGrade);
                    setPrograms(programsData);
                } catch (error) {
                    console.error('Error loading programs:', error);
                }
            } else {
                setPrograms([]);
            }
        };
        loadPrograms();
    }, [selectedGrade]);

    useEffect(() => {
        const loadSubjects = async () => {
            if (selectedProgram) {
                try {
                    const subjectsData = await getProgramSubjects(selectedProgram);
                    setSubjects(subjectsData);
                } catch (error) {
                    console.error('Error loading subjects:', error);
                }
            } else {
                setSubjects([]);
            }
        };
        loadSubjects();
    }, [selectedProgram]);

    // تطبيق الفلاتر
    const filteredLessons = lessons.filter(lesson => {
        const matchesSearch = !searchTerm ||
            lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.stage_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.grade_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.subject_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStage = !selectedStage || lesson.stage?.toString() === selectedStage;
        const matchesGrade = !selectedGrade || lesson.grade?.toString() === selectedGrade;
        const matchesProgram = !selectedProgram || lesson.program?.toString() === selectedProgram;
        const matchesSubject = !selectedSubject || lesson.subject?.toString() === selectedSubject;

        const matchesAiLesson = hasAiLesson === '' ||
            (hasAiLesson === 'with' && lesson.ai_lesson) ||
            (hasAiLesson === 'without' && !lesson.ai_lesson);

        return matchesSearch && matchesStage && matchesGrade && matchesProgram && matchesSubject && matchesAiLesson;
    });

    const handleCreate = async (lessonData) => {
        try {
            await createLessonIndex(lessonData);
            setShowForm(false);
            loadData();
        } catch (error) {
            console.error('Error creating lesson index:', error);
            throw error;
        }
    };

    const handleUpdate = async (lessonData) => {
        try {
            await updateLessonIndex(editingLesson.id, lessonData);
            setShowForm(false);
            setEditingLesson(null);
            loadData();
        } catch (error) {
            console.error('Error updating lesson index:', error);
            throw error;
        }
    };

    const handleDelete = async (lessonId) => {
        if (window.confirm('هل أنت متأكد من حذف فهرس الدرس؟')) {
            try {
                await deleteLessonIndex(lessonId);
                loadData();
            } catch (error) {
                console.error('Error deleting lesson index:', error);
                alert('حدث خطأ أثناء الحذف');
            }
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStage('');
        setSelectedGrade('');
        setSelectedProgram('');
        setSelectedSubject('');
        setHasAiLesson('');
    };

    const hasActiveFilters = searchTerm || selectedStage || selectedGrade || selectedProgram || selectedSubject || hasAiLesson;

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل فهرس الدروس...</p>
            </div>
        );
    }

    return (
        <div className={styles.lessonIndexManager}>
            {/* الهيدر */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.titleSection}>
                        <FaBook className={styles.titleIcon} />
                        <h1>فهرس الدروس</h1>
                        <span className={styles.subtitle}>
                            إدارة وتنظيم جميع الدروس في النظام
                        </span>
                    </div>
                    <button
                        className={styles.addButton}
                        onClick={() => setShowForm(true)}
                    >
                        <FaPlus />
                        <span>إضافة درس جديد</span>
                    </button>
                </div>
            </div>

            {/* شريط البحث والتصفية */}
            <div className={styles.filterSection}>
                <div className={styles.searchBar}>
                    <div className={styles.searchInputContainer}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="ابحث باسم الدرس، المرحلة، الصف، أو المادة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className={styles.clearSearch}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    <button
                        className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter />
                        <span>الفلاتر</span>
                        {hasActiveFilters && <span className={styles.filterBadge}></span>}
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className={styles.clearFilters}
                        >
                            <FaTimes />
                            <span>مسح الكل</span>
                        </button>
                    )}
                </div>

                {/* الفلاتر المتقدمة */}
                {showFilters && (
                    <div className={styles.advancedFilters}>
                        <div className={styles.filterGrid}>
                            <div className={styles.filterGroup}>
                                <label>المرحلة</label>
                                <select
                                    value={selectedStage}
                                    onChange={(e) => {
                                        setSelectedStage(e.target.value);
                                        setSelectedGrade('');
                                        setSelectedProgram('');
                                        setSelectedSubject('');
                                    }}
                                    className={styles.filterSelect}
                                >
                                    <option value="">جميع المراحل</option>
                                    {stages.map(stage => (
                                        <option key={stage.id} value={stage.id}>
                                            {stage.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.filterGroup}>
                                <label>الصف</label>
                                <select
                                    value={selectedGrade}
                                    onChange={(e) => {
                                        setSelectedGrade(e.target.value);
                                        setSelectedProgram('');
                                        setSelectedSubject('');
                                    }}
                                    className={styles.filterSelect}
                                    disabled={!selectedStage}
                                >
                                    <option value="">جميع الصفوف</option>
                                    {grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>
                                            {grade.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.filterGroup}>
                                <label>البرنامج</label>
                                <select
                                    value={selectedProgram}
                                    onChange={(e) => {
                                        setSelectedProgram(e.target.value);
                                        setSelectedSubject('');
                                    }}
                                    className={styles.filterSelect}
                                    disabled={!selectedGrade}
                                >
                                    <option value="">جميع البرامج</option>
                                    {programs.map(program => (
                                        <option key={program.id} value={program.id}>
                                            {program.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.filterGroup}>
                                <label>المادة</label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className={styles.filterSelect}
                                    disabled={!selectedProgram}
                                >
                                    <option value="">جميع المواد</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.filterGroup}>
                                <label>ربط AI Lesson</label>
                                <select
                                    value={hasAiLesson}
                                    onChange={(e) => setHasAiLesson(e.target.value)}
                                    className={styles.filterSelect}
                                >
                                    <option value="">الكل</option>
                                    <option value="with">مرتبط بدرس AI</option>
                                    <option value="without">غير مرتبط</option>
                                </select>
                            </div>
                        </div>

                        {/* عرض الفلاتر النشطة */}
                        {hasActiveFilters && (
                            <div className={styles.activeFilters}>
                                <span className={styles.activeFiltersLabel}>الفلاتر المطبقة:</span>
                                <div className={styles.activeFilterTags}>
                                    {searchTerm && (
                                        <span className={styles.filterTag}>
                                            بحث: "{searchTerm}"
                                            <button onClick={() => setSearchTerm('')}>×</button>
                                        </span>
                                    )}
                                    {selectedStage && (
                                        <span className={styles.filterTag}>
                                            مرحلة: {stages.find(s => s.id.toString() === selectedStage)?.name}
                                            <button onClick={() => setSelectedStage('')}>×</button>
                                        </span>
                                    )}
                                    {selectedGrade && (
                                        <span className={styles.filterTag}>
                                            صف: {grades.find(g => g.id.toString() === selectedGrade)?.name}
                                            <button onClick={() => setSelectedGrade('')}>×</button>
                                        </span>
                                    )}
                                    {selectedProgram && (
                                        <span className={styles.filterTag}>
                                            برنامج: {programs.find(p => p.id.toString() === selectedProgram)?.name}
                                            <button onClick={() => setSelectedProgram('')}>×</button>
                                        </span>
                                    )}
                                    {selectedSubject && (
                                        <span className={styles.filterTag}>
                                            مادة: {subjects.find(s => s.id.toString() === selectedSubject)?.name}
                                            <button onClick={() => setSelectedSubject('')}>×</button>
                                        </span>
                                    )}
                                    {hasAiLesson && (
                                        <span className={styles.filterTag}>
                                            {hasAiLesson === 'with' ? 'مرتبط بدرس AI' : 'غير مرتبط'}
                                            <button onClick={() => setHasAiLesson('')}>×</button>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* إحصائيات النتائج */}
            <div className={styles.resultsInfo}>
                <span className={styles.resultsCount}>
                    عرض {filteredLessons.length} من أصل {lessons.length} درس
                </span>
                <div className={styles.resultsStats}>
                    <span className={styles.statItem}>
                        <strong>مرتبط ب AI:</strong> {lessons.filter(l => l.ai_lesson).length}
                    </span>
                    <span className={styles.statItem}>
                        <strong>غير مرتبط:</strong> {lessons.filter(l => !l.ai_lesson).length}
                    </span>
                </div>
            </div>

            {/* شبكة الدروس */}
            {filteredLessons.length > 0 ? (
                <div className={styles.lessonsGrid}>
                    {filteredLessons.map(lesson => (
                        <LessonIndexCard
                            key={lesson.id}
                            lesson={lesson}
                            onEdit={() => {
                                setEditingLesson(lesson);
                                setShowForm(true);
                            }}
                            onDelete={() => handleDelete(lesson.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>📚</div>
                    <h3>لا توجد دروس مطابقة للبحث</h3>
                    <p>جرب تعديل كلمات البحث أو إزالة بعض الفلاتر</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className={styles.addLessonBtn}
                    >
                        <FaPlus />
                        إضافة درس جديد
                    </button>
                </div>
            )}

            {/* نافذة الإضافة/التعديل */}
            {(showForm || editingLesson) && (
                <LessonIndexForm
                    lesson={editingLesson}
                    onSave={editingLesson ? handleUpdate : handleCreate}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingLesson(null);
                    }}
                    stages={stages}
                />
            )}
        </div>
    );
};

export default LessonIndexManager;