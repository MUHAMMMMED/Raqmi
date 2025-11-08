import React, { useEffect, useState } from 'react';
import { FaBook, FaCheckCircle, FaCodeBranch, FaHourglassHalf, FaSave, FaTimes, FaTimesCircle, FaUser } from 'react-icons/fa';
import styles from './LessonModal.module.css';

const LessonModal = ({ isOpen, onClose, onSave, lesson, mode, course }) => {
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        order: 0,
        reels_count: 1,
        info: {
            نوع_الدرس: 'شرح',
            صعوبة: 'متوسطة',
            مدة_التعلم: '45 دقيقة',
            المستوى: '',
            الأهداف: []
        },
        // الحقول الجديدة
        version: 1,
        ai_model: '',
        prompt_version: '',
        reviewed_by: '',
        review_status: 'pending',
        review_notes: ''
    });
    const [newObjective, setNewObjective] = useState('');
    const [loading, setLoading] = useState(false);

    const LESSON_TYPES = [
        'شرح',
        'تمرين',
        'امتحان',
        'مراجعة',
        'مشروع',
        'نشاط'
    ];

    const DIFFICULTY_LEVELS = [
        'سهلة',
        'متوسطة',
        'صعبة'
    ];

    const DURATION_OPTIONS = [
        '30 دقيقة',
        '45 دقيقة',
        '60 دقيقة',
        '90 دقيقة',
        '120 دقيقة'
    ];

    const REVIEW_STATUSES = [
        { value: 'pending', label: 'قيد المراجعة', icon: FaHourglassHalf },
        { value: 'approved', label: 'معتمد', icon: FaCheckCircle },
        { value: 'rejected', label: 'مرفوض', icon: FaTimesCircle }
    ];

    const AI_MODELS = [
        'GPT-4',
        'GPT-3.5',
        'Claude-2',
        'Claude-3',
        'Gemini Pro',
        'LLaMA 2',
        'مخصص',
        'بدون ذكاء اصطناعي'
    ];

    useEffect(() => {
        if (lesson && mode === 'edit') {
            setFormData({
                title: lesson.title || '',
                summary: lesson.summary || '',
                order: lesson.order || 0,
                reels_count: lesson.reels_count || 1,
                info: {
                    نوع_الدرس: lesson.info?.نوع_الدرس || 'شرح',
                    صعوبة: lesson.info?.صعوبة || 'متوسطة',
                    مدة_التعلم: lesson.info?.مدة_التعلم || '45 دقيقة',
                    المستوى: lesson.info?.المستوى || course?.grade?.name || '',
                    الأهداف: lesson.info?.الأهداف || []
                },
                // الحقول الجديدة
                version: lesson.version || 1,
                ai_model: lesson.ai_model || '',
                prompt_version: lesson.prompt_version || '',
                reviewed_by: lesson.reviewed_by || '',
                review_status: lesson.review_status || 'pending',
                review_notes: lesson.review_notes || ''
            });
        } else {
            // Reset form for create mode
            setFormData({
                title: '',
                summary: '',
                order: 0,
                reels_count: 1,
                info: {
                    نوع_الدرس: 'شرح',
                    صعوبة: 'متوسطة',
                    مدة_التعلم: '45 دقيقة',
                    المستوى: course?.grade?.name || '',
                    الأهداف: []
                },
                // الحقول الجديدة
                version: 1,
                ai_model: '',
                prompt_version: '',
                reviewed_by: '',
                review_status: 'pending',
                review_notes: ''
            });
        }
    }, [lesson, mode, course]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInfoChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            info: {
                ...prev.info,
                [field]: value
            }
        }));
    };

    const addObjective = () => {
        if (newObjective.trim()) {
            setFormData(prev => ({
                ...prev,
                info: {
                    ...prev.info,
                    الأهداف: [...prev.info.الأهداف, newObjective.trim()]
                }
            }));
            setNewObjective('');
        }
    };

    const removeObjective = (index) => {
        setFormData(prev => ({
            ...prev,
            info: {
                ...prev.info,
                الأهداف: prev.info.الأهداف.filter((_, i) => i !== index)
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error saving lesson:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        const statusObj = REVIEW_STATUSES.find(s => s.value === status);
        const IconComponent = statusObj ? statusObj.icon : FaHourglassHalf;
        return <IconComponent className={styles[`statusIcon${status}`]} />;
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.titleSection}>
                        <FaBook className={styles.headerIcon} />
                        <h2>
                            {mode === 'create' ? 'إنشاء درس جديد' : 'تعديل الدرس'}
                        </h2>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        {/* المعلومات الأساسية */}
                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>المعلومات الأساسية</h3>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>عنوان الدرس *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="أدخل عنوان الدرس"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>ملخص الدرس</label>
                                <textarea
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleInputChange}
                                    className={styles.textarea}
                                    placeholder="أدخل ملخصًا للدرس"
                                    rows="3"
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>ترتيب الدرس</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        min="0"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>عدد الريلز</label>
                                    <input
                                        type="number"
                                        name="reels_count"
                                        value={formData.reels_count}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        min="1"
                                        max="10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* معلومات إضافية */}
                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>المعلومات الإضافية</h3>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>نوع الدرس</label>
                                    <select
                                        value={formData.info.نوع_الدرس}
                                        onChange={(e) => handleInfoChange('نوع_الدرس', e.target.value)}
                                        className={styles.select}
                                    >
                                        {LESSON_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>الصعوبة</label>
                                    <select
                                        value={formData.info.صعوبة}
                                        onChange={(e) => handleInfoChange('صعوبة', e.target.value)}
                                        className={styles.select}
                                    >
                                        {DIFFICULTY_LEVELS.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>مدة التعلم</label>
                                    <select
                                        value={formData.info.مدة_التعلم}
                                        onChange={(e) => handleInfoChange('مدة_التعلم', e.target.value)}
                                        className={styles.select}
                                    >
                                        {DURATION_OPTIONS.map(duration => (
                                            <option key={duration} value={duration}>{duration}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>المستوى</label>
                                    <input
                                        type="text"
                                        value={formData.info.المستوى}
                                        onChange={(e) => handleInfoChange('المستوى', e.target.value)}
                                        className={styles.input}
                                        placeholder="المستوى التعليمي"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* الأهداف التعليمية */}
                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>الأهداف التعليمية</h3>

                            <div className={styles.objectivesInput}>
                                <input
                                    type="text"
                                    value={newObjective}
                                    onChange={(e) => setNewObjective(e.target.value)}
                                    className={styles.input}
                                    placeholder="أدخل هدفًا تعليميًا جديدًا"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addObjective();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={addObjective}
                                    className={styles.addButton}
                                >
                                    إضافة
                                </button>
                            </div>

                            <div className={styles.objectivesList}>
                                {formData.info.الأهداف.map((objective, index) => (
                                    <div key={index} className={styles.objectiveItem}>
                                        <span>{objective}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeObjective(index)}
                                            className={styles.removeButton}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* معلومات الذكاء الاصطناعي */}
                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>
                                <FaCodeBranch className={styles.sectionIcon} />
                                معلومات الذكاء الاصطناعي
                            </h3>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>نموذج الذكاء الاصطناعي</label>
                                    <select
                                        name="ai_model"
                                        value={formData.ai_model}
                                        onChange={handleInputChange}
                                        className={styles.select}
                                    >
                                        <option value="">اختر النموذج</option>
                                        {AI_MODELS.map(model => (
                                            <option key={model} value={model}>{model}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>إصدار النموذج</label>
                                    <input
                                        type="text"
                                        name="prompt_version"
                                        value={formData.prompt_version}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        placeholder="إصدار النموذج المستخدم"
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>إصدار الدرس</label>
                                    <input
                                        type="number"
                                        name="version"
                                        value={formData.version}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        min="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* معلومات المراجعة */}
                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>
                                <FaUser className={styles.sectionIcon} />
                                معلومات المراجعة
                            </h3>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>حالة المراجعة</label>
                                    <div className={styles.statusSelector}>
                                        {REVIEW_STATUSES.map(status => (
                                            <label key={status.value} className={styles.statusOption}>
                                                <input
                                                    type="radio"
                                                    name="review_status"
                                                    value={status.value}
                                                    checked={formData.review_status === status.value}
                                                    onChange={handleInputChange}
                                                    className={styles.statusRadio}
                                                />
                                                <span className={`${styles.statusLabel} ${styles[status.value]}`}>
                                                    {getStatusIcon(status.value)}
                                                    {status.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>تمت المراجعة بواسطة</label>
                                    <input
                                        type="text"
                                        name="reviewed_by"
                                        value={formData.reviewed_by}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        placeholder="اسم المراجع"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>ملاحظات المراجعة</label>
                                <textarea
                                    name="review_notes"
                                    value={formData.review_notes}
                                    onChange={handleInputChange}
                                    className={styles.textarea}
                                    placeholder="أدخل ملاحظات المراجعة..."
                                    rows="3"
                                />
                            </div>
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
                            {loading ? 'جاري الحفظ...' : (mode === 'create' ? 'إنشاء الدرس' : 'حفظ التغييرات')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LessonModal;