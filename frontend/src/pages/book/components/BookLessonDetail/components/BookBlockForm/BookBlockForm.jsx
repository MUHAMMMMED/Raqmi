

import React, { useEffect, useState } from 'react';
import styles from './BookBlockForm.module.css';

const BookBlockForm = ({ block, onSubmit, onCancel, lessonId }) => {
    const [formData, setFormData] = useState({
        order: 0,
        title: '',
        content: '',
        block_type: 'text',
        page_number: '',
        image: null,
        lesson: lessonId
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (block) {
            setFormData({
                order: block.order || 0,
                title: block.title || '',
                content: block.content || '',
                block_type: block.block_type || 'text',
                page_number: block.page_number || '',
                image: null,
                lesson: lessonId
            });

            if (block.image) {
                setImagePreview(block.image);
            }
        } else {
            // Reset form when creating new
            setFormData(prev => ({
                ...prev,
                order: 0,
                title: '',
                content: '',
                block_type: 'text',
                page_number: '',
                image: null,
                lesson: lessonId
            }));
            setImagePreview(null);
        }
    }, [block, lessonId]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            setFormData(prev => ({
                ...prev,
                image: file || null
            }));

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result);
                reader.readAsDataURL(file);
            } else {
                setImagePreview(block?.image || null);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // تحقق من وجود lessonId
        if (!formData.lesson) {
            alert("معرف الدرس مفقود! يرجى إعادة تحميل الصفحة.");
            return;
        }

        // تحقق من الحقول المطلوبة
        if (!formData.title.trim()) {
            alert("العنوان مطلوب.");
            return;
        }
        if (!formData.content.trim()) {
            alert("المحتوى مطلوب.");
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();

            submitData.append('order', parseInt(formData.order, 10) || 0);
            submitData.append('title', formData.title.trim());
            submitData.append('content', formData.content.trim());
            submitData.append('block_type', formData.block_type);
            submitData.append('lesson', formData.lesson);

            if (formData.page_number) {
                submitData.append('page_number', parseInt(formData.page_number, 10));
            }

            // فقط إذا كانت صورة جديدة (File object)
            if (formData.image instanceof File) {
                submitData.append('image', formData.image);
            }
            // لا ترسل image إذا لم يتم رفع صورة جديدة (حتى لو كانت موجودة سابقًا)

            await onSubmit(submitData);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert("حدث خطأ أثناء الحفظ. تحقق من البيانات.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const blockTypes = [
        { value: 'text', label: 'نص' },
        { value: 'image', label: 'صورة' },
        { value: 'table', label: 'جدول' },
        { value: 'example', label: 'مثال توضيحي' },
        { value: 'note', label: 'ملاحظة' }
    ];

    return (
        <div className={styles.formOverlay}>
            <div className={styles.formContainer}>
                <h3>{block ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}</h3>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>ترتيب العرض *</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>نوع المحتوى *</label>
                            <select
                                name="block_type"
                                value={formData.block_type}
                                onChange={handleChange}
                                required
                            >
                                {blockTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>العنوان *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength="500"
                            placeholder="أدخل عنوان المحتوى..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>المحتوى *</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows="6"
                            placeholder="أدخل المحتوى التعليمي هنا..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>رقم الصفحة</label>
                        <input
                            type="number"
                            name="page_number"
                            value={formData.page_number}
                            onChange={handleChange}
                            min="1"
                            placeholder="اختياري..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>صورة</label>
                        <div className={styles.imageUploadSection}>
                            {imagePreview ? (
                                <div className={styles.imagePreview}>
                                    <img src={imagePreview} alt="معاينة الصورة" />
                                    <button
                                        type="button"
                                        className={styles.removeImageButton}
                                        onClick={handleRemoveImage}
                                    >
                                        حذف الصورة
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.fileInputContainer}>
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleChange}
                                        accept="image/*"
                                        className={styles.fileInput}
                                    />
                                    <div className={styles.fileInputLabel}>
                                        <span>انقر لاختيار صورة أو اسحبها هنا</span>
                                        <small>يدعم الصور: JPG, PNG, GIF</small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={onCancel}
                            className={styles.cancelButton}
                            disabled={isSubmitting}
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'جاري الحفظ...' : (block ? 'تحديث' : 'إنشاء')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookBlockForm;