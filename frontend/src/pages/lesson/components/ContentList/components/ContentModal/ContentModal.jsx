import React, { useEffect, useState } from 'react';
import { FaFile, FaSave, FaTimes } from 'react-icons/fa';
import styles from './ContentModal.module.css';

const ContentModal = ({ isOpen, onClose, onSave, content, mode, lessonId }) => {
    const [formData, setFormData] = useState({
        title: '',
        order: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (content && mode === 'edit') {
            setFormData({
                title: content.title || '',
                order: content.order || 0
            });
        } else {
            // Reset form for create mode
            setFormData({
                title: '',
                order: 0
            });
        }
    }, [content, mode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error saving content:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.titleSection}>
                        <FaFile className={styles.headerIcon} />
                        <h2>
                            {mode === 'create' ? 'إضافة محتوى جديد' : 'تعديل المحتوى'}
                        </h2>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>معلومات المحتوى</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>عنوان المحتوى *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="أدخل عنوان المحتوى التعليمي"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>ترتيب المحتوى</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleInputChange}
                                className={styles.input}
                                min="0"
                                placeholder="ترتيب العرض"
                            />
                            <small className={styles.helpText}>
                                سيتم ترتيب المحتويات بناءً على هذا الرقم (الأقل أولاً)
                            </small>
                        </div>
                    </div>

                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                            disabled={loading}
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={loading || !formData.title.trim()}
                        >
                            <FaSave />
                            {loading ? 'جاري الحفظ...' : (mode === 'create' ? 'إضافة المحتوى' : 'حفظ التغييرات')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContentModal;