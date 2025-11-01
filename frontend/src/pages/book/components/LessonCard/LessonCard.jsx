// src/components/BookList/LessonCard/LessonCard.jsx
import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import styles from './LessonCard.module.css';

const LessonCard = ({ lesson, onClick }) => {
    return (
        <div className={styles.lessonCard} onClick={() => onClick(lesson.id)}>
            <div className={styles.lessonHeader}>
                <div className={styles.lessonTitleSection}>
                    <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                    <div className={styles.lessonMeta}>
                        <span className={styles.lessonOrder}>الدرس {lesson.order + 1}</span>
                        <span className={styles.lessonPages}>
                            من الصفحة {lesson.start_page} إلى {lesson.end_page}
                        </span>
                    </div>
                </div>
                <div className={styles.lessonStats}>
                    <span className={styles.blocksCount}>{lesson.blocks?.length || 0} كتلة تعليمية</span>
                    <span className={styles.exercisesCount}>{lesson.exercises?.length || 0} تمرين</span>
                </div>
            </div>

            <div className={styles.lessonContent}>
                <div className={styles.lessonDescription}>
                    <p>هذا الدرس يغطي المحتوى من الصفحة {lesson.start_page} إلى الصفحة {lesson.end_page}</p>
                </div>
                <div className={styles.lessonActions}>
                    <div className={styles.ctaButton}>
                        <span>بدء الدراسة</span>
                        <FaArrowRight className={styles.arrowIcon} />
                    </div>
                </div>
            </div>

            <div className={styles.progressSection}>
                <div className={styles.progressInfo}>
                    <span>التقدم في الدرس</span>
                    <span>0% مكتمل</span>
                </div>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '0%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default LessonCard;