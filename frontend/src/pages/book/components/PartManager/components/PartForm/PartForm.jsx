
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createPart, updatePart } from '../../../../../../api/parts';
import styles from './PartForm.module.css';

const PartForm = ({ bookId, part, isEdit = false, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        title: part?.title || '',
        start_page: part?.start_page || '',
        end_page: part?.end_page || '',
        order: part?.order ?? 0,
        book: bookId,

    });

    const handleSubmit = async () => {
        if (!data.title.trim()) return alert('العنوان مطلوب');
        if (!data.start_page || !data.end_page) return alert('الصفحات مطلوبة');
        if (data.start_page >= data.end_page) return alert('صفحة البداية يجب أن تكون أقل من النهاية');

        setLoading(true);
        try {
            if (isEdit) {
                await updatePart(part.id, data);
            } else {
                await createPart(bookId, data);
            }
            onSuccess?.();
        } catch (error) {
            alert('حدث خطأ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.form}>
            <div className={styles.header}>
                <h3>{isEdit ? 'تعديل الجزء' : 'إضافة جزء جديد'}</h3>
                <button onClick={onCancel} className={styles.close} disabled={loading}>
                    <FaTimes />
                </button>
            </div>

            <div className={styles.body}>
                <div className={styles.field}>
                    <label>عنوان الجزء *</label>
                    <input
                        value={data.title}
                        onChange={e => setData({ ...data, title: e.target.value })}
                        placeholder="مثال: الفصل الأول"
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

export default PartForm;