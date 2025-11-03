
import React from 'react';
import { FaEdit, FaLink, FaTrash, FaUnlink } from 'react-icons/fa';
import styles from './LessonIndexCard.module.css';

const LessonIndexCard = ({ lesson, onEdit, onDelete }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3 className={styles.title}>{lesson.title}</h3>
                <div className={styles.actions}>
                    <button
                        className={styles.editBtn}
                        onClick={onEdit}
                        title="تعديل"
                    >
                        <FaEdit />
                    </button>
                    <button
                        className={styles.deleteBtn}
                        onClick={onDelete}
                        title="حذف"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            <div className={styles.categoryPath}>
                <span className={styles.pathItem}>{lesson.stage_title}</span>
                <span className={styles.pathSeparator}>→</span>
                <span className={styles.pathItem}>{lesson.grade_title}</span>
                <span className={styles.pathSeparator}>→</span>
                <span className={styles.pathItem}>{lesson.program_title}</span>
                <span className={styles.pathSeparator}>→</span>
                <span className={styles.pathItem}>{lesson.subject_title}</span>
            </div>

            <div className={styles.aiLessonStatus}>
                {lesson.ai_lesson ? (
                    <span className={styles.linked}>
                        <FaLink />
                        مرتبط بدرس AI: {lesson.ai_lesson_title}
                    </span>
                ) : (
                    <span className={styles.unlinked}>
                        <FaUnlink />
                        غير مرتبط بدرس AI
                    </span>
                )}
            </div>

            {lesson.embedding_vector && (
                <div className={styles.embeddingInfo}>
                    <span className={styles.embeddingBadge}>
                        متجه تضمين: {lesson.embedding_vector.length} بُعد
                    </span>
                </div>
            )}
        </div>
    );
};

export default LessonIndexCard;