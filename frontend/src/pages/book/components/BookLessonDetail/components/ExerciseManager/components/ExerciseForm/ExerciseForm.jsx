
import React, { useEffect, useState } from 'react';
import { FaCheck, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import styles from './ExerciseForm.module.css';

const ExerciseForm = ({ exercise, onSubmit, onCancel, blockId, lessonId, partId }) => {
    const [formData, setFormData] = useState({
        question_text: '',
        question_type: 'mcq',
        options: [],
        correct_answer: '',
        explanation: '',
        order: 0,
        page_number: null,
        block: blockId ?? null,
        lesson: lessonId ?? null,
        part: partId ?? null,
    });

    const [optionInput, setOptionInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (exercise) {
            const opts = exercise.options
                ? Object.entries(exercise.options).map(([label, message]) => ({
                    label,
                    message,
                }))
                : [];

            setFormData({
                question_text: exercise.question_text || '',
                question_type: exercise.question_type || 'multiple_choice',
                order: exercise.order ?? 0,
                correct_answer: exercise.correct_answer || '',
                explanation: exercise.explanation || '',
                page_number: exercise.page_number ?? null,
                block: exercise.block || (blockId ?? null),
                lesson: exercise.lesson || (lessonId ?? null),
                part: exercise.part || (partId ?? null),
                options: Object.entries(exercise.options || {}).map(([label, message]) => ({
                    label,
                    message,
                })),
            });
        } else {
            setFormData(prev => ({
                ...prev,
                options: [],
                question_text: '',
                correct_answer: '',
                explanation: '',
                order: 0,
                page_number: null,
                block: blockId ?? null,
                lesson: lessonId ?? null,
                part: partId ?? null,
            }));
            setOptionInput('');
        }
    }, [exercise, blockId, lessonId, partId]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.question_text.trim()) newErrors.question_text = 'نص السؤال مطلوب';
        if (!formData.correct_answer && ['mcq', 'true_false', 'short_answer', 'essay'].includes(formData.question_type))
            newErrors.correct_answer = 'الإجابة الصحيحة مطلوبة';
        if (['mcq', 'true_false'].includes(formData.question_type) && formData.options.length === 0)
            newErrors.options = 'يجب إضافة خيارات على الأقل';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'order' || name === 'page_number') {
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? null : parseInt(value, 10),
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const addOption = () => {
        if (!optionInput.trim()) {
            setErrors(prev => ({ ...prev, options: 'نص الخيار مطلوب' }));
            return;
        }
        const nextLabel = String.fromCharCode(65 + formData.options.length);
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, { label: nextLabel, message: optionInput.trim() }],
        }));
        setOptionInput('');
        setErrors(prev => ({ ...prev, options: '' }));
    };

    const removeOption = (index) => {
        const newOptions = formData.options.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            options: newOptions,
            correct_answer:
                prev.correct_answer === prev.options[index]?.label ? '' : prev.correct_answer,
        }));
    };

    const toggleCorrect = (index) => {
        if (formData.question_type !== 'mcq') return;
        const label = formData.options[index].label;
        setFormData(prev => ({
            ...prev,
            correct_answer: prev.correct_answer === label ? '' : label,
        }));
        setErrors(prev => ({ ...prev, correct_answer: '' }));
    };

    const prepareFormData = () => {
        const data = {
            question_text: formData.question_text.trim(),
            question_type: formData.question_type,
            order: formData.order ?? 0,
            correct_answer: formData.correct_answer,
            explanation: formData.explanation || '',
            page_number: formData.page_number ?? null,
            block: blockId !== undefined ? blockId : null,
            lesson: lessonId !== undefined ? lessonId : null,
            part: partId !== undefined ? partId : null,
        };

        data.options = Object.fromEntries(
            (formData.options || []).map(opt => [opt.label, opt.message])
        );

        return data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert('يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
            return;
        }
        setIsSubmitting(true);
        try {
            const submitData = prepareFormData();
            console.log('جاري إرسال البيانات:', submitData);
            await onSubmit(submitData);
        } catch (err) {
            console.error('خطأ مفصل في الإرسال:', err);
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'حدث خطأ أثناء الحفظ';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (formData.question_type === 'true_false' && formData.options.length === 0) {
            setFormData(prev => ({
                ...prev,
                options: [
                    { label: 'A', message: 'صح' },
                    { label: 'B', message: 'خطأ' },
                ],
            }));
        }
    }, [formData.question_type]);

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <div className={styles.headerContent}>
                        <h2>{exercise ? 'تعديل التمرين' : 'إضافة تمرين جديد'}</h2>
                        <p>املأ جميع الحقول المطلوبة</p>
                    </div>
                    <button type="button" className={styles.closeButton} onClick={onCancel}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.formBody}>
                    {/* === معلومات السؤال === */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h3>معلومات السؤال</h3>
                        </div>

                        <div className={styles.formGroup}>
                            <label>نوع السؤال</label>
                            <select
                                name="question_type"
                                value={formData.question_type}
                                onChange={handleChange}
                                className={styles.selectInput}
                                required
                            >
                                <option value="mcq">اختيار من متعدد</option>
                                <option value="true_false">صح أو خطأ</option>
                                <option value="short_answer">إجابة قصيرة</option>
                                <option value="essay">مقال</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>نص السؤال</label>
                            <textarea
                                name="question_text"
                                value={formData.question_text}
                                onChange={handleChange}
                                className={`${styles.textareaInput} ${errors.question_text ? styles.error : ''}`}
                                rows="3"
                                placeholder="أدخل نص السؤال هنا..."
                            />
                            {errors.question_text && <span className={styles.errorText}>{errors.question_text}</span>}
                        </div>
                    </div>

                    {/* === الخيارات === */}
                    {['mcq', 'true_false'].includes(formData.question_type) && (
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <h3>الخيارات</h3>
                            </div>

                            {formData.question_type === 'mcq' && (
                                <>
                                    <div className={styles.optionsInput}>
                                        <input
                                            type="text"
                                            value={optionInput}
                                            onChange={(e) => setOptionInput(e.target.value)}
                                            placeholder="أدخل خيارًا جديدًا..."
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                                            className={`${styles.textInput} ${errors.options ? styles.error : ''}`}
                                        />
                                        <button type="button" onClick={addOption} className={styles.addOptionButton}>
                                            <FaPlus /> إضافة
                                        </button>
                                    </div>
                                    {errors.options && <span className={styles.errorText}>{errors.options}</span>}
                                </>
                            )}

                            <div className={styles.optionsList}>
                                {formData.options.map((opt, i) => (
                                    <div
                                        key={i}
                                        className={`${styles.optionItem} ${formData.correct_answer === opt.label ? styles.correct : ''}`}
                                    >

                                        {/* الأزرار في أقصى الشمال */}
                                        <div className={styles.optionActions}>
                                            <button
                                                type="button"
                                                onClick={() => toggleCorrect(i)}
                                                className={`${styles.correctToggle} ${formData.correct_answer === opt.label ? styles.correct : ''}`}
                                                title="تحديد كإجابة صحيحة"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeOption(i)}
                                                className={styles.removeOption}
                                                title="حذف الخيار"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>

                                        {/* المحتوى في أقصى اليمين */}
                                        <div className={styles.optionContent}>
                                            <span className={styles.optionLabel}>{opt.label}</span>
                                            <span className={styles.optionText}>{opt.message}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {formData.question_type === 'true_false' && (
                                <p className={styles.infoText}>سيتم استخدام خيارات "صح" و"خطأ" تلقائياً</p>
                            )}
                        </div>
                    )}

                    {/* === الإجابة والتفسير === */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h3>الإجابة والتفسير</h3>
                        </div>

                        <div className={styles.formGroup}>
                            <label>الإجابة الصحيحة</label>
                            {formData.question_type === 'true_false' ? (
                                <select
                                    name="correct_answer"
                                    value={formData.correct_answer}
                                    onChange={handleChange}
                                    className={`${styles.selectInput} ${errors.correct_answer ? styles.error : ''}`}
                                >
                                    <option value="">-- اختر الإجابة الصحيحة --</option>
                                    <option value="A">صح</option>
                                    <option value="B">خطأ</option>
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="correct_answer"
                                    value={formData.correct_answer}
                                    onChange={handleChange}
                                    className={`${styles.textInput} ${errors.correct_answer ? styles.error : ''}`}
                                    placeholder="أدخل الإجابة النموذجية..."
                                />
                            )}
                            {errors.correct_answer && <span className={styles.errorText}>{errors.correct_answer}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>التفسير (اختياري)</label>
                            <textarea
                                name="explanation"
                                value={formData.explanation}
                                onChange={handleChange}
                                className={styles.textareaInput}
                                rows="2"
                                placeholder="أدخل تفسير الإجابة..."
                            />
                        </div>
                    </div>

                    {/* === إعدادات إضافية === */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h3>إعدادات إضافية</h3>
                        </div>

                        <div className={styles.settingsRow}>
                            <div className={styles.formGroup}>
                                <label>ترتيب العرض</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order ?? ''}
                                    onChange={handleChange}
                                    className={styles.textInput}
                                    min="0"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>رقم الصفحة</label>
                                <input
                                    type="number"
                                    name="page_number"
                                    value={formData.page_number ?? ''}
                                    onChange={handleChange}
                                    className={styles.textInput}
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={onCancel} className={styles.cancelButton} disabled={isSubmitting}>
                            إلغاء
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <div className={styles.loadingSpinner} />
                                    جاري الحفظ...
                                </>
                            ) : exercise ? (
                                'تحديث'
                            ) : (
                                'إنشاء'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExerciseForm;