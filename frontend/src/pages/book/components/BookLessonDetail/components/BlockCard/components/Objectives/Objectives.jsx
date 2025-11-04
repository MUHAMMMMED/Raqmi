import React, { useState } from 'react';
import {
    FaEdit,
    FaGraduationCap,
    FaPlus,
    FaSave,
    FaTimes,
    FaTrash
} from 'react-icons/fa';
import {
    createObjective,
    deleteObjective,
    updateObjective
} from '../../../../../../../../api/objectives';
import styles from './Objectives.module.css';
export default function Objectives({ objectives = [], blockId, fetchData, IsManager }) {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingObjective, setEditingObjective] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        block: blockId,

    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            block: blockId
        });
        setEditingObjective(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            alert('الرجاء ملء جميع الحقول المطلوبة');
            return;
        }

        setLoading(true);
        try {
            if (editingObjective) {
                // تحديث الهدف الموجود
                await updateObjective(editingObjective.id, formData);
            } else {
                // إنشاء هدف جديد
                await createObjective(formData);
            }

            resetForm();

            // إعادة تحميل البيانات من الأب
            if (fetchData) {
                await fetchData();
            }
        } catch (error) {
            console.error('Error saving objective:', error);
            alert('حدث خطأ أثناء حفظ الهدف التعليمي');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (objective) => {
        setEditingObjective(objective);
        setFormData({
            title: objective.title,
            description: objective.description,
            block: blockId
        });
        setShowForm(true);
    };

    const handleDelete = async (objectiveId) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الهدف التعليمي؟')) {
            setLoading(true);
            try {
                await deleteObjective(objectiveId);

                // إعادة تحميل البيانات من الأب
                if (fetchData) {
                    await fetchData();
                }
            } catch (error) {
                console.error('Error deleting objective:', error);
                alert('حدث خطأ أثناء حذف الهدف التعليمي');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancel = () => {
        resetForm();
    };

    return (
        <section className={styles.objectives}>
            {/* رأس القسم */}
            <div className={styles.sectionHeader}>
                <h4 className={styles.objTitle}>
                    <FaGraduationCap />
                    الأهداف التعليمية
                    <span className={styles.objectivesCount}>({objectives.length})</span>
                </h4>
                {IsManager &&
                    <button
                        className={styles.addButton}
                        onClick={() => setShowForm(true)}
                        disabled={loading}
                    >
                        <FaPlus />
                        إضافة هدف
                    </button>}
            </div>

            {/* نموذج الإضافة/التعديل */}
            {showForm && (
                <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit} className={styles.objectiveForm}>
                        <div className={styles.formHeader}>
                            <h5>{editingObjective ? 'تعديل الهدف التعليمي' : 'إضافة هدف تعليمي جديد'}</h5>
                            <button
                                type="button"
                                className={styles.closeFormButton}
                                onClick={handleCancel}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className={styles.formGroup}>
                            <label>عنوان الهدف *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="أدخل عنوان الهدف التعليمي..."
                                className={styles.textInput}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>وصف الهدف *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="أدخل وصفاً مفصلاً للهدف التعليمي..."
                                rows="4"
                                className={styles.textareaInput}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className={styles.cancelButton}
                                disabled={loading}
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={loading}
                            >
                                <FaSave />
                                {loading ? 'جاري الحفظ...' : (editingObjective ? 'تحديث' : 'حفظ')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* قائمة الأهداف التعليمية */}
            <div className={styles.objectivesList}>
                {loading && !showForm ? (
                    <div className={styles.loading}>
                        <div className={styles.loadingSpinner}></div>
                        <p>جاري تحميل الأهداف...</p>
                    </div>
                ) : objectives.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FaGraduationCap className={styles.emptyIcon} />
                        <p>لا توجد أهداف تعليمية مضافة بعد</p>
                        {IsManager &&
                            <button
                                className={styles.addButton}
                                onClick={() => setShowForm(true)}
                                disabled={loading}
                            >
                                <FaPlus />
                                إضافة أول هدف
                            </button>}
                    </div>
                ) : (
                    objectives.map((objective) => (
                        <div key={objective.id} className={styles.objItem}>
                            <div className={styles.objContent}>
                                <h5 className={styles.objItemTitle}>{objective.title}</h5>
                                <p className={styles.objItemDescription}>{objective.description}</p>
                            </div>
                            {IsManager &&
                                <div className={styles.objActions}>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => handleEdit(objective)}
                                        title="تعديل الهدف"
                                        disabled={loading}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(objective.id)}
                                        title="حذف الهدف"
                                        disabled={loading}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}