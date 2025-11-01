import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from './CreateLesson.module.css';

import {
    FaBook,
    FaBullseye,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaGraduationCap,
    FaPalette,
    FaPlus,
    FaSpinner,
    FaTasks,
    FaTimes,
    FaUserGraduate
} from 'react-icons/fa';
import { createLesson } from "../../../../api/lessons";

const CreateLesson = ({ onSuccess, onCancel }) => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [creating, setCreating] = useState(false);
    const [createStatus, setCreateStatus] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        // معلومات إضافية
        lesson_type: "علوم",
        grade_level: "الصف السادس",
        duration: "15 دقيقة",
        difficulty: "متوسطة",
        objectives: [""],
        teaching_methods: [""],
        interactive_activities: [""],
        notes: ""
    });

    const LESSON_TYPES = [
        "علوم", "رياضيات", "لغة عربية", "لغة إنجليزية",
        "دراسات اجتماعية", "تربية إسلامية", "فنون", "تربية بدنية"
    ];

    const GRADE_LEVELS = [
        "الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع",
        "الصف الخامس", "الصف السادس", "الصف السابع", "الصف الثامن",
        "الصف التاسع", "الصف العاشر", "الصف الحادي عشر", "الصف الثاني عشر"
    ];

    const DIFFICULTY_LEVELS = [
        { value: "سهلة", label: "سهلة", color: "#48bb78" },
        { value: "متوسطة", label: "متوسطة", color: "#ed8936" },
        { value: "صعبة", label: "صعبة", color: "#e53e3e" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArrayInputChange = (index, value, field) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({
            ...prev,
            [field]: newArray
        }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], ""]
        }));
    };

    const removeArrayItem = (index, field) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            [field]: newArray
        }));
    };

    const handleCreateLesson = async () => {
        if (!formData.title.trim()) {
            setCreateStatus({
                type: 'error',
                message: 'الرجاء إدخال عنوان الدرس'
            });
            return;
        }

        if (!formData.content.trim()) {
            setCreateStatus({
                type: 'error',
                message: 'الرجاء إدخال محتوى الدرس'
            });
            return;
        }

        setCreating(true);
        setCreateStatus(null);

        try {
            // تحضير بيانات info
            const info = {
                نوع_الدرس: formData.lesson_type,
                المستوى: formData.grade_level,
                الأهداف: formData.objectives.filter(obj => obj.trim() !== ""),
                مدة_التعلم: formData.duration,
                صعوبة: formData.difficulty,
                الوسائل_التعليمية: formData.teaching_methods.filter(method => method.trim() !== ""),
                نشاطات_تفاعلية: formData.interactive_activities.filter(activity => activity.trim() !== ""),
                ملاحظات: formData.notes,
                تحليل_AI: "سيتم إنشاء تحليل الذكاء الاصطناعي تلقائياً بعد إنشاء الدرس"
            };

            const lessonData = {
                book: bookId,
                title: formData.title,
                content: formData.content,
                info: info,
                order: 0 // سيتم حساب الترتيب تلقائياً في الخلفية
            };

            const response = await createLesson(lessonData);

            setCreateStatus({
                type: 'success',
                message: 'تم إنشاء الدرس بنجاح!'
            });

            // إعادة تعيين النموذج
            setFormData({
                title: "",
                content: "",
                lesson_type: "علوم",
                grade_level: "الصف السادس",
                duration: "15 دقيقة",
                difficulty: "متوسطة",
                objectives: [""],
                teaching_methods: [""],
                interactive_activities: [""],
                notes: ""
            });

            // الانتقال إلى محرر الدرس بعد نجاح الإنشاء
            setTimeout(() => {
                if (onSuccess) onSuccess();
                navigate(`/lessons/${response.id}/editor`);
            }, 1500);

        } catch (error) {
            console.error('Create lesson error:', error);
            setCreateStatus({
                type: 'error',
                message: 'حدث خطأ أثناء إنشاء الدرس. الرجاء المحاولة مرة أخرى'
            });
        } finally {
            setCreating(false);
        }
    };

    const LessonPreview = () => (
        <div className={styles.lessonPreview}>
            <h4>
                <FaBook className={styles.previewIcon} />
                معاينة الدرس
            </h4>

            <div className={styles.previewContainer}>
                <div className={styles.previewCard}>
                    <div className={styles.previewHeader}>
                        <div className={styles.previewIconContainer}>
                            <FaGraduationCap />
                        </div>
                        <div className={styles.previewText}>
                            <h5>{formData.title || "عنوان الدرس"}</h5>
                            <p>{formData.lesson_type} - {formData.grade_level}</p>
                        </div>
                    </div>

                    <div className={styles.previewContent}>
                        <p className={styles.previewDescription}>
                            {formData.content ?
                                `${formData.content.substring(0, 100)}...` :
                                "محتوى الدرس سيظهر هنا..."
                            }
                        </p>

                        <div className={styles.previewMeta}>
                            <span className={styles.metaItem}>
                                <FaClock />
                                {formData.duration}
                            </span>
                            <span className={styles.metaItem}>
                                <FaUserGraduate />
                                {formData.difficulty}
                            </span>
                        </div>

                        {formData.objectives.some(obj => obj.trim() !== "") && (
                            <div className={styles.previewObjectives}>
                                <div className={styles.objectivesHeader}>
                                    <FaBullseye />
                                    <span>الأهداف:</span>
                                </div>
                                <div className={styles.objectivesList}>
                                    {formData.objectives.slice(0, 2).map((objective, index) => (
                                        objective.trim() && (
                                            <span key={index} className={styles.objectiveTag}>
                                                {objective}
                                            </span>
                                        )
                                    ))}
                                    {formData.objectives.filter(obj => obj.trim() !== "").length > 2 && (
                                        <span className={styles.moreObjectives}>
                                            +{formData.objectives.filter(obj => obj.trim() !== "").length - 2} أكثر
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.createContainer}>
            <div className={styles.header}>
                <FaPlus className={styles.headerIcon} />
                <div>
                    <h1>إنشاء درس جديد</h1>
                    <p>أضف درساً جديداً إلى الكتاب مع المعلومات التعليمية الشاملة</p>
                </div>
                {onCancel && (
                    <button
                        className={styles.closeButton}
                        onClick={onCancel}
                        disabled={creating}
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            <div className={styles.createForm}>
                {/* المعلومات الأساسية */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaBook className={styles.sectionIcon} />
                        <h3>المعلومات الأساسية</h3>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                عنوان الدرس *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={styles.textInput}
                                placeholder="أدخل عنوان الدرس..."
                                required
                                disabled={creating}
                            />
                        </div>

                        {/* <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                نوع الدرس
                            </label>
                            <select
                                name="lesson_type"
                                value={formData.lesson_type}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                disabled={creating}
                            >
                                {LESSON_TYPES.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                المستوى الدراسي
                            </label>
                            <select
                                name="grade_level"
                                value={formData.grade_level}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                disabled={creating}
                            >
                                {GRADE_LEVELS.map(grade => (
                                    <option key={grade} value={grade}>
                                        {grade}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                مدة التعلم
                            </label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                className={styles.textInput}
                                placeholder="مثال: 15 دقيقة"
                                disabled={creating}
                            />
                        </div>
                  */}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            محتوى الدرس *
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            className={styles.textareaInput}
                            placeholder="اكتب محتوى الدرس هنا..."
                            rows="6"
                            required
                            disabled={creating}
                        />
                    </div>
                </div>

                {/* الأهداف التعليمية */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaBullseye className={styles.sectionIcon} />
                        <h3>الأهداف التعليمية</h3>
                    </div>

                    <div className={styles.arraySection}>
                        {formData.objectives.map((objective, index) => (
                            <div key={index} className={styles.arrayItem}>
                                <input
                                    type="text"
                                    value={objective}
                                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'objectives')}
                                    className={styles.textInput}
                                    placeholder={`الهدف التعليمي ${index + 1}...`}
                                    disabled={creating}
                                />
                                {formData.objectives.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, 'objectives')}
                                        className={styles.removeButton}
                                        disabled={creating}
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('objectives')}
                            className={styles.addButton}
                            disabled={creating}
                        >
                            <FaPlus />
                            إضافة هدف تعليمي
                        </button>
                    </div>
                </div>

                {/* الوسائل التعليمية */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaPalette className={styles.sectionIcon} />
                        <h3>الوسائل التعليمية</h3>
                    </div>

                    <div className={styles.arraySection}>
                        {formData.teaching_methods.map((method, index) => (
                            <div key={index} className={styles.arrayItem}>
                                <input
                                    type="text"
                                    value={method}
                                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'teaching_methods')}
                                    className={styles.textInput}
                                    placeholder={`وسيلة تعليمية ${index + 1}...`}
                                    disabled={creating}
                                />
                                {formData.teaching_methods.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, 'teaching_methods')}
                                        className={styles.removeButton}
                                        disabled={creating}
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('teaching_methods')}
                            className={styles.addButton}
                            disabled={creating}
                        >
                            <FaPlus />
                            إضافة وسيلة تعليمية
                        </button>
                    </div>
                </div>

                {/* النشاطات التفاعلية */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaTasks className={styles.sectionIcon} />
                        <h3>النشاطات التفاعلية</h3>
                    </div>

                    <div className={styles.arraySection}>
                        {formData.interactive_activities.map((activity, index) => (
                            <div key={index} className={styles.arrayItem}>
                                <input
                                    type="text"
                                    value={activity}
                                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'interactive_activities')}
                                    className={styles.textInput}
                                    placeholder={`نشاط تفاعلي ${index + 1}...`}
                                    disabled={creating}
                                />
                                {formData.interactive_activities.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, 'interactive_activities')}
                                        className={styles.removeButton}
                                        disabled={creating}
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('interactive_activities')}
                            className={styles.addButton}
                            disabled={creating}
                        >
                            <FaPlus />
                            إضافة نشاط تفاعلي
                        </button>
                    </div>
                </div>

                {/* معلومات إضافية */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaGraduationCap className={styles.sectionIcon} />
                        <h3>معلومات إضافية</h3>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                مستوى الصعوبة
                            </label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                disabled={creating}
                            >
                                {DIFFICULTY_LEVELS.map(level => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            ملاحظات إضافية
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            className={styles.textareaInput}
                            placeholder="أي ملاحظات إضافية حول الدرس..."
                            rows="3"
                            disabled={creating}
                        />
                    </div>
                </div>

                <LessonPreview />

                {createStatus && (
                    <div className={`${styles.statusMessage} ${styles[createStatus.type]}`}>
                        {createStatus.type === 'success' ? (
                            <FaCheckCircle className={styles.statusIcon} />
                        ) : (
                            <FaExclamationTriangle className={styles.statusIcon} />
                        )}
                        {createStatus.message}
                    </div>
                )}

                <div className={styles.actions}>
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            disabled={creating}
                            className={styles.cancelButton}
                        >
                            إلغاء
                        </button>
                    )}
                    <button
                        onClick={handleCreateLesson}
                        disabled={creating || !formData.title.trim() || !formData.content.trim()}
                        className={`${styles.createButton} ${creating ? styles.loading : ''}`}
                    >
                        {creating ? (
                            <>
                                <FaSpinner className={styles.spinner} />
                                جاري الإنشاء...
                            </>
                        ) : (
                            <>
                                <FaPlus className={styles.buttonIcon} />
                                إنشاء الدرس
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateLesson;