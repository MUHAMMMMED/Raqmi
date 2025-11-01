import { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import styles from './CardForm.module.css';

const CardForm = ({ card, onSubmit, onCancel, blockId, lessonId }) => {
    const [formData, setFormData] = useState({
        front_text: '',
        front_image: '',
        front_video: '',
        question_text: '',
        question_image: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: '',
        block: blockId,
        lesson: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // معاينة الصور
    const [frontImagePreview, setFrontImagePreview] = useState('');
    const [questionImagePreview, setQuestionImagePreview] = useState('');

    useEffect(() => {
        if (card) {
            const updatedData = {
                front_text: card.front_text || '',
                front_image: card.front_image || '',
                front_video: card.front_video || '',
                question_text: card.question_text || '',
                question_image: card.question_image || '',
                option_a: card.option_a || '',
                option_b: card.option_b || '',
                option_c: card.option_c || '',
                option_d: card.option_d || '',
                correct_answer: card.correct_answer || '',
                block: card.block || blockId,
                lesson: card.lesson || null,
            };
            setFormData(updatedData);
            setFrontImagePreview(card.front_image || '');
            setQuestionImagePreview(card.question_image || '');
        }
    }, [card, blockId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                if (name === 'front_image') setFrontImagePreview(reader.result);
                if (name === 'question_image') setQuestionImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (field) => {
        setFormData(prev => ({ ...prev, [field]: '' }));
        if (field === 'front_image') setFrontImagePreview('');
        if (field === 'question_image') setQuestionImagePreview('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.front_text?.trim() && !formData.front_image && !formData.front_video?.trim()) {
            newErrors.front = 'يجب إدخال نص أو صورة أو فيديو للوجه الأمامي';
        }

        if (!formData.question_text?.trim() && !formData.question_image) {
            newErrors.question = 'يجب إدخال نص أو صورة للسؤال';
        }

        if (!formData.correct_answer) {
            newErrors.correct_answer = 'يجب اختيار الإجابة الصحيحة';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <div className={styles.headerContent}>
                        <h2>{card ? 'تعديل البطاقة' : 'إضافة بطاقة جديدة'}</h2>
                        <p>املأ بيانات البطاقة التعليمية</p>
                    </div>
                    <button type="button" className={styles.closeButton} onClick={onCancel}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.formBody}>
                    {/* الوجه الأمامي */}
                    <div className={styles.formSection}>
                        <h3>الوجه الأمامي</h3>

                        <div className={styles.formGroup}>
                            <label>النص الأمامي</label>
                            <textarea
                                name="front_text"
                                value={formData.front_text}
                                onChange={handleChange}
                                className={styles.textareaInput}
                                rows="4"
                                placeholder="أدخل النص الذي سيظهر في الوجه الأمامي..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>صورة أمامية (اختياري)</label>
                            <input
                                type="file"
                                name="front_image"
                                onChange={handleFileChange}
                                accept="image/*"
                                className={styles.fileInput}
                            />
                            {frontImagePreview && (
                                <div className={styles.imagePreview}>
                                    <img src={frontImagePreview} alt="معاينة" />
                                    <button
                                        type="button"
                                        className={styles.removeImage}
                                        onClick={() => removeImage('front_image')}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label>فيديو يوتيوب (اختياري)</label>
                            <input
                                type="text"
                                name="front_video"
                                value={formData.front_video}
                                onChange={handleChange}
                                className={styles.textInput}
                                placeholder="أدخل ID الفيديو فقط (مثال: ABC123)"
                            />
                            {formData.front_video && (
                                <div className={styles.videoPreview}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${formData.front_video}`}
                                        title="معاينة فيديو"
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                            <small>مثال: من https://youtu.be/ABC123 → أدخل ABC123</small>
                        </div>
                    </div>

                    {/* الوجه الخلفي */}
                    <div className={styles.formSection}>
                        <h3>الوجه الخلفي (السؤال)</h3>

                        <div className={styles.formGroup}>
                            <label>نص السؤال</label>
                            <textarea
                                name="question_text"
                                value={formData.question_text}
                                onChange={handleChange}
                                className={styles.textareaInput}
                                rows="4"
                                placeholder="أدخل نص السؤال..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>صورة السؤال (اختياري)</label>
                            <input
                                type="file"
                                name="question_image"
                                onChange={handleFileChange}
                                accept="image/*"
                                className={styles.fileInput}
                            />
                            {questionImagePreview && (
                                <div className={styles.imagePreview}>
                                    <img src={questionImagePreview} alt="معاينة" />
                                    <button
                                        type="button"
                                        className={styles.removeImage}
                                        onClick={() => removeImage('question_image')}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* خيارات الإجابة (فاخرة) */}
                    <div className={styles.formSection}>
                        <h3>خيارات الإجابة</h3>

                        <div className={styles.optionsGrid}>
                            {['a', 'b', 'c', 'd'].map(letter => {
                                const isCorrect = formData.correct_answer === letter.toUpperCase();
                                const hasText = formData[`option_${letter}`]?.trim();

                                return (
                                    <div
                                        key={letter}
                                        className={`${styles.optionCard} ${isCorrect ? styles.correct : ''} ${hasText ? styles.hasContent : ''}`}
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, correct_answer: letter.toUpperCase() }));
                                        }}
                                    >
                                        <div className={styles.optionHeader}>
                                            <div className={styles.letterCircle}>
                                                {letter.toUpperCase()}
                                            </div>
                                            <div className={styles.optionLabel}>
                                                الخيار {letter.toUpperCase()}
                                                {isCorrect && <span className={styles.correctBadge}>الإجابة الصحيحة</span>}
                                            </div>
                                            {isCorrect && (
                                                <div className={styles.checkIcon}>
                                                    <FaCheck />
                                                </div>
                                            )}
                                        </div>

                                        <textarea
                                            name={`option_${letter}`}
                                            value={formData[`option_${letter}`]}
                                            onChange={handleChange}
                                            onClick={(e) => e.stopPropagation()}
                                            className={styles.optionTextarea}
                                            rows="2"
                                            placeholder={`أدخل نص الخيار ${letter.toUpperCase()}...`}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {errors.correct_answer && (
                            <div className={styles.errorText}>{errors.correct_answer}</div>
                        )}
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={onCancel} className={styles.cancelButton}>
                            إلغاء
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? 'جاري الحفظ...' : (card ? 'تحديث' : 'إنشاء')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardForm;