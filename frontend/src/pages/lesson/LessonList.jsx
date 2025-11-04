import React, { useEffect, useState } from "react";
import { DiWindows } from "react-icons/di";
import {
    FaBook,
    FaBullseye,
    FaChartBar,
    FaCheckCircle,
    FaChevronDown,
    FaChevronUp,
    FaClock,
    FaEdit,
    FaGraduationCap,
    FaHourglassHalf,
    FaPlus,
    FaSearch,
    FaTasks,
    FaTimesCircle,
    FaUserGraduate,
    FaVideo
} from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../../api/courses";
import { getLessonsByCourse } from "../../api/lessons";
import styles from './LessonList.module.css'; // تأكد من هذا الاستيراد

const LessonList = () => {
    const { courseId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedLessons, setExpandedLessons] = useState({});
    const navigate = useNavigate();

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

    const toggleLessonExpansion = (lessonId) => {
        setExpandedLessons(prev => ({
            ...prev,
            [lessonId]: !prev[lessonId]
        }));
    };

    const filteredLessons = lessons.filter(lesson =>
        lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.info?.نوع_الدرس?.toLowerCase().includes(searchTerm.toLowerCase())
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
                            </div>
                            <div className={styles.lessonActions}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/lessons/${lesson.id}/editor`);
                                    }}
                                >
                                    <FaEdit />
                                    محرر
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
                        </div>

                        {/* معلومات الذكاء الاصطناعي */}
                        {lesson.ai_model && (
                            <div className={styles.aiInfo}>
                                <div className={styles.aiInfoContent}>
                                    <span className={styles.aiModel}>
                                        <FaTasks />
                                        تم إنشاؤه بواسطة: {lesson.ai_model}
                                    </span>
                                    {lesson.prompt_version && (
                                        <span className={styles.promptVersion}>
                                            إصدار النموذج: {lesson.prompt_version}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
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
                onClick={() => navigate(`/courses/${courseId}/lessons/create`)}
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
                        placeholder="ابحث في الدروس حسب العنوان، الملخص، أو النوع..."
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
                </div>
            )}
        </div>
    );
};

export default LessonList;