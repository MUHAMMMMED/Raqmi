import React, { useEffect, useState } from "react";
import {
    FaBorderAll,
    FaCheckCircle,
    FaExclamationTriangle,
    FaEyeDropper,
    FaFont,
    FaGraduationCap,
    FaPalette,
    FaSpinner,
    FaTimes
} from 'react-icons/fa';
import { getGradePrograms, getProgramSubjects, getStageGrades, getStages } from "../../../api/categories";
import { createCourse, updateCourse } from "../../../api/courses";
import styles from './CourseForm.module.css';

const CourseForm = ({ course, onSuccess, onCancel }) => {
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        stage: "",
        grade: "",
        program: "",
        subject: "",
        primary_color: "#1E90FF",
        secondary_color: "#FFD700",
        background_color: "#FFFFFF",
        main_font: "Cairo",
        desc_font: "Tajawal",
        border_radius: 16,
        padding: 12,
        license_info: ""
    });

    const [options, setOptions] = useState({
        stages: [],
        grades: [],
        programs: [],
        subjects: []
    });

    const [loading, setLoading] = useState({
        stages: false,
        grades: false,
        programs: false,
        subjects: false
    });

    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

    const FONT_OPTIONS = [
        { value: "Cairo", label: "Cairo", category: "عربية" },
        { value: "Tajawal", label: "Tajawal", category: "عربية" },
        { value: "Amiri", label: "Amiri", category: "عربية" },
        { value: "Almarai", label: "Almarai", category: "عربية" },
        { value: "Arial", label: "Arial", category: "إنجليزية" },
        { value: "Times New Roman", label: "Times New Roman", category: "إنجليزية" },
        { value: "Georgia", label: "Georgia", category: "إنجليزية" }
    ];

    useEffect(() => {
        loadStages();
    }, []);

    useEffect(() => {
        if (course && options.stages.length > 0 && !initialDataLoaded) {
            loadInitialCourseData();
        }
    }, [course, options.stages, initialDataLoaded]);

    const loadStages = async () => {
        try {
            setLoading(prev => ({ ...prev, stages: true }));
            const response = await getStages();
            setOptions(prev => ({ ...prev, stages: response.data || response }));
        } catch (error) {
            console.error('Error loading stages:', error);
            setSaveStatus({
                type: 'error',
                message: 'حدث خطأ في تحميل المراحل'
            });
        } finally {
            setLoading(prev => ({ ...prev, stages: false }));
        }
    };

    const loadInitialCourseData = async () => {
        if (!course) return;

        try {
            // تعيين البيانات الأساسية
            setFormData({
                name: course.name || "",
                stage: course.stage?.id || course.stage || "",
                grade: course.grade?.id || course.grade || "",
                program: course.program?.id || course.program || "",
                subject: course.subject?.id || course.subject || "",
                primary_color: course.primary_color || "#1E90FF",
                secondary_color: course.secondary_color || "#FFD700",
                background_color: course.background_color || "#FFFFFF",
                main_font: course.main_font || "Cairo",
                desc_font: course.desc_font || "Tajawal",
                border_radius: course.border_radius || 16,
                padding: course.padding || 12,
                license_info: course.license_info || ""
            });

            // جلب البيانات المرتبطة تدريجياً
            const stageId = course.stage?.id || course.stage;
            if (stageId) {
                await loadGrades(stageId, true);
            }

            const gradeId = course.grade?.id || course.grade;
            if (gradeId) {
                await loadPrograms(gradeId, true);
            }

            const programId = course.program?.id || course.program;
            if (programId) {
                await loadSubjects(programId, true);
            }

            setInitialDataLoaded(true);
        } catch (error) {
            console.error('Error loading initial course data:', error);
        }
    };

    const loadGrades = async (stageId, keepSelection = false) => {
        if (!stageId) {
            setOptions(prev => ({ ...prev, grades: [], programs: [], subjects: [] }));
            if (!keepSelection) {
                setFormData(prev => ({ ...prev, grade: "", program: "", subject: "" }));
            }
            return;
        }

        try {
            setLoading(prev => ({ ...prev, grades: true }));
            const response = await getStageGrades(stageId);
            setOptions(prev => ({
                ...prev,
                grades: response.data || response,
                programs: [],
                subjects: []
            }));

            if (!keepSelection) {
                setFormData(prev => ({ ...prev, grade: "", program: "", subject: "" }));
            }
        } catch (error) {
            console.error('Error loading grades:', error);
        } finally {
            setLoading(prev => ({ ...prev, grades: false }));
        }
    };

    const loadPrograms = async (gradeId, keepSelection = false) => {
        if (!gradeId) {
            setOptions(prev => ({ ...prev, programs: [], subjects: [] }));
            if (!keepSelection) {
                setFormData(prev => ({ ...prev, program: "", subject: "" }));
            }
            return;
        }

        try {
            setLoading(prev => ({ ...prev, programs: true }));
            const response = await getGradePrograms(gradeId);
            setOptions(prev => ({
                ...prev,
                programs: response.data || response,
                subjects: []
            }));

            if (!keepSelection) {
                setFormData(prev => ({ ...prev, program: "", subject: "" }));
            }
        } catch (error) {
            console.error('Error loading programs:', error);
        } finally {
            setLoading(prev => ({ ...prev, programs: false }));
        }
    };

    const loadSubjects = async (programId, keepSelection = false) => {
        if (!programId) {
            setOptions(prev => ({ ...prev, subjects: [] }));
            if (!keepSelection) {
                setFormData(prev => ({ ...prev, subject: "" }));
            }
            return;
        }

        try {
            setLoading(prev => ({ ...prev, subjects: true }));
            const response = await getProgramSubjects(programId);
            setOptions(prev => ({ ...prev, subjects: response.data || response }));

            if (!keepSelection) {
                setFormData(prev => ({ ...prev, subject: "" }));
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
        } finally {
            setLoading(prev => ({ ...prev, subjects: false }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // عند تغيير المرحلة، جلب الصفوف التابعة لها
        if (name === 'stage') {
            loadGrades(value);
        }
        // عند تغيير الصف، جلب البرامج التابعة له
        else if (name === 'grade') {
            loadPrograms(value);
        }
        // عند تغيير البرنامج، جلب المواد التابعة له
        else if (name === 'program') {
            loadSubjects(value);
        }
    };

    const handleNumberInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setSaveStatus({
                type: 'error',
                message: 'الرجاء إدخال اسم الكورس'
            });
            return;
        }

        if (!formData.stage || !formData.grade || !formData.program || !formData.subject) {
            setSaveStatus({
                type: 'error',
                message: 'الرجاء اختيار جميع الحقول المطلوبة'
            });
            return;
        }

        setSaving(true);
        setSaveStatus(null);

        try {
            // تحضير البيانات للإرسال
            const submitData = {
                name: formData.name,
                stage: formData.stage,
                grade: formData.grade,
                program: formData.program,
                subject: formData.subject,
                primary_color: formData.primary_color,
                secondary_color: formData.secondary_color,
                background_color: formData.background_color,
                main_font: formData.main_font,
                desc_font: formData.desc_font,
                border_radius: formData.border_radius,
                padding: formData.padding,
                license_info: formData.license_info
            };

            if (course) {
                await updateCourse(course.id, submitData);
                setSaveStatus({
                    type: 'success',
                    message: 'تم تحديث الكورس بنجاح!'
                });
            } else {
                await createCourse(submitData);
                setSaveStatus({
                    type: 'success',
                    message: 'تم إنشاء الكورس بنجاح!'
                });
            }

            if (!course) {
                setFormData({
                    name: "",
                    stage: "",
                    grade: "",
                    program: "",
                    subject: "",
                    primary_color: "#1E90FF",
                    secondary_color: "#FFD700",
                    background_color: "#FFFFFF",
                    main_font: "Cairo",
                    desc_font: "Tajawal",
                    border_radius: 16,
                    padding: 12,
                    license_info: ""
                });
                setOptions(prev => ({ ...prev, grades: [], programs: [], subjects: [] }));
                setInitialDataLoaded(false);
            }

            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1500);

        } catch (error) {
            console.error('Save error:', error);
            setSaveStatus({
                type: 'error',
                message: error.response?.data?.message || 'حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة مرة أخرى'
            });
        } finally {
            setSaving(false);
        }
    };

    // DesignPreview component
    const DesignPreview = () => (
        <div className={styles.designPreview}>
            <h4>
                <FaEyeDropper className={styles.previewIcon} />
                معاينة التصميم
            </h4>

            <div className={styles.previewContainer}>
                <div
                    className={styles.previewCard}
                    style={{
                        '--primary-color': formData.primary_color,
                        '--secondary-color': formData.secondary_color,
                        '--background-color': formData.background_color,
                        '--border-radius': `${formData.border_radius}px`,
                        '--padding': `${formData.padding}px`,
                        '--main-font': formData.main_font,
                        '--desc-font': formData.desc_font
                    }}
                >
                    <div className={styles.previewHeader}>
                        <div className={styles.previewIconContainer}>
                            <FaGraduationCap />
                        </div>
                        <div className={styles.previewText}>
                            <h5 style={{ fontFamily: formData.main_font }}>
                                {formData.name || "اسم الكورس"}
                            </h5>
                            <p style={{ fontFamily: formData.desc_font }}>
                                هذا نموذج معاينة للتصميم
                            </p>
                        </div>
                    </div>

                    <div className={styles.previewColors}>
                        <div
                            className={styles.colorDot}
                            style={{ backgroundColor: formData.primary_color }}
                            title={`أساسي: ${formData.primary_color}`}
                        />
                        <div
                            className={styles.colorDot}
                            style={{ backgroundColor: formData.secondary_color }}
                            title={`ثانوي: ${formData.secondary_color}`}
                        />
                        <div
                            className={styles.colorDot}
                            style={{ backgroundColor: formData.background_color, border: '1px solid #e2e8f0' }}
                            title={`خلفية: ${formData.background_color}`}
                        />
                    </div>

                    <div className={styles.previewSpecs}>
                        <span>نصف قطر: {formData.border_radius}px</span>
                        <span>مسافة: {formData.padding}px</span>
                    </div>
                </div>
            </div>
        </div>
    );

    // دالة مساعدة للحصول على اسم العنصر من الـ options
    const getSelectedName = (id, optionList) => {
        if (!id) return '';
        const item = optionList.find(item => item.id == id);
        return item ? item.name : '';
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.header}>
                <FaGraduationCap className={styles.headerIcon} />
                <div>
                    <h1>{course ? 'تعديل الكورس' : 'إضافة كورس جديد'}</h1>
                    <p>{course ? 'قم بتعديل معلومات الكورس وإعدادات التصميم' : 'أضف كورساً جديداً إلى النظام مع إعدادات التصميم المخصصة'}</p>
                </div>
                {onCancel && (
                    <button
                        className={styles.closeButton}
                        onClick={onCancel}
                        disabled={saving}
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className={styles.courseForm}>
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaGraduationCap className={styles.sectionIcon} />
                        <h3>معلومات الكورس</h3>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                اسم الكورس *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={styles.textInput}
                                placeholder="أدخل اسم الكورس..."
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                المرحلة *
                                {loading.stages && <span className={styles.loadingText}> (جاري التحميل...)</span>}
                            </label>
                            <select
                                name="stage"
                                value={formData.stage}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                required
                                disabled={saving || loading.stages}
                            >
                                <option value="">اختر المرحلة</option>
                                {options.stages.map(stage => (
                                    <option key={stage.id} value={stage.id}>
                                        {stage.name}
                                    </option>
                                ))}
                            </select>
                            {course && formData.stage && (
                                <div className={styles.selectedValue}>
                                    المحدد: {getSelectedName(formData.stage, options.stages)}
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                الصف *
                                {loading.grades && <span className={styles.loadingText}> (جاري التحميل...)</span>}
                            </label>
                            <select
                                name="grade"
                                value={formData.grade}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                required
                                disabled={saving || !formData.stage || loading.grades}
                            >
                                <option value="">
                                    {loading.grades ? 'جاري التحميل...' :
                                        formData.stage ? 'اختر الصف' : 'اختر المرحلة أولاً'}
                                </option>
                                {options.grades.map(grade => (
                                    <option key={grade.id} value={grade.id}>
                                        {grade.name}
                                    </option>
                                ))}
                            </select>
                            {course && formData.grade && (
                                <div className={styles.selectedValue}>
                                    المحدد: {getSelectedName(formData.grade, options.grades)}
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                البرنامج *
                                {loading.programs && <span className={styles.loadingText}> (جاري التحميل...)</span>}
                            </label>
                            <select
                                name="program"
                                value={formData.program}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                required
                                disabled={saving || !formData.grade || loading.programs}
                            >
                                <option value="">
                                    {loading.programs ? 'جاري التحميل...' :
                                        formData.grade ? 'اختر البرنامج' : 'اختر الصف أولاً'}
                                </option>
                                {options.programs.map(program => (
                                    <option key={program.id} value={program.id}>
                                        {program.name}
                                    </option>
                                ))}
                            </select>
                            {course && formData.program && (
                                <div className={styles.selectedValue}>
                                    المحدد: {getSelectedName(formData.program, options.programs)}
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                المادة *
                                {loading.subjects && <span className={styles.loadingText}> (جاري التحميل...)</span>}
                            </label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                required
                                disabled={saving || !formData.program || loading.subjects}
                            >
                                <option value="">
                                    {loading.subjects ? 'جاري التحميل...' :
                                        formData.program ? 'اختر المادة' : 'اختر البرنامج أولاً'}
                                </option>
                                {options.subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                            {course && formData.subject && (
                                <div className={styles.selectedValue}>
                                    المحدد: {getSelectedName(formData.subject, options.subjects)}
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                معلومات الترخيص
                            </label>
                            <textarea
                                name="license_info"
                                value={formData.license_info}
                                onChange={handleInputChange}
                                className={styles.textareaInput}
                                placeholder="أدخل معلومات الترخيص (اختياري)..."
                                rows="3"
                                disabled={saving}
                            />
                        </div>
                    </div>
                </div>

                {/* باقي الكود */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaPalette className={styles.sectionIcon} />
                        <h3>إعدادات التصميم</h3>
                    </div>

                    <div className={styles.designGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaEyeDropper className={styles.labelIcon} />
                                اللون الأساسي
                            </label>
                            <div className={styles.colorInputGroup}>
                                <input
                                    type="color"
                                    name="primary_color"
                                    value={formData.primary_color}
                                    onChange={handleInputChange}
                                    className={styles.colorInput}
                                    disabled={saving}
                                />
                                <input
                                    type="text"
                                    name="primary_color"
                                    value={formData.primary_color}
                                    onChange={handleInputChange}
                                    className={styles.colorTextInput}
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaEyeDropper className={styles.labelIcon} />
                                اللون الثانوي
                            </label>
                            <div className={styles.colorInputGroup}>
                                <input
                                    type="color"
                                    name="secondary_color"
                                    value={formData.secondary_color}
                                    onChange={handleInputChange}
                                    className={styles.colorInput}
                                    disabled={saving}
                                />
                                <input
                                    type="text"
                                    name="secondary_color"
                                    value={formData.secondary_color}
                                    onChange={handleInputChange}
                                    className={styles.colorTextInput}
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaEyeDropper className={styles.labelIcon} />
                                لون الخلفية
                            </label>
                            <div className={styles.colorInputGroup}>
                                <input
                                    type="color"
                                    name="background_color"
                                    value={formData.background_color}
                                    onChange={handleInputChange}
                                    className={styles.colorInput}
                                    disabled={saving}
                                />
                                <input
                                    type="text"
                                    name="background_color"
                                    value={formData.background_color}
                                    onChange={handleInputChange}
                                    className={styles.colorTextInput}
                                    disabled={saving}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.designGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaFont className={styles.labelIcon} />
                                خط العناوين
                            </label>
                            <select
                                name="main_font"
                                value={formData.main_font}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                disabled={saving}
                            >
                                {FONT_OPTIONS.map(font => (
                                    <option key={font.value} value={font.value}>
                                        {font.label} ({font.category})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaFont className={styles.labelIcon} />
                                خط النصوص
                            </label>
                            <select
                                name="desc_font"
                                value={formData.desc_font}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                disabled={saving}
                            >
                                {FONT_OPTIONS.map(font => (
                                    <option key={font.value} value={font.value}>
                                        {font.label} ({font.category})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.designGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaBorderAll className={styles.labelIcon} />
                                نصف قطر الحواف (px)
                            </label>
                            <div className={styles.rangeInputGroup}>
                                <input
                                    type="range"
                                    name="border_radius"
                                    min="0"
                                    max="30"
                                    value={formData.border_radius}
                                    onChange={handleNumberInputChange}
                                    className={styles.rangeInput}
                                    disabled={saving}
                                />
                                <span className={styles.rangeValue}>
                                    {formData.border_radius}px
                                </span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaBorderAll className={styles.labelIcon} />
                                المسافة الداخلية (px)
                            </label>
                            <div className={styles.rangeInputGroup}>
                                <input
                                    type="range"
                                    name="padding"
                                    min="8"
                                    max="30"
                                    value={formData.padding}
                                    onChange={handleNumberInputChange}
                                    className={styles.rangeInput}
                                    disabled={saving}
                                />
                                <span className={styles.rangeValue}>
                                    {formData.padding}px
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <DesignPreview />

                {saveStatus && (
                    <div className={`${styles.statusMessage} ${styles[saveStatus.type]}`}>
                        {saveStatus.type === 'success' ? (
                            <FaCheckCircle className={styles.statusIcon} />
                        ) : (
                            <FaExclamationTriangle className={styles.statusIcon} />
                        )}
                        {saveStatus.message}
                    </div>
                )}

                <div className={styles.actions}>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={saving}
                            className={styles.cancelButton}
                        >
                            إلغاء
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={saving}
                        className={`${styles.saveButton} ${saving ? styles.loading : ''}`}
                    >
                        {saving ? (
                            <>
                                <FaSpinner className={styles.spinner} />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <FaCheckCircle className={styles.buttonIcon} />
                                {course ? 'تحديث الكورس' : 'إنشاء الكورس'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseForm;