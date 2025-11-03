
import React from 'react';
import { FaArrowRight, FaEdit, FaGraduationCap, FaPalette, FaTrash } from 'react-icons/fa';
import styles from './CourseCard.module.css';

const CourseCard = ({ course, onEdit, onDelete, onViewLessons }) => {
    const designSettings = {
        primaryColor: course.primary_color || '#667eea',
        secondaryColor: course.secondary_color || '#764ba2',
        backgroundColor: course.background_color || '#FFFFFF',
        mainFont: course.main_font || 'Cairo',
        descFont: course.desc_font || 'Tajawal',
        borderRadius: course.border_radius || 16,
        padding: course.padding || 12
    };

    return (
        <div
            className={styles.card}
            style={{
                '--primary-color': designSettings.primaryColor,
                '--secondary-color': designSettings.secondaryColor,
                '--background-color': designSettings.backgroundColor,
                '--border-radius': `${designSettings.borderRadius}px`,
                '--main-font': designSettings.mainFont,
                '--desc-font': designSettings.descFont
            }}
        >
            {/* شريط العلوي */}
            <div className={styles.topBar}>
                <span className={styles.version}>الإصدار {course.version}</span>
                <div className={styles.actions}>
                    <button
                        className={styles.editBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(course);
                        }}
                        title="تعديل الكورس"
                    >
                        <FaEdit />
                    </button>
                    <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(course.id);
                        }}
                        title="حذف الكورس"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            {/* المحتوى الرئيسي */}
            <div className={styles.content}>
                <div className={styles.courseHeader}>
                    <div className={styles.courseIcon}>
                        <FaGraduationCap />
                    </div>
                    <div className={styles.courseInfo}>
                        <h3 className={styles.title}>{course.name}</h3>
                        <div className={styles.categoryPath}>
                            <span>{course.stage_name}</span>
                            <span className={styles.pathSeparator}>→</span>
                            <span>{course.grade_name}</span>
                            <span className={styles.pathSeparator}>→</span>
                            <span>{course.program_name}</span>
                            <span className={styles.pathSeparator}>→</span>
                            <span>{course.subject_name}</span>
                        </div>
                    </div>
                </div>

                {/* معاينة التصميم */}
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
                    </div>
                    <div className={styles.fontInfo}>
                        <span className={styles.fontBadge} style={{ fontFamily: designSettings.mainFont }}>
                            {designSettings.mainFont}
                        </span>
                    </div>
                </div>
            </div>

            {/* التذييل */}
            <div className={styles.footer}>
                <div className={styles.designSpecs}>
                    <span className={styles.specItem}>
                        <FaPalette className={styles.specIcon} />
                        نصف قطر: {designSettings.borderRadius}px
                    </span>
                </div>
                <button
                    className={styles.viewButton}
                    onClick={onViewLessons}
                >
                    <span>عرض الدروس</span>
                    <FaArrowRight className={styles.arrowIcon} />
                </button>
            </div>
        </div>
    );
};

export default CourseCard;