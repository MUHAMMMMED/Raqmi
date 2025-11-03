
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './CourseList.module.css';

import {
    FaArrowRight,
    FaCalendar,
    FaEdit,
    FaGraduationCap,
    FaPalette,
    FaPlus,
    FaTrash,
    FaUpload
} from 'react-icons/fa';

import { deleteCourse, getCourses } from "../../api/courses";
import CourseForm from "./components/ CourseForm";
const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const response = await getCourses();
            setCourses(response.data);
        } catch (error) {
            console.error('Error loading courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setShowForm(true);
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
            try {
                await deleteCourse(courseId);
                loadCourses(); // إعادة تحميل القائمة
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('حدث خطأ أثناء حذف الكورس');
            }
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingCourse(null);
        loadCourses(); // إعادة تحميل القائمة
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingCourse(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const CourseCard = ({ course }) => {
        const designSettings = {
            primaryColor: course.primary_color || '#1E90FF',
            secondaryColor: course.secondary_color || '#FFD700',
            backgroundColor: course.background_color || '#FFFFFF',
            mainFont: course.main_font || 'Cairo',
            descFont: course.desc_font || 'Tajawal',
            borderRadius: course.border_radius || 16,
            padding: course.padding || 12
        };

        return (
            <div
                className={styles.courseCard}
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
                    <div className={styles.courseIcon}>
                        <FaGraduationCap />
                    </div>
                    <div className={styles.courseInfo}>
                        <h3 className={styles.courseTitle}>{course.name}</h3>
                        <div className={styles.courseMeta}>
                            <span className={styles.metaItem}>
                                <strong>المرحلة:</strong> {course.stage_name}
                            </span>
                            <span className={styles.metaItem}>
                                <strong>الصف:</strong> {course.grade_name}
                            </span>
                            <span className={styles.metaItem}>
                                <strong>المادة:</strong> {course.subject_name}
                            </span>
                        </div>
                        <div className={styles.metaInfo}>
                            <span className={styles.metaItem}>
                                <FaCalendar className={styles.metaIcon} />
                                الإصدار: {course.version}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.designPreview}>
                    <div className={styles.colorPalette}>
                        <div
                            className={styles.colorSample}
                            style={{ backgroundColor: designSettings.primaryColor }}
                            title={`اللون الأساسي: ${designSettings.primaryColor}`}
                        />
                        <div
                            className={styles.colorSample}
                            style={{ backgroundColor: designSettings.secondaryColor }}
                            title={`اللون الثانوي: ${designSettings.secondaryColor}`}
                        />
                        <div
                            className={styles.colorSample}
                            style={{ backgroundColor: designSettings.backgroundColor }}
                            title={`لون الخلفية: ${designSettings.backgroundColor}`}
                        />
                    </div>

                    <div className={styles.fontPreview}>
                        <div className={styles.fontSample}>
                            <span className={styles.mainFontSample} style={{ fontFamily: designSettings.mainFont }}>
                                {designSettings.mainFont}
                            </span>
                            <span className={styles.fontLabel}>العناوين</span>
                        </div>
                        <div className={styles.fontSample}>
                            <span className={styles.descFontSample} style={{ fontFamily: designSettings.descFont }}>
                                {designSettings.descFont}
                            </span>
                            <span className={styles.fontLabel}>النصوص</span>
                        </div>
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.designSpecs}>
                        <span className={styles.specItem}>
                            <FaPalette className={styles.specIcon} />
                            نصف قطر: {designSettings.borderRadius}px
                        </span>
                        <span className={styles.specItem}>
                            خطوط: {designSettings.mainFont}
                        </span>
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={styles.editButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(course);
                            }}
                            title="تعديل الكورس"
                        >
                            <FaEdit />
                        </button>
                        <button
                            className={styles.deleteButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(course.id);
                            }}
                            title="حذف الكورس"
                        >
                            <FaTrash />
                        </button>
                        <div
                            className={styles.ctaButton}
                            onClick={() => navigate(`/courses/${course.id}/lessons`)}



                        >
                            <span>عرض الدروس</span>
                            <FaArrowRight className={styles.arrowIcon} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل الكورسات...</p>
            </div>
        );
    }

    return (
        <div className={styles.courseListContainer}>
            <div className={styles.headerSection}>
                <div className={styles.headerContent}>
                    <div className={styles.titleSection}>
                        <FaGraduationCap className={styles.headerIcon} />
                        <div>
                            <h1 className={styles.mainTitle}>إدارة الكورسات التعليمية</h1>
                            <p className={styles.subtitle}>
                                قم بإدارة الكورسات وإنشاء تجارب تعليمية مخصصة
                            </p>
                        </div>
                    </div>
                    <div className={styles.statsSection}>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{courses.length}</span>
                            <span className={styles.statLabel}>كورس متاح</span>
                        </div>

                        <button
                            className={styles.addCourseButton}
                            onClick={() => setShowForm(true)}
                        >
                            <FaPlus className={styles.buttonIcon} />
                            إضافة كورس جديد
                        </button>
                    </div>
                </div>
            </div>

            {/* نافذة إضافة/تعديل الكورس */}
            {showForm && (
                <div className={styles.formModal}>
                    <div className={styles.modalContent}>
                        <CourseForm
                            course={editingCourse}
                            onSuccess={handleFormSuccess}
                            onCancel={handleFormCancel}
                        />
                    </div>
                    <div
                        className={styles.modalOverlay}
                        onClick={handleFormCancel}
                    />
                </div>
            )}

            {courses.length > 0 ? (
                <div className={styles.coursesGrid}>
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FaGraduationCap className={styles.emptyIcon} />
                    <h2>لا توجد كورسات متاحة</h2>
                    <p>ابدأ بإضافة كورس جديد إلى النظام</p>
                    <button
                        className={styles.addCourseButton}
                        onClick={() => setShowForm(true)}
                    >
                        <FaUpload className={styles.buttonIcon} />
                        إضافة الكورس الأول
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseList;