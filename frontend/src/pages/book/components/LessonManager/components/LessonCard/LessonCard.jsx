import React, { useState } from 'react';
import { FaArrowRight, FaEdit, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { deleteLesson } from '../../../../../../api/lessons';
import LessonForm from '../LessonForm/LessonForm';
import styles from './LessonCard.module.css';

const LessonCard = ({ lesson, partId, onClick, onUpdate }) => {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteLesson(lesson.id);
            onUpdate?.();
        } catch (error) {
            alert('فشل حذف الدرس');
        } finally {
            setDeleting(false);
            setShowDelete(false);
        }
    };

    return (
        <>
            <div className={styles.card} onClick={() => onClick(lesson.id)}>
                {/* شريط العنوان العلوي */}
                <div className={styles.topBar}>
                    <span className={styles.order}>الدرس {lesson.order + 1}</span>
                    <div className={styles.actions}>
                        <button
                            className={styles.editBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEdit(true);
                            }}
                            aria-label="تعديل الدرس"
                        >
                            <FaEdit />
                        </button>
                        <button
                            className={styles.deleteBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDelete(true);
                            }}
                            aria-label="حذف الدرس"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>

                {/* المحتوى الرئيسي */}
                <div className={styles.content}>
                    <h3 className={styles.title}>{lesson.title}</h3>

                    <div className={styles.metaInfo}>
                        <div className={styles.pageRange}>
                            <span className={styles.pages}>
                                من الصفحة {lesson.start_page} إلى {lesson.end_page}
                            </span>
                        </div>

                        <div className={styles.stats}>
                            <span className={styles.blocks}>{lesson.blocks?.length || 0} كتلة</span>
                            <span className={styles.exercises}>{lesson.exercises?.length || 0} تمرين</span>
                        </div>
                    </div>

                    <p className={styles.desc}>
                        يغطي هذا الدرس المحتوى التعليمي من الصفحة {lesson.start_page} إلى الصفحة {lesson.end_page}
                    </p>
                </div>

                {/* زر البدء */}
                <div className={styles.cta}>
                    <span>بدء الدراسة</span>
                    <FaArrowRight className={styles.arrow} />
                </div>
            </div>

            {/* نموذج التعديل */}
            {showEdit && (
                <div className={styles.modalOverlay} onClick={() => setShowEdit(false)}>
                    <div onClick={e => e.stopPropagation()}>
                        <LessonForm
                            partId={partId}
                            lesson={lesson}
                            isEdit={true}
                            onSuccess={() => {
                                setShowEdit(false);
                                onUpdate?.();
                            }}
                            onCancel={() => setShowEdit(false)}
                        />
                    </div>
                </div>
            )}

            {/* تأكيد الحذف */}
            {showDelete && (
                <div className={styles.deleteOverlay} onClick={() => setShowDelete(false)}>
                    <div className={styles.deleteModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.deleteHeader}>
                            <FaExclamationTriangle className={styles.warnIcon} />
                            <h3>حذف الدرس؟</h3>
                        </div>
                        <div className={styles.deleteBody}>
                            <p>هل أنت متأكد من حذف <strong>"{lesson.title}"</strong>؟</p>
                            <p className={styles.warn}>سيتم حذف جميع الكتل والتمارين المرتبطة به.</p>
                        </div>
                        <div className={styles.deleteActions}>
                            <button
                                onClick={() => setShowDelete(false)}
                                disabled={deleting}
                                className={styles.cancelBtn}
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className={styles.dangerBtn}
                            >
                                {deleting ? 'جاري...' : 'حذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LessonCard;