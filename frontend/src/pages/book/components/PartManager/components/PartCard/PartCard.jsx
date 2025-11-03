import React, { useState } from 'react';
import { FaEdit, FaExclamationTriangle, FaGraduationCap, FaTrash } from 'react-icons/fa';
import { deletePart } from '../../../../../../api/parts';
import PartForm from '../PartForm/PartForm';
import styles from './PartCard.module.css';

const PartCard = ({ part, bookId, onViewLessons, onUpdate }) => {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deletePart(part.id);
            onUpdate?.();
        } catch (error) {
            alert('فشل حذف الجزء');
        } finally {
            setDeleting(false);
            setShowDelete(false);
        }
    };

    return (
        <>
            <div className={styles.card}>
                {/* شريط العلوي */}
                <div className={styles.topBar}>
                    <span className={styles.order}>الجزء {part.order + 1}</span>
                    <div className={styles.actions}>
                        <button
                            className={styles.editBtn}
                            onClick={() => setShowEdit(true)}
                            aria-label="تعديل الجزء"
                        >
                            <FaEdit />
                        </button>
                        <button
                            className={styles.deleteBtn}
                            onClick={() => setShowDelete(true)}
                            aria-label="حذف الجزء"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>

                {/* المحتوى الرئيسي */}
                <div className={styles.content}>
                    <h3 className={styles.title}>{part.title}</h3>

                    <div className={styles.metaInfo}>
                        <div className={styles.pageRange}>
                            <span className={styles.pages}>
                                من الصفحة {part.start_page} إلى {part.end_page}
                            </span>
                        </div>

                        <div className={styles.lessonsCount}>
                            <span className={styles.lessons}>
                                {part.lessons?.length || 0} درس
                            </span>
                        </div>
                    </div>

                    <p className={styles.desc}>
                        يغطي هذا الجزء المحتوى التعليمي من الصفحة {part.start_page} إلى الصفحة {part.end_page}
                    </p>
                </div>

                {/* زر عرض الدروس */}
                <div className={styles.mainAction}>
                    <button className={styles.viewBtn} onClick={() => onViewLessons(part)}>
                        <FaGraduationCap />
                        <span>عرض الدروس</span>
                    </button>
                </div>
            </div>

            {/* نموذج التعديل */}
            {showEdit && (
                <div className={styles.modalOverlay} onClick={() => setShowEdit(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <PartForm
                            bookId={bookId}
                            part={part}
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
                            <h3>حذف الجزء؟</h3>
                        </div>
                        <div className={styles.deleteBody}>
                            <p>هل أنت متأكد من حذف <strong>"{part.title}"</strong>؟</p>
                            <p className={styles.warn}>سيتم حذف جميع الدروس المرتبطة به.</p>
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

export default PartCard;