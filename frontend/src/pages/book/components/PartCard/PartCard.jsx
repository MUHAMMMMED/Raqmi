// src/components/BookList/PartCard/PartCard.jsx
import React, { useState } from 'react';
import { FaEdit, FaGraduationCap, FaSave, FaTimes, FaTrash } from 'react-icons/fa';

import { deletePart, updatePart } from '../../../../api/parts';
import styles from './PartCard.module.css';

const PartCard = ({ part, bookId, onViewLessons, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: part.title,
        order: part.order,
        start_page: part.start_page || '',
        end_page: part.end_page || ''
    });

    const handleUpdate = async () => {
        if (!formData.title.trim()) return;
        setLoading(true);
        try {
            const updated = await updatePart(part.id, formData);
            part.title = updated.title;
            part.order = updated.order;
            part.start_page = updated.start_page;
            part.end_page = updated.end_page;
            setIsEditing(false);
            onUpdate?.(); // تحديث القائمة
        } catch (error) {
            console.error('Error updating part:', error);
            alert('فشل في تحديث الجزء');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`هل أنت متأكد من حذف الجزء: "${part.title}"؟`)) return;
        setLoading(true);
        try {
            await deletePart(part.id);
            onUpdate?.(); // إعادة تحميل الكتب
        } catch (error) {
            console.error('Error deleting part:', error);
            alert('فشل في حذف الجزء');
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setFormData({
            title: part.title,
            order: part.order,
            start_page: part.start_page || '',
            end_page: part.end_page || ''
        });
    };

    return (
        <div className={styles.partCard}>
            {/* رأس البطاقة */}
            <div className={styles.partHeader}>
                <div className={styles.partTitleSection}>
                    {isEditing ? (
                        <input
                            className={styles.editInput}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            disabled={loading}
                        />
                    ) : (
                        <h3 className={styles.partTitle}>{part.title}</h3>
                    )}

                    <div className={styles.partMeta}>
                        <span className={styles.partOrder}>الجزء {part.order + 1}</span>
                        {isEditing ? (
                            <>
                                <input
                                    type="number"
                                    className={styles.smallInput}
                                    value={formData.start_page}
                                    onChange={(e) => setFormData({ ...formData, start_page: e.target.value })}
                                    placeholder="من"
                                    disabled={loading}
                                />
                                <input
                                    type="number"
                                    className={styles.smallInput}
                                    value={formData.end_page}
                                    onChange={(e) => setFormData({ ...formData, end_page: e.target.value })}
                                    placeholder="إلى"
                                    disabled={loading}
                                />
                            </>
                        ) : (
                            <span className={styles.partPages}>
                                من الصفحة {part.start_page} إلى {part.end_page}
                            </span>
                        )}
                    </div>
                </div>

                <div className={styles.partStats}>
                    <span className={styles.lessonsCount}>
                        {part.lessons?.length || 0} درس متاح
                    </span>
                </div>
            </div>

            {/* محتوى البطاقة */}
            <div className={styles.partContent}>
                <div className={styles.partDescription}>
                    <p>
                        {isEditing
                            ? 'قم بتحديث بيانات الجزء ثم اضغط حفظ'
                            : `هذا الجزء يحتوي على الدروس التعليمية من الصفحة ${part.start_page} إلى الصفحة ${part.end_page}`}
                    </p>
                </div>

                <div className={styles.partActions}>
                    {isEditing ? (
                        <>
                            <button
                                className={styles.saveButton}
                                onClick={handleUpdate}
                                disabled={loading || !formData.title.trim()}
                            >
                                <FaSave className={styles.buttonIcon} />
                                حفظ
                            </button>
                            <button className={styles.cancelButton} onClick={cancelEdit} disabled={loading}>
                                <FaTimes className={styles.buttonIcon} />
                                إلغاء
                            </button>
                        </>
                    ) : (
                        <>
                            <button className={styles.primaryButton} onClick={() => onViewLessons(part)}>
                                <FaGraduationCap className={styles.buttonIcon} />
                                عرض الدروس
                            </button>
                            <button className={styles.editButton} onClick={() => setIsEditing(true)} disabled={loading}>
                                <FaEdit className={styles.buttonIcon} />
                                تعديل
                            </button>
                            <button className={styles.deleteButton} onClick={handleDelete} disabled={loading}>
                                <FaTrash className={styles.buttonIcon} />
                                حذف
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* شريط التقدم */}
            <div className={styles.progressSection}>
                <div className={styles.progressInfo}>
                    <span>التقدم في الجزء</span>
                    <span>0% مكتمل</span>
                </div>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '0%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default PartCard;