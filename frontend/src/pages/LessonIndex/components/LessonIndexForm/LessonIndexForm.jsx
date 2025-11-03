
import React, { useEffect, useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

import { getGradePrograms, getProgramSubjects, getStageGrades } from '../../../../api/categories';
import styles from './LessonIndexForm.module.css';

const LessonIndexForm = ({ lesson, onSave, onCancel, stages }) => {
    const [formData, setFormData] = useState({
        title: '',
        stage: '',
        grade: '',
        program: '',
        subject: '',
        ai_lesson: null
    });

    const [grades, setGrades] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lesson) {
            setFormData({
                title: lesson.title || '',
                stage: lesson.stage || '',
                grade: lesson.grade || '',
                program: lesson.program || '',
                subject: lesson.subject || '',
                ai_lesson: lesson.ai_lesson || null
            });
        }
    }, [lesson]);

    // جلب البيانات المتسلسلة
    useEffect(() => {
        const loadGrades = async () => {
            if (formData.stage) {
                const gradesData = await getStageGrades(formData.stage);
                setGrades(gradesData);
            } else {
                setGrades([]);
            }
        };
        loadGrades();
    }, [formData.stage]);

    useEffect(() => {
        const loadPrograms = async () => {
            if (formData.grade) {
                const programsData = await getGradePrograms(formData.grade);
                setPrograms(programsData);
            } else {
                setPrograms([]);
            }
        };
        loadPrograms();
    }, [formData.grade]);

    useEffect(() => {
        const loadSubjects = async () => {
            if (formData.program) {
                const subjectsData = await getProgramSubjects(formData.program);
                setSubjects(subjectsData);
            } else {
                setSubjects([]);
            }
        };
        loadSubjects();
    }, [formData.program]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.subject) {
            alert('الرجاء إدخال العنوان واختيار المادة');
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error saving lesson:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // إعادة تعيين الحقول التابعة عند تغيير الحقل الرئيسي
            if (field === 'stage') {
                newData.grade = '';
                newData.program = '';
                newData.subject = '';
            } else if (field === 'grade') {
                newData.program = '';
                newData.subject = '';
            } else if (field === 'program') {
                newData.subject = '';
            }

            return newData;
        });
    };

    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>{lesson ? 'تعديل فهرس الدرس' : 'إضافة فهرس درس جديد'}</h3>
                    <button onClick={onCancel} className={styles.closeBtn}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>عنوان الدرس *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className={styles.textInput}
                            placeholder="أدخل عنوان الدرس..."
                            required
                        />
                    </div>

                    <div className={styles.categoryGrid}>
                        <div className={styles.formGroup}>
                            <label>المرحلة *</label>
                            <select
                                value={formData.stage}
                                onChange={(e) => handleChange('stage', e.target.value)}
                                className={styles.selectInput}
                                required
                            >
                                <option value="">اختر المرحلة...</option>
                                {stages.map(stage => (
                                    <option key={stage.id} value={stage.id}>
                                        {stage.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>الصف *</label>
                            <select
                                value={formData.grade}
                                onChange={(e) => handleChange('grade', e.target.value)}
                                className={styles.selectInput}
                                required
                                disabled={!formData.stage}
                            >
                                <option value="">اختر الصف...</option>
                                {grades.map(grade => (
                                    <option key={grade.id} value={grade.id}>
                                        {grade.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.categoryGrid}>
                        <div className={styles.formGroup}>
                            <label>البرنامج *</label>
                            <select
                                value={formData.program}
                                onChange={(e) => handleChange('program', e.target.value)}
                                className={styles.selectInput}
                                required
                                disabled={!formData.grade}
                            >
                                <option value="">اختر البرنامج...</option>
                                {programs.map(program => (
                                    <option key={program.id} value={program.id}>
                                        {program.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>المادة *</label>
                            <select
                                value={formData.subject}
                                onChange={(e) => handleChange('subject', e.target.value)}
                                className={styles.selectInput}
                                required
                                disabled={!formData.program}
                            >
                                <option value="">اختر المادة...</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={onCancel}
                            className={styles.cancelBtn}
                            disabled={loading}
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={loading}
                        >
                            <FaSave />
                            {loading ? 'جاري الحفظ...' : (lesson ? 'تحديث' : 'حفظ')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LessonIndexForm;