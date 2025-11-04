import { useState } from 'react';
import { FaEdit, FaPlus, FaTrash, FaVideo } from 'react-icons/fa';
import styles from './ReelManager.module.css';
import ReelForm from './components/ReelForm/ReelForm';
import ReelPreview from './components/ReelPreview/ReelPreview';

import { createReel, deleteReel, updateReel } from '../../../../../../../../api/books';

const ReelManager = ({ reelPreview, blockId, fetchData, IsManager }) => {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreate = () => setShowForm(true);
    const handleEdit = () => setShowForm(true);

    const handleDelete = async () => {
        if (!window.confirm('هل أنت متأكد من حذف نموذج الريل؟')) return;
        setLoading(true);
        try {
            await deleteReel(reelPreview.id);
            fetchData();
        } catch (error) {
            console.error('Error deleting reel:', error);
            alert('حدث خطأ أثناء الحذف');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (formData) => {
        setLoading(true);
        try {
            const payload = { ...formData, block: blockId };

            if (reelPreview) {
                await updateReel(reelPreview.id, payload);
            } else {
                await createReel(payload);
            }

            setShowForm(false);
            fetchData();
        } catch (error) {
            console.error('Error saving reel:', error);
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h3><FaVideo /> نموذج الريل</h3>
                    <p>إدارة نموذج الريل الخاص بهذا البلوك</p>
                </div>
                {IsManager &&
                    <div className={styles.actions}>
                        {reelPreview ? (

                            <>
                                <button
                                    className={styles.editButton}
                                    onClick={handleEdit}
                                    disabled={loading}
                                >
                                    <FaEdit /> تعديل النموذج
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={handleDelete}
                                    disabled={loading}
                                >
                                    <FaTrash /> حذف
                                </button>
                            </>
                        ) : (
                            <button
                                className={styles.createButton}
                                onClick={handleCreate}
                                disabled={loading}
                            >
                                <FaPlus /> إنشاء نموذج ريل
                            </button>
                        )}
                    </div>}
            </div>

            <div className={styles.previewSection}>
                {reelPreview ? (
                    <ReelPreview reelPreview={reelPreview} />
                ) : (

                    <div className={styles.emptyState}>
                        <FaVideo className={styles.emptyIcon} />
                        <h4>لا يوجد نموذج ريل</h4>
                        <p>قم بإنشاء نموذج ريل لمعاينة شكل الريل الخاص بهذا البلوك</p>
                        {IsManager && (
                            <>
                                <button
                                    className={styles.createButton}
                                    onClick={handleCreate}
                                >
                                    <FaPlus /> إنشاء نموذج ريل
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {showForm && (
                <ReelForm
                    reelPreview={reelPreview}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowForm(false)}
                    blockId={blockId}
                />
            )}
        </div>
    );
};

export default ReelManager;