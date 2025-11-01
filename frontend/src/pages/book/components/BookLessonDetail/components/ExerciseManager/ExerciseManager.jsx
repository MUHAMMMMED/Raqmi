import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { createExercise, deleteExercise, updateExercise } from '../../../../../../api/exercise';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import styles from './ExerciseManager.module.css';
import ExerciseCard from './components/ExerciseCard/ExerciseCard';
import ExerciseForm from './components/ExerciseForm/ExerciseForm';

const ExerciseManager = ({ blockId, lessonId, partId, exercises = [], onUpdate, fetchData }) => {
    const [showForm, setShowForm] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [exerciseToDelete, setExerciseToDelete] = useState(null);
    const [loading, setLoading] = useState(false);



    const handleCreate = async (data) => {
        try {
            setLoading(true);


            const exerciseData = {
                ...data
            };

            // ضمان قيم افتراضية
            if (exerciseData.order === null || exerciseData.order === undefined) {
                exerciseData.order = 0;
            }
            if (exerciseData.page_number === '') {
                exerciseData.page_number = null;
            }


            await createExercise(exerciseData);
            setShowForm(false);
            fetchData();
            onUpdate?.();
        } catch (err) {
            console.error('تفاصيل الخطأ في الإنشاء:', err);
            alert(`فشل في إنشاء التمرين: ${err.response?.data?.message || err.message || 'يرجى المحاولة مرة أخرى'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (data) => {
        try {
            setLoading(true);


            const exerciseData = {
                ...data
            };

            if (exerciseData.order === null || exerciseData.order === undefined) {
                exerciseData.order = 0;
            }
            if (exerciseData.page_number === '') {
                exerciseData.page_number = null;
            }

            await updateExercise(editingExercise.id, exerciseData);
            setShowForm(false);
            fetchData();
            setEditingExercise(null);
            onUpdate?.();
        } catch (err) {
            console.error('تفاصيل الخطأ في التحديث:', err);
            alert(`فشل في تحديث التمرين: ${err.response?.data?.message || err.message || 'يرجى المحاولة مرة أخرى'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await deleteExercise(id);
            setExerciseToDelete(null);
            fetchData();
            onUpdate?.();
        } catch (err) {
            console.error('تفاصيل الخطأ في الحذف:', err);
            alert(`فشل في الحذف: ${err.response?.data?.message || err.message || 'يرجى المحاولة مرة أخرى'}`);
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (ex) => {
        setEditingExercise(ex);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingExercise(null);
    };

    if (loading) return <div className={styles.loading}>جاري التحميل...</div>;

    return (
        <div className={styles.manager}>
            <div className={styles.header}>
                <h3>إدارة التمارين ({exercises.length})</h3>
                <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                    <FaPlus /> إضافة تمرين
                </button>
            </div>

            {showForm && (
                <ExerciseForm
                    exercise={editingExercise}
                    onSubmit={editingExercise ? handleUpdate : handleCreate}
                    onCancel={closeForm}
                    blockId={blockId}
                    lessonId={lessonId}
                    partId={partId}


                />
            )}

            <div className={styles.list}>
                {exercises.length === 0 ? (
                    <p className={styles.empty}>لا توجد تمارين</p>
                ) : (
                    exercises.map(ex => (
                        <div key={ex.id} className={styles.item}>
                            <ExerciseCard
                                exercise={ex}
                                onEdit={openEdit}
                                onDelete={setExerciseToDelete}
                            />
                        </div>
                    ))
                )}
            </div>

            {exerciseToDelete && (
                <ConfirmModal
                    title="تأكيد الحذف"
                    message={`حذف التمرين: "${exerciseToDelete.question_text?.substring(0, 50)}..."؟`}
                    onConfirm={() => handleDelete(exerciseToDelete.id)}
                    onCancel={() => setExerciseToDelete(null)}
                />
            )}
        </div>
    );
};

export default ExerciseManager;