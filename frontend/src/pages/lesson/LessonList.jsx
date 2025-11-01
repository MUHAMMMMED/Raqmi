// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import styles from './LessonList.module.css';

// import {
//     FaBook,
//     FaBullseye,
//     FaCheckCircle,
//     FaClock,
//     FaEdit,
//     FaGraduationCap,
//     FaHourglassHalf,
//     FaPlus,
//     FaSearch,
//     FaTasks,
//     FaTimesCircle,
//     FaUserGraduate
// } from 'react-icons/fa';
// import { getCourse } from "../../api/courses";
// import { getLessonsByCourse } from "../../api/lessons";
// const LessonList = () => {
//     const { courseId } = useParams();
//     const [lessons, setLessons] = useState([]);
//     const [course, setCourse] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState("");
//     const navigate = useNavigate();

//     useEffect(() => {
//         loadData();
//     }, [courseId]);

//     const loadData = async () => {
//         try {
//             setLoading(true);
//             const [lessonsData, courseData] = await Promise.all([
//                 getLessonsByCourse(courseId),
//                 getCourse(courseId)
//             ]);
//             setLessons(lessonsData);
//             setCourse(courseData);
//         } catch (error) {
//             console.error('Error loading data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const filteredLessons = lessons.filter(lesson =>
//         lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lesson.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lesson.info?.نوع_الدرس?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const getReviewStatusIcon = (status) => {
//         switch (status) {
//             case 'approved':
//                 return <FaCheckCircle className={styles.statusApproved} />;
//             case 'pending':
//                 return <FaHourglassHalf className={styles.statusPending} />;
//             case 'rejected':
//                 return <FaTimesCircle className={styles.statusRejected} />;
//             default:
//                 return <FaHourglassHalf className={styles.statusPending} />;
//         }
//     };

//     const getReviewStatusText = (status) => {
//         switch (status) {
//             case 'approved':
//                 return 'معتمد';
//             case 'pending':
//                 return 'قيد المراجعة';
//             case 'rejected':
//                 return 'مرفوض';
//             default:
//                 return 'قيد المراجعة';
//         }
//     };

//     const LessonCard = ({ lesson }) => {
//         const designSettings = course ? {
//             primaryColor: course.primary_color || '#1E90FF',
//             secondaryColor: course.secondary_color || '#FFD700',
//             backgroundColor: course.background_color || '#FFFFFF',
//             mainFont: course.main_font || 'Cairo',
//             descFont: course.desc_font || 'Tajawal',
//             borderRadius: course.border_radius || 16,
//             padding: course.padding || 12
//         } : {};

//         // استخراج المعلومات من حقل info
//         const lessonInfo = lesson.info || {};
//         const objectives = lessonInfo.الأهداف || [];
//         const duration = lessonInfo.مدة_التعلم || 'غير محدد';
//         const difficulty = lessonInfo.صعوبة || 'متوسطة';
//         const grade = lessonInfo.المستوى || course?.grade?.name || 'غير محدد';
//         const lessonType = lessonInfo.نوع_الدرس || 'عام';

//         return (
//             <div
//                 className={styles.lessonCard}
//                 style={{
//                     '--primary-color': designSettings.primaryColor,
//                     '--secondary-color': designSettings.secondaryColor,
//                     '--background-color': designSettings.backgroundColor,
//                     '--border-radius': `${designSettings.borderRadius}px`,
//                     '--padding': `${designSettings.padding}px`,
//                     '--main-font': designSettings.mainFont,
//                     '--desc-font': designSettings.descFont
//                 }}
//                 onClick={() => navigate(`/lessons/${lesson.id}/editor`)}
//             >
//                 <div className={styles.cardHeader}>
//                     <div className={styles.lessonIcon}>
//                         <FaBook />
//                     </div>
//                     <div className={styles.lessonInfo}>
//                         <div className={styles.lessonTitleSection}>
//                             <h3 className={styles.lessonTitle}>{lesson.title}</h3>
//                             <div className={styles.reviewStatus}>
//                                 {getReviewStatusIcon(lesson.review_status)}
//                                 <span className={`${styles.statusText} ${styles[lesson.review_status]}`}>
//                                     {getReviewStatusText(lesson.review_status)}
//                                 </span>
//                             </div>
//                         </div>

//                         {lesson.summary && (
//                             <p className={styles.lessonDescription}>
//                                 {lesson.summary.substring(0, 120)}...
//                             </p>
//                         )}

//                         {/* معلومات إضافية */}
//                         <div className={styles.lessonMeta}>
//                             <span className={styles.metaItem}>
//                                 <FaGraduationCap className={styles.metaIcon} />
//                                 {lessonType}
//                             </span>
//                             <span className={styles.metaItem}>
//                                 <FaUserGraduate className={styles.metaIcon} />
//                                 {grade}
//                             </span>
//                             <span className={styles.metaItem}>
//                                 <FaClock className={styles.metaIcon} />
//                                 {duration}
//                             </span>
//                             <span className={styles.metaItem}>
//                                 <FaTasks className={styles.metaIcon} />
//                                 {lesson.reels_count} ريل
//                             </span>
//                         </div>

//                         {/* الأهداف التعليمية */}
//                         {objectives.length > 0 && (
//                             <div className={styles.objectivesSection}>
//                                 <div className={styles.objectivesHeader}>
//                                     <FaBullseye className={styles.objectivesIcon} />
//                                     <span>الأهداف التعليمية:</span>
//                                 </div>
//                                 <div className={styles.objectivesList}>
//                                     {objectives.slice(0, 2).map((objective, index) => (
//                                         <span key={index} className={styles.objectiveTag}>
//                                             {objective}
//                                         </span>
//                                     ))}
//                                     {objectives.length > 2 && (
//                                         <span className={styles.moreObjectives}>
//                                             +{objectives.length - 2} أكثر
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>
//                         )}

//                         {/* معلومات الذكاء الاصطناعي */}
//                         {lesson.ai_model && (
//                             <div className={styles.aiInfo}>
//                                 <span className={styles.aiModel}>
//                                     تم إنشاؤه بواسطة: {lesson.ai_model}
//                                 </span>
//                                 {lesson.prompt_version && (
//                                     <span className={styles.promptVersion}>
//                                         الإصدار: {lesson.prompt_version}
//                                     </span>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className={styles.cardFooter}>
//                     <div className={styles.lessonStats}>
//                         <div className={styles.difficultyBadge}>
//                             <span className={`${styles.difficulty} ${styles[difficulty]}`}>
//                                 {difficulty === 'صعبة' ? 'صعبة' :
//                                     difficulty === 'متوسطة' ? 'متوسطة' : 'سهلة'}
//                             </span>
//                         </div>
//                         <div className={styles.versionInfo}>
//                             الإصدار: {lesson.version}
//                         </div>
//                     </div>
//                     <div className={styles.ctaButton}>
//                         <span>فتح المحرر</span>
//                         <FaEdit className={styles.arrowIcon} />
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const CreateLessonCard = () => {
//         const designSettings = course ? {
//             primaryColor: course.primary_color || '#1E90FF',
//             secondaryColor: course.secondary_color || '#FFD700',
//             backgroundColor: course.background_color || '#FFFFFF',
//             borderRadius: course.border_radius || 16,
//         } : {};

//         return (
//             <div
//                 className={styles.createLessonCard}
//                 style={{
//                     '--primary-color': designSettings.primaryColor,
//                     '--secondary-color': designSettings.secondaryColor,
//                     '--background-color': designSettings.backgroundColor,
//                     '--border-radius': `${designSettings.borderRadius}px`,
//                 }}
//                 onClick={() => navigate(`/courses/${courseId}/lessons/create`)}
//             >
//                 <div className={styles.createIcon}>
//                     <FaPlus />
//                 </div>
//                 <h3>إنشاء درس جديد</h3>
//                 <p>ابدأ في تصميم درس جديد من الصفر</p>
//             </div>
//         );
//     };

//     if (loading) {
//         return (
//             <div className={styles.loadingContainer}>
//                 <div className={styles.loadingSpinner}></div>
//                 <p>جاري تحميل الدروس...</p>
//             </div>
//         );
//     }

//     return (
//         <div className={styles.lessonListContainer}>
//             {/* رأس الصفحة */}
//             <div className={styles.headerSection}>
//                 <div className={styles.headerContent}>
//                     <div className={styles.titleSection}>
//                         <FaBook className={styles.headerIcon} />
//                         <div>
//                             <h1 className={styles.mainTitle}>
//                                 {course?.name || "دروس الكورس"}
//                             </h1>
//                             <p className={styles.subtitle}>
//                                 {course?.stage?.name} - {course?.grade?.name} - {course?.subject?.name}
//                             </p>
//                             <p className={styles.courseDescription}>
//                                 اختر درساً للبدء في التعلم أو التحرير
//                             </p>
//                         </div>
//                     </div>
//                     <div className={styles.statsSection}>
//                         <div className={styles.statCard}>
//                             <span className={styles.statNumber}>{lessons.length}</span>
//                             <span className={styles.statLabel}>درس متاح</span>
//                         </div>
//                         <div className={styles.statCard}>
//                             <span className={styles.statNumber}>
//                                 {lessons.reduce((total, lesson) => {
//                                     const objectives = lesson.info?.الأهداف || [];
//                                     return total + objectives.length;
//                                 }, 0)}
//                             </span>
//                             <span className={styles.statLabel}>هدف تعليمي</span>
//                         </div>
//                         <div className={styles.statCard}>
//                             <span className={styles.statNumber}>
//                                 {lessons.filter(lesson => lesson.review_status === 'approved').length}
//                             </span>
//                             <span className={styles.statLabel}>درس معتمد</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* شريط البحث */}
//                 <div className={styles.searchSection}>
//                     <div className={styles.searchContainer}>
//                         <FaSearch className={styles.searchIcon} />
//                         <input
//                             type="text"
//                             placeholder="ابحث في الدروس حسب العنوان، الملخص، أو النوع..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className={styles.searchInput}
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* شبكة الدروس */}
//             <div className={styles.lessonsGrid}>
//                 <CreateLessonCard />

//                 {filteredLessons.length > 0 ? (
//                     filteredLessons.map((lesson) => (
//                         <LessonCard key={lesson.id} lesson={lesson} />
//                     ))
//                 ) : searchTerm ? (
//                     <div className={styles.noResults}>
//                         <FaSearch className={styles.noResultsIcon} />
//                         <h3>لا توجد نتائج</h3>
//                         <p>لم نتمكن من العثور على دروس تطابق "{searchTerm}"</p>
//                     </div>
//                 ) : (
//                     <div className={styles.emptyState}>
//                         <FaBook className={styles.emptyIcon} />
//                         <h2>لا توجد دروس بعد</h2>
//                         <p>ابدأ بإنشاء أول درس في هذا الكورس</p>
//                     </div>
//                 )}
//             </div>

//             {/* ملخص تحليل الذكاء الاصطناعي */}
//             {lessons.length > 0 && (
//                 <div className={styles.aiAnalysisSection}>
//                     <div className={styles.analysisHeader}>
//                         <FaTasks className={styles.analysisIcon} />
//                         <h4>ملخص تحليل الذكاء الاصطناعي</h4>
//                     </div>
//                     <div className={styles.analysisGrid}>
//                         <div className={styles.analysisCard}>
//                             <span className={styles.analysisNumber}>
//                                 {lessons.filter(lesson => lesson.ai_model).length}
//                             </span>
//                             <span className={styles.analysisLabel}>درس تم إنشاؤه بالذكاء الاصطناعي</span>
//                         </div>
//                         <div className={styles.analysisCard}>
//                             <span className={styles.analysisNumber}>
//                                 {[...new Set(lessons.map(lesson => lesson.info?.نوع_الدرس).filter(Boolean))].length}
//                             </span>
//                             <span className={styles.analysisLabel}>نوع مختلف</span>
//                         </div>
//                         <div className={styles.analysisCard}>
//                             <span className={styles.analysisNumber}>
//                                 {lessons.reduce((total, lesson) => {
//                                     const objectives = lesson.info?.الأهداف || [];
//                                     return total + objectives.length;
//                                 }, 0)}
//                             </span>
//                             <span className={styles.analysisLabel}>هدف تعليمي</span>
//                         </div>
//                         <div className={styles.analysisCard}>
//                             <span className={styles.analysisNumber}>
//                                 {lessons.reduce((total, lesson) => total + lesson.reels_count, 0)}
//                             </span>
//                             <span className={styles.analysisLabel}>ريل إجمالي</span>
//                         </div>
//                     </div>

//                     {/* إحصائيات المراجعة */}
//                     <div className={styles.reviewStats}>
//                         <h5>حالة المراجعة:</h5>
//                         <div className={styles.reviewProgress}>
//                             <div className={styles.reviewStat}>
//                                 <span className={styles.reviewCount}>
//                                     {lessons.filter(l => l.review_status === 'approved').length}
//                                 </span>
//                                 <span className={styles.reviewLabel}>معتمد</span>
//                             </div>
//                             <div className={styles.reviewStat}>
//                                 <span className={styles.reviewCount}>
//                                     {lessons.filter(l => l.review_status === 'pending').length}
//                                 </span>
//                                 <span className={styles.reviewLabel}>قيد المراجعة</span>
//                             </div>
//                             <div className={styles.reviewStat}>
//                                 <span className={styles.reviewCount}>
//                                     {lessons.filter(l => l.review_status === 'rejected').length}
//                                 </span>
//                                 <span className={styles.reviewLabel}>مرفوض</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LessonList;




import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import styles from './LessonList.module.css';

import {
    FaBook,
    FaBullseye,
    FaCheckCircle,
    FaClock,
    FaEdit,
    FaGraduationCap,
    FaHourglassHalf,
    FaLayerGroup,
    FaPlus,
    FaSearch,
    FaTasks,
    FaTimesCircle,
    FaUserGraduate,
    FaVideo
} from 'react-icons/fa';
import { getCourse } from "../../api/courses";
import { getLessonsByCourse } from "../../api/lessons";

const LessonList = () => {
    const { courseId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
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

    const LessonCard = ({ lesson, index }) => {
        const designSettings = course ? {
            primaryColor: course.primary_color || '#1E90FF',
            secondaryColor: course.secondary_color || '#FFD700',
            backgroundColor: course.background_color || '#FFFFFF',
            mainFont: course.main_font || 'Cairo',
            descFont: course.desc_font || 'Tajawal',
            borderRadius: course.border_radius || 16,
            padding: course.padding || 12
        } : {};

        const lessonInfo = lesson.info || {};
        const objectives = lessonInfo.الأهداف || [];
        const duration = lessonInfo.مدة_التعلم || 'غير محدد';
        const difficulty = lessonInfo.صعوبة || 'متوسطة';
        const grade = lessonInfo.المستوى || course?.grade?.name || 'غير محدد';
        const lessonType = lessonInfo.نوع_الدرس || 'عام';

        return (
            <div
                className={styles.lessonCard}
                style={{
                    '--primary-color': designSettings.primaryColor,
                    '--secondary-color': designSettings.secondaryColor,
                    '--background-color': designSettings.backgroundColor,
                    '--border-radius': `${designSettings.borderRadius}px`,
                    '--padding': `${designSettings.padding}px`,
                    '--main-font': designSettings.mainFont,
                    '--desc-font': designSettings.descFont
                }}
            >
                <div className={styles.cardHeader}>
                    <div className={styles.lessonIcon}>
                        <FaBook />
                    </div>
                    <div className={styles.lessonInfo}>
                        <div className={styles.lessonTitleSection}>
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
                                {lesson.summary.substring(0, 120)}...
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
                                {lesson.reels_count} ريل
                            </span>
                        </div>

                        {objectives.length > 0 && (
                            <div className={styles.objectivesSection}>
                                <div className={styles.objectivesHeader}>
                                    <FaBullseye className={styles.objectivesIcon} />
                                    <span>الأهداف التعليمية:</span>
                                </div>
                                <div className={styles.objectivesList}>
                                    {objectives.slice(0, 2).map((objective, index) => (
                                        <span key={index} className={styles.objectiveTag}>
                                            {objective}
                                        </span>
                                    ))}
                                    {objectives.length > 2 && (
                                        <span className={styles.moreObjectives}>
                                            +{objectives.length - 2} أكثر
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {lesson.ai_model && (
                            <div className={styles.aiInfo}>
                                <span className={styles.aiModel}>
                                    تم إنشاؤه بواسطة: {lesson.ai_model}
                                </span>
                                {lesson.prompt_version && (
                                    <span className={styles.promptVersion}>
                                        الإصدار: {lesson.prompt_version}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* الكروت السريعة */}
                <div className={styles.quickActions}>
                    <div
                        className={styles.actionCard}
                        onClick={() => navigate(`/lessons/${lesson.id}/cards`)}
                    >
                        <div className={styles.actionIcon}>
                            <FaBook />
                        </div>
                        <div className={styles.actionInfo}>
                            <h4>البطاقات التعليمية</h4>
                            <p>إدارة البطاقات والاختبارات</p>
                            <span className={styles.actionCount}>
                                {lesson.cards_count || 0} بطاقة
                            </span>
                        </div>
                    </div>

                    <div
                        className={styles.actionCard}
                        onClick={() => navigate(`/lessons/${lesson.id}/slides`)}
                    >
                        <div className={styles.actionIcon}>
                            <FaLayerGroup />
                        </div>
                        <div className={styles.actionInfo}>
                            <h4>الشرائح</h4>
                            <p>عرض وتعديل شرائح الدرس</p>
                            <span className={styles.actionCount}>
                                {lesson.slides_count || 0} شريحة
                            </span>
                        </div>
                    </div>

                    <div
                        className={styles.actionCard}
                        onClick={() => navigate(`/lessons/${lesson.id}/reels`)}
                    >
                        <div className={styles.actionIcon}>
                            <FaVideo />
                        </div>
                        <div className={styles.actionInfo}>
                            <h4>الريلز</h4>
                            <p>إدارة مقاطع الفيديو التعليمية</p>
                            <span className={styles.actionCount}>
                                {lesson.reels_count || 0} ريل
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.lessonStats}>
                        <div className={styles.difficultyBadge}>
                            <span className={`${styles.difficulty} ${styles[difficulty]}`}>
                                {difficulty === 'صعبة' ? 'صعبة' :
                                    difficulty === 'متوسطة' ? 'متوسطة' : 'سهلة'}
                            </span>
                        </div>
                        <div className={styles.versionInfo}>
                            الإصدار: {lesson.version}
                        </div>
                    </div>
                    <div
                        className={styles.ctaButton}
                        onClick={() => navigate(`/lessons/${lesson.id}/editor`)}
                    >
                        <span>فتح المحرر</span>
                        <FaEdit className={styles.arrowIcon} />
                    </div>
                </div>
            </div>
        );
    };

    const CreateLessonCard = () => {
        const designSettings = course ? {
            primaryColor: course.primary_color || '#1E90FF',
            secondaryColor: course.secondary_color || '#FFD700',
            backgroundColor: course.background_color || '#FFFFFF',
            borderRadius: course.border_radius || 16,
        } : {};

        return (
            <div
                className={styles.createLessonCard}
                style={{
                    '--primary-color': designSettings.primaryColor,
                    '--secondary-color': designSettings.secondaryColor,
                    '--background-color': designSettings.backgroundColor,
                    '--border-radius': `${designSettings.borderRadius}px`,
                }}
                onClick={() => navigate(`/courses/${courseId}/lessons/create`)}
            >
                <div className={styles.createIcon}>
                    <FaPlus />
                </div>
                <h3>إنشاء درس جديد</h3>
                <p>ابدأ في تصميم درس جديد من الصفر</p>
            </div>
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
                                اختر درساً للبدء في التعلم أو التحرير
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
                    </div>
                </div>

                <div className={styles.searchSection}>
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
                </div>
            </div>

            <div className={styles.lessonsGrid}>
                <CreateLessonCard />

                {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson, index) => (
                        <LessonCard key={lesson.id} lesson={lesson} index={index} />
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
                    </div>
                )}
            </div>

            {lessons.length > 0 && (
                <div className={styles.aiAnalysisSection}>
                    <div className={styles.analysisHeader}>
                        <FaTasks className={styles.analysisIcon} />
                        <h4>ملخص تحليل الذكاء الاصطناعي</h4>
                    </div>
                    <div className={styles.analysisGrid}>
                        <div className={styles.analysisCard}>
                            <span className={styles.analysisNumber}>
                                {lessons.filter(lesson => lesson.ai_model).length}
                            </span>
                            <span className={styles.analysisLabel}>درس تم إنشاؤه بالذكاء الاصطناعي</span>
                        </div>
                        <div className={styles.analysisCard}>
                            <span className={styles.analysisNumber}>
                                {[...new Set(lessons.map(lesson => lesson.info?.نوع_الدرس).filter(Boolean))].length}
                            </span>
                            <span className={styles.analysisLabel}>نوع مختلف</span>
                        </div>
                        <div className={styles.analysisCard}>
                            <span className={styles.analysisNumber}>
                                {lessons.reduce((total, lesson) => {
                                    const objectives = lesson.info?.الأهداف || [];
                                    return total + objectives.length;
                                }, 0)}
                            </span>
                            <span className={styles.analysisLabel}>هدف تعليمي</span>
                        </div>
                        <div className={styles.analysisCard}>
                            <span className={styles.analysisNumber}>
                                {lessons.reduce((total, lesson) => total + lesson.reels_count, 0)}
                            </span>
                            <span className={styles.analysisLabel}>ريل إجمالي</span>
                        </div>
                    </div>

                    <div className={styles.reviewStats}>
                        <h5>حالة المراجعة:</h5>
                        <div className={styles.reviewProgress}>
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