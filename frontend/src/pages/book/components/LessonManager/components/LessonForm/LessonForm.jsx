
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createLesson, updateLesson } from '../../../../../../api/books';
import styles from './LessonForm.module.css';

const LessonForm = ({ partId, lesson, isEdit = false, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        title: lesson?.title || '',
        start_page: lesson?.start_page || '',
        end_page: lesson?.end_page || '',
        order: lesson?.order ?? 0
    });

    const handleSubmit = async () => {
        if (!data.title.trim()) return alert('العنوان مطلوب');
        if (!data.start_page || !data.end_page) return alert('الصفحات مطلوبة');
        if (data.start_page >= data.end_page) return alert('صفحة البداية يجب أن تكون أقل من النهاية');

        setLoading(true);
        try {
            const payload = {
                ...data,
                part: partId // مهم لإرسال الجزء المرتبط بالدرس
            };

            if (isEdit) {
                await updateLesson(lesson.id, payload);
            } else {
                await createLesson(payload);
            }

            onSuccess?.();
        } catch (error) {
            console.error('LessonForm error:', error);
            alert('حدث خطأ أثناء حفظ الدرس');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.form}>
            <div className={styles.header}>
                <h3>{isEdit ? 'تعديل الدرس' : 'إضافة درس جديد'}</h3>
                <button onClick={onCancel} className={styles.close} disabled={loading}>
                    <FaTimes />
                </button>
            </div>

            <div className={styles.body}>
                <div className={styles.field}>
                    <label>عنوان الدرس *</label>
                    <input
                        value={data.title}
                        onChange={e => setData({ ...data, title: e.target.value })}
                        placeholder="مثال: مقدمة في الجبر"
                        disabled={loading}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>من الصفحة *</label>
                        <input
                            type="number"
                            value={data.start_page}
                            onChange={e => setData({ ...data, start_page: e.target.value })}
                            min="1"
                            disabled={loading}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>إلى الصفحة *</label>
                        <input
                            type="number"
                            value={data.end_page}
                            onChange={e => setData({ ...data, end_page: e.target.value })}
                            min={data.start_page || 1}
                            disabled={loading}
                        />
                    </div>
                </div>

                {!isEdit && (
                    <div className={styles.field}>
                        <label>الترتيب (اختياري)</label>
                        <input
                            type="number"
                            value={data.order}
                            onChange={e => setData({ ...data, order: e.target.value })}
                            min="0"
                            placeholder="يُضاف في النهاية"
                            disabled={loading}
                        />
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <button onClick={onCancel} disabled={loading} className={styles.cancel}>
                    إلغاء
                </button>
                <button onClick={handleSubmit} disabled={loading} className={styles.save}>
                    {loading ? 'جاري...' : (isEdit ? 'حفظ' : 'إضافة')}
                </button>
            </div>
        </div>
    );
};

export default LessonForm;