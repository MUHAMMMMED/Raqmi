

import React, { useEffect, useState } from "react";
import { DiWindows } from "react-icons/di";
import {
    FaArrowRight,

    FaBook,
    FaBullseye,
    FaChartBar,
    FaCheckCircle,
    FaChevronDown,
    FaChevronUp,
    FaClock,
    FaCodeBranch,
    FaEdit,
    FaGraduationCap,
    FaHourglassHalf,
    FaPlus,
    FaSearch,
    FaTasks,
    FaTimesCircle,
    FaTrash,
    FaUser,
    FaUserGraduate,
    FaVideo
} from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";

import { getCourse } from "../../api/courses";
import { createLesson, deleteLesson, getLessonsByCourse, updateLesson } from "../../api/lessons";
import ConfirmationModal from "./components/ConfirmationModal/ConfirmationModal";
import LessonModal from "./components/LessonModal/LessonModal";
import styles from './LessonList.module.css';

const LessonList = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedLessons, setExpandedLessons] = useState({});
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [modalMode, setModalMode] = useState('create');
    const [lessonToDelete, setLessonToDelete] = useState(null);

    useEffect(() => {
        loadData();
    }, [courseId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [lessonsData, courseData] = await Promise.all([
                getLessonsByCourse(courseId),
                getCourse(courseId)
            ]);
            setLessons(lessonsData);
            setCourse(courseData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // دالة العودة للصفحة السابقة
    const handleGoBack = () => {
        navigate(-1);
    };

    const toggleLessonExpansion = (lessonId) => {
        setExpandedLessons(prev => ({
            ...prev,
            [lessonId]: !prev[lessonId]
        }));
    };

    // Create Lesson
    const handleCreateLesson = () => {
        setSelectedLesson(null);
        setModalMode('create');
        setIsLessonModalOpen(true);
    };

    // Edit Lesson
    const handleEditLesson = (lesson) => {
        setSelectedLesson(lesson);
        setModalMode('edit');
        setIsLessonModalOpen(true);
    };

    // Save Lesson (Create or Update)
    const handleSaveLesson = async (lessonData) => {
        try {
            // إعداد البيانات للإرسال مع تضمين حقل course في كلتا الحالتين
            const dataToSend = {
                ...lessonData,
                course: parseInt(courseId)
            };

            if (modalMode === 'create') {
                await createLesson(dataToSend);
            } else {
                await updateLesson(selectedLesson.id, dataToSend);
            }
            await loadData();
            setIsLessonModalOpen(false);
        } catch (error) {
            console.error('Error saving lesson:', error);
            throw error;
        }
    };

    // Delete Lesson
    const handleDeleteLesson = (lesson) => {
        setLessonToDelete(lesson);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteLesson = async () => {
        try {
            await deleteLesson(lessonToDelete.id);
            await loadData();
            setIsDeleteModalOpen(false);
            setLessonToDelete(null);
        } catch (error) {
            console.error('Error deleting lesson:', error);
        }
    };

    const filteredLessons = lessons.filter(lesson =>
        lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.info?.نوع_الدرس?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.ai_model?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getReviewStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <FaCheckCircle className={styles.statusApproved} />;
            case 'pending':
                return <FaHourglassHalf className={styles.statusPending} />;
            case 'rejected':
                return <FaTimesCircle className={styles.statusRejected} />;
            default:
                return <FaHourglassHalf className={styles.statusPending} />;
        }
    };

    const getReviewStatusText = (status) => {
        switch (status) {
            case 'approved':
                return 'معتمد';
            case 'pending':
                return 'قيد المراجعة';
            case 'rejected':
                return 'مرفوض';
            default:
                return 'قيد المراجعة';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const LessonItem = ({ lesson, index }) => {
        const designSettings = course ? {
            primaryColor: course.primary_color || '#667eea',
            secondaryColor: course.secondary_color || '#764ba2',
        } : {};

        const lessonInfo = lesson.info || {};
        const objectives = lessonInfo.الأهداف || [];
        const duration = lessonInfo.مدة_التعلم || 'غير محدد';
        const difficulty = lessonInfo.صعوبة || 'متوسطة';
        const grade = lessonInfo.المستوى || course?.grade?.name || 'غير محدد';
        const lessonType = lessonInfo.نوع_الدرس || 'عام';
        const isExpanded = expandedLessons[lesson.id];

        return (
            <div
                className={styles.lessonItem}
                style={{
                    '--primary-color': designSettings.primaryColor,
                    '--secondary-color': designSettings.secondaryColor,
                }}
            >
                <div className={styles.lessonHeader} onClick={() => toggleLessonExpansion(lesson.id)}>
                    <div className={styles.lessonOrder}>
                        {index + 1}
                    </div>
                    <div className={styles.lessonContent}>
                        <div className={styles.lessonMainInfo}>
                            <div className={styles.lessonTitleRow}>
                                <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                                <div className={styles.reviewStatus}>
                                    {getReviewStatusIcon(lesson.review_status)}
                                    <span className={`${styles.statusText} ${styles[lesson.review_status]}`}>
                                        {getReviewStatusText(lesson.review_status)}
                                    </span>
                                </div>
                            </div>

                            {lesson.summary && (
                                <p className={styles.lessonDescription}>
                                    {lesson.summary}
                                </p>
                            )}

                            <div className={styles.lessonMeta}>
                                <span className={styles.metaItem}>
                                    <FaGraduationCap className={styles.metaIcon} />
                                    {lessonType}
                                </span>
                                <span className={styles.metaItem}>
                                    <FaUserGraduate className={styles.metaIcon} />
                                    {grade}
                                </span>
                                <span className={styles.metaItem}>
                                    <FaClock className={styles.metaIcon} />
                                    {duration}
                                </span>
                                <span className={styles.metaItem}>
                                    <FaTasks className={styles.metaIcon} />
                                    {difficulty}
                                </span>
                                {lesson.ai_model && (
                                    <span className={styles.metaItem}>
                                        <FaCodeBranch className={styles.metaIcon} />
                                        {lesson.ai_model}
                                    </span>
                                )}
                                {lesson.reviewed_by && (
                                    <span className={styles.metaItem}>
                                        <FaUser className={styles.metaIcon} />
                                        {lesson.reviewed_by}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className={styles.lessonStats}>
                            <div className={styles.statBadges}>
                                <span className={`${styles.statBadge} ${styles.slides}`}>
                                    {lesson.slides_count || 0} شرائح
                                </span>
                                <span className={`${styles.statBadge} ${styles.reels}`}>
                                    {lesson.reels_count || 0} ريلز
                                </span>
                                <span className={`${styles.statBadge} ${styles.difficulty} ${styles[difficulty]}`}>
                                    {difficulty === 'صعبة' ? 'صعبة' :
                                        difficulty === 'متوسطة' ? 'متوسطة' : 'سهلة'}
                                </span>
                                {lesson.version && lesson.version > 1 && (
                                    <span className={`${styles.statBadge} ${styles.version}`}>
                                        v{lesson.version}
                                    </span>
                                )}
                            </div>
                            <div className={styles.lessonActions}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditLesson(lesson);
                                    }}
                                    title="تعديل الدرس"
                                >
                                    <FaEdit />
                                    تعديل
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.danger}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteLesson(lesson);
                                    }}
                                    title="حذف الدرس"
                                >
                                    <FaTrash />
                                    حذف
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.primary}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLessonExpansion(lesson.id);
                                    }}
                                >
                                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                    {isExpanded ? 'إخفاء' : 'تفاصيل'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className={styles.lessonExpandedContent}>
                        {/* الأهداف التعليمية */}
                        {objectives.length > 0 && (
                            <div className={styles.objectivesSection}>
                                <h4 className={styles.sectionTitle}>
                                    <FaBullseye className={styles.sectionIcon} />
                                    الأهداف التعليمية
                                </h4>
                                <div className={styles.objectivesGrid}>
                                    {objectives.map((objective, idx) => (
                                        <div key={idx} className={styles.objectiveItem}>
                                            {objective}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* معلومات المراجعة */}
                        {(lesson.reviewed_by || lesson.review_notes) && (
                            <div className={styles.reviewSection}>
                                <h4 className={styles.sectionTitle}>
                                    <FaCheckCircle className={styles.sectionIcon} />
                                    معلومات المراجعة
                                </h4>
                                <div className={styles.reviewInfo}>
                                    {lesson.reviewed_by && (
                                        <div className={styles.reviewItem}>
                                            <strong>تمت المراجعة بواسطة:</strong>
                                            <span>{lesson.reviewed_by}</span>
                                        </div>
                                    )}
                                    {lesson.review_notes && (
                                        <div className={styles.reviewItem}>
                                            <strong>ملاحظات المراجعة:</strong>
                                            <span>{lesson.review_notes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* معلومات الذكاء الاصطناعي والإصدار */}
                        <div className={styles.techInfo}>
                            <div className={styles.techInfoGrid}>
                                {lesson.ai_model && (
                                    <div className={styles.techItem}>
                                        <FaCodeBranch className={styles.techIcon} />
                                        <div>
                                            <strong>نموذج الذكاء الاصطناعي</strong>
                                            <span>{lesson.ai_model}</span>
                                        </div>
                                    </div>
                                )}
                                {lesson.prompt_version && (
                                    <div className={styles.techItem}>
                                        <FaCodeBranch className={styles.techIcon} />
                                        <div>
                                            <strong>إصدار النموذج</strong>
                                            <span>{lesson.prompt_version}</span>
                                        </div>
                                    </div>
                                )}
                                <div className={styles.techItem}>
                                    <FaCodeBranch className={styles.techIcon} />
                                    <div>
                                        <strong>إصدار الدرس</strong>
                                        <span>v{lesson.version || 1}</span>
                                    </div>
                                </div>
                                <div className={styles.techItem}>
                                    <FaClock className={styles.techIcon} />
                                    <div>
                                        <strong>تم الإنشاء</strong>
                                        <span>{formatDate(lesson.created_at)}</span>
                                    </div>
                                </div>
                                <div className={styles.techItem}>
                                    <FaClock className={styles.techIcon} />
                                    <div>
                                        <strong>آخر تحديث</strong>
                                        <span>{formatDate(lesson.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* الإجراءات السريعة */}
                        <div className={styles.quickActionsGrid}>
                            <div
                                className={styles.quickAction}
                                onClick={() => navigate(`/lesson-index/${lesson.id}/`)}
                            >
                                <DiWindows className={styles.quickActionIcon} />
                                <h4>المحتوى التعليمي</h4>
                                <p>عرض وتعديل محتوى الدرس</p>
                                <span className={styles.quickActionCount}>
                                    {lesson.slides_count || 0} شريحة
                                </span>
                            </div>

                            <div
                                className={styles.quickAction}
                                onClick={() => navigate(`/lessons/${lesson.id}/reels`)}
                            >
                                <FaVideo className={styles.quickActionIcon} />
                                <h4>مقاطع الفيديو</h4>
                                <p>إدارة مقاطع الريلز التعليمية</p>
                                <span className={styles.quickActionCount}>
                                    {lesson.reels_count || 0} ريل
                                </span>
                            </div>

                            <div
                                className={styles.quickAction}
                                onClick={() => navigate(`/lessons/${lesson.id}/analytics`)}
                            >
                                <FaChartBar className={styles.quickActionIcon} />
                                <h4>التقارير</h4>
                                <p>عرض إحصائيات وتقارير الدرس</p>
                            </div>

                            <div
                                className={styles.quickAction}
                                onClick={() => navigate(`/content/${lesson.id}/`)}
                            >
                                <FaEdit className={styles.quickActionIcon} />
                                <h4>محرر متقدم</h4>
                                <p>الوصول إلى المحرر المتقدم للدرس</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const CreateLessonButton = () => {
        const designSettings = course ? {
            primaryColor: course.primary_color || '#667eea',
            secondaryColor: course.secondary_color || '#764ba2',
        } : {};

        return (
            <button
                className={styles.createLessonBtn}
                style={{
                    '--primary-color': designSettings.primaryColor,
                    '--secondary-color': designSettings.secondaryColor,
                }}
                onClick={handleCreateLesson}
            >
                <FaPlus />
                إنشاء درس جديد
            </button>
        );
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل الدروس...</p>
            </div>
        );
    }

    return (
        <div className={styles.lessonListContainer}>
            {/* رأس الصفحة */}
            <div className={styles.headerSection}>
                <div className={styles.headerContent}>
                    <div className={styles.titleSection}>
                        <button
                            className={styles.backButton}
                            onClick={handleGoBack}
                            title="العودة للصفحة السابقة"
                        >
                            <FaArrowRight className={styles.backIcon} />
                        </button>
                        <FaBook className={styles.headerIcon} />
                        <div>
                            <h1 className={styles.mainTitle}>
                                {course?.name || "دروس الكورس"}
                            </h1>
                            <p className={styles.subtitle}>
                                {course?.stage?.name} - {course?.grade?.name} - {course?.subject?.name}
                            </p>
                            <p className={styles.courseDescription}>
                                إدارة وتنظيم الدروس التعليمية للكورس
                            </p>
                        </div>
                    </div>
                    <div className={styles.statsSection}>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{lessons.length}</span>
                            <span className={styles.statLabel}>درس متاح</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>
                                {lessons.reduce((total, lesson) => {
                                    const objectives = lesson.info?.الأهداف || [];
                                    return total + objectives.length;
                                }, 0)}
                            </span>
                            <span className={styles.statLabel}>هدف تعليمي</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>
                                {lessons.filter(lesson => lesson.review_status === 'approved').length}
                            </span>
                            <span className={styles.statLabel}>درس معتمد</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>
                                {lessons.reduce((total, lesson) => total + (lesson.slides_count || 0), 0)}
                            </span>
                            <span className={styles.statLabel}>شريحة</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* شريط البحث والإجراءات */}
            <div className={styles.actionsSection}>
                <div className={styles.searchContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="ابحث في الدروس حسب العنوان، الملخص، النوع، أو نموذج الذكاء الاصطناعي..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <CreateLessonButton />
            </div>

            {/* قائمة الدروس */}
            <div className={styles.lessonsList}>
                {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson, index) => (
                        <LessonItem key={lesson.id} lesson={lesson} index={index} />
                    ))
                ) : searchTerm ? (
                    <div className={styles.noResults}>
                        <FaSearch className={styles.noResultsIcon} />
                        <h3>لا توجد نتائج</h3>
                        <p>لم نتمكن من العثور على دروس تطابق "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <FaBook className={styles.emptyIcon} />
                        <h2>لا توجد دروس بعد</h2>
                        <p>ابدأ بإنشاء أول درس في هذا الكورس</p>
                        <CreateLessonButton />
                    </div>
                )}
            </div>

            {/* قسم التحليلات */}
            {lessons.length > 0 && (
                <div className={styles.analyticsSection}>
                    <div className={styles.analyticsHeader}>
                        <FaChartBar className={styles.analyticsIcon} />
                        <h3>نظرة عامة على الدروس</h3>
                    </div>

                    <div className={styles.analyticsGrid}>
                        <div className={styles.analyticsCard}>
                            <span className={styles.analyticsNumber}>
                                {lessons.filter(lesson => lesson.ai_model).length}
                            </span>
                            <span className={styles.analyticsLabel}>درس بالذكاء الاصطناعي</span>
                        </div>
                        <div className={styles.analyticsCard}>
                            <span className={styles.analyticsNumber}>
                                {[...new Set(lessons.map(lesson => lesson.info?.نوع_الدرس).filter(Boolean))].length}
                            </span>
                            <span className={styles.analyticsLabel}>نوع مختلف</span>
                        </div>
                        <div className={styles.analyticsCard}>
                            <span className={styles.analyticsNumber}>
                                {lessons.reduce((total, lesson) => {
                                    const objectives = lesson.info?.الأهداف || [];
                                    return total + objectives.length;
                                }, 0)}
                            </span>
                            <span className={styles.analyticsLabel}>هدف تعليمي</span>
                        </div>
                        <div className={styles.analyticsCard}>
                            <span className={styles.analyticsNumber}>
                                {lessons.reduce((total, lesson) => total + (lesson.reels_count || 0), 0)}
                            </span>
                            <span className={styles.analyticsLabel}>ريل إجمالي</span>
                        </div>
                    </div>

                    <div className={styles.reviewAnalytics}>
                        <h4>حالة مراجعة الدروس:</h4>
                        <div className={styles.reviewStats}>
                            <div className={styles.reviewStat}>
                                <span className={styles.reviewCount}>
                                    {lessons.filter(l => l.review_status === 'approved').length}
                                </span>
                                <span className={styles.reviewLabel}>معتمد</span>
                            </div>
                            <div className={styles.reviewStat}>
                                <span className={styles.reviewCount}>
                                    {lessons.filter(l => l.review_status === 'pending').length}
                                </span>
                                <span className={styles.reviewLabel}>قيد المراجعة</span>
                            </div>
                            <div className={styles.reviewStat}>
                                <span className={styles.reviewCount}>
                                    {lessons.filter(l => l.review_status === 'rejected').length}
                                </span>
                                <span className={styles.reviewLabel}>مرفوض</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.techAnalytics}>
                        <h4>إحصائيات تقنية:</h4>
                        <div className={styles.techStats}>
                            <div className={styles.techStat}>
                                <span className={styles.techCount}>
                                    {[...new Set(lessons.map(lesson => lesson.ai_model).filter(Boolean))].length}
                                </span>
                                <span className={styles.techLabel}>نموذج ذكاء اصطناعي مختلف</span>
                            </div>
                            <div className={styles.techStat}>
                                <span className={styles.techCount}>
                                    {Math.max(...lessons.map(lesson => lesson.version || 1))}
                                </span>
                                <span className={styles.techLabel}>أعلى إصدار</span>
                            </div>
                            <div className={styles.techStat}>
                                <span className={styles.techCount}>
                                    {lessons.filter(lesson => lesson.reviewed_by).length}
                                </span>
                                <span className={styles.techLabel}>تمت مراجعته</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال إنشاء/تعديل الدرس */}
            <LessonModal
                isOpen={isLessonModalOpen}
                onClose={() => setIsLessonModalOpen(false)}
                onSave={handleSaveLesson}
                lesson={selectedLesson}
                mode={modalMode}
                course={course}
            />

            {/* مودال تأكيد الحذف */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setLessonToDelete(null);
                }}
                onConfirm={confirmDeleteLesson}
                title="تأكيد الحذف"
                message={`هل أنت متأكد من رغبتك في حذف الدرس "${lessonToDelete?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
                confirmText="حذف"
                cancelText="إلغاء"
                type="danger"
            />
        </div>
    );
};

export default LessonList;