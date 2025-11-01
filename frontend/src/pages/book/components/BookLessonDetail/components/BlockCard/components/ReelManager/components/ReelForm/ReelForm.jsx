import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './ReelForm.module.css';

const ReelForm = ({ reelPreview, onSubmit, onCancel, blockId }) => {
    const [formData, setFormData] = useState({
        hook_text: '',
        body_summary: '',
        outro_question: '',
        tone: 'informative',
        visual_hint: '',
        question_text: '',
        question_image: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct_option: 1
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // معاينة الصورة
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (reelPreview) {
            const updated = {
                hook_text: reelPreview.hook_text || '',
                body_summary: reelPreview.body_summary || '',
                outro_question: reelPreview.outro_question || '',
                tone: reelPreview.tone || 'informative',
                visual_hint: reelPreview.visual_hint || '',
                question_text: reelPreview.question_text || '',
                question_image: reelPreview.question_image || '',
                option1: reelPreview.option1 || '',
                option2: reelPreview.option2 || '',
                option3: reelPreview.option3 || '',
                option4: reelPreview.option4 || '',
                correct_option: reelPreview.correct_option || 1
            };
            setFormData(updated);
            setImagePreview(reelPreview.question_image || '');
        }
    }, [reelPreview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, question_image: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, question_image: '' }));
        setImagePreview('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.hook_text?.trim()) {
            newErrors.hook_text = 'نص الجذب مطلوب';
        }

        if (!formData.body_summary?.trim()) {
            newErrors.body_summary = 'ملخص الفكرة الرئيسية مطلوب';
        }

        if (!formData.tone) {
            newErrors.tone = 'نبرة الريل مطلوبة';
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

    const toneOptions = [
        { value: 'informative', label: 'معلوماتي' },
        { value: 'enthusiastic', label: 'متحمس' },
        { value: 'curious', label: 'فضولي' },
        { value: 'motivational', label: 'تحفيزي' }
    ];

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <div className={styles.headerContent}>
                        <h2>{reelPreview ? 'تعديل نموذج الريل' : 'إنشاء نموذج ريل جديد'}</h2>
                        <p>املأ بيانات نموذج الريل الخاص بالبلوك</p>
                    </div>
                    <button type="button" className={styles.closeButton} onClick={onCancel}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.formBody}>
                    {/* المحتوى الأساسي */}
                    <div className={styles.formSection}>
                        <h3>المحتوى الأساسي</h3>

                        <div className={styles.formGroup}>
                            <label>نص الجذب (Hook) *</label>
                            <textarea
                                name="hook_text"
                                value={formData.hook_text}
                                onChange={handleChange}
                                className={`${styles.textareaInput} ${errors.hook_text ? styles.error : ''}`}
                                rows="2"
                                placeholder="جملة البداية التي تجذب الانتباه..."
                            />
                            {errors.hook_text && <span className={styles.errorText}>{errors.hook_text}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>ملخص الفكرة الرئيسية *</label>
                            <textarea
                                name="body_summary"
                                value={formData.body_summary}
                                onChange={handleChange}
                                className={`${styles.textareaInput} ${errors.body_summary ? styles.error : ''}`}
                                rows="3"
                                placeholder="ما الذي يشرحه الريل في القسم الرئيسي؟"
                            />
                            {errors.body_summary && <span className={styles.errorText}>{errors.body_summary}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>سؤال ختامي (اختياري)</label>
                            <input
                                type="text"
                                name="outro_question"
                                value={formData.outro_question}
                                onChange={handleChange}
                                className={styles.textInput}
                                placeholder="جملة تشجع المشاهد على التفكير أو المتابعة..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>نبرة الريل *</label>
                            <select
                                name="tone"
                                value={formData.tone}
                                onChange={handleChange}
                                className={`${styles.selectInput} ${errors.tone ? styles.error : ''}`}
                            >
                                {toneOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.tone && <span className={styles.errorText}>{errors.tone}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>اقتراح بصري (اختياري)</label>
                            <input
                                type="text"
                                name="visual_hint"
                                value={formData.visual_hint}
                                onChange={handleChange}
                                className={styles.textInput}
                                placeholder="مثلاً: صور متحركة، أمثلة، أو عرض نصي بسيط"
                            />
                        </div>
                    </div>

                    {/* السؤال والاختيارات */}
                    <div className={styles.formSection}>
                        <h3>سؤال الريل (اختياري)</h3>

                        <div className={styles.formGroup}>
                            <label>نص السؤال</label>
                            <input
                                type="text"
                                name="question_text"
                                value={formData.question_text}
                                onChange={handleChange}
                                className={styles.textInput}
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
                            {imagePreview && (
                                <div className={styles.imagePreview}>
                                    <img src={imagePreview} alt="معاينة" />
                                    <button
                                        type="button"
                                        className={styles.removeImage}
                                        onClick={removeImage}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={styles.optionsGrid}>
                            {[1, 2, 3, 4].map(num => (
                                <div
                                    key={num}
                                    className={`${styles.optionCard} ${formData.correct_option === num ? styles.correct : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, correct_option: num }))}
                                >
                                    <div className={styles.optionHeader}>
                                        <div className={styles.letterCircle}>
                                            {String.fromCharCode(64 + num)}
                                        </div>
                                        <div className={styles.optionLabel}>
                                            الخيار {String.fromCharCode(64 + num)}
                                            {formData.correct_option === num && (
                                                <span className={styles.correctBadge}>الإجابة الصحيحة</span>
                                            )}
                                        </div>
                                        {formData.correct_option === num && (
                                            <div className={styles.checkIcon}>
                                                Check
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        name={`option${num}`}
                                        value={formData[`option${num}`]}
                                        onChange={handleChange}
                                        onClick={(e) => e.stopPropagation()}
                                        className={styles.optionInput}
                                        placeholder={`أدخل الخيار ${String.fromCharCode(64 + num)}...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={onCancel} className={styles.cancelButton}>
                            إلغاء
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? 'جاري الحفظ...' : (reelPreview ? 'تحديث' : 'إنشاء')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReelForm;