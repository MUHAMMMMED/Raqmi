
import React, { useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import BlockCard from '../BlockCard/BlockCard';
import BookBlockForm from '../BookBlockForm/BookBlockForm';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import styles from './BookBlockManager.module.css';

import { createBlock, deleteBlock, updateBlock } from '../../../../../../api/books';



const BookBlockManager = ({ lessonId, partId, onUpdate, Blocks = [], fetchData }) => {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingBlock, setEditingBlock] = useState(null);
    const [blockToDelete, setBlockToDelete] = useState(null);


    if (!lessonId) {
        console.error("lessonId is missing in BookBlockManager!");
    }

    const handleCreate = async (blockData) => {
        try {
            setLoading(true);
            console.log("Creating block with data:", Object.fromEntries(blockData));
            await createBlock(blockData);
            setShowForm(false);
            fetchData?.();
            onUpdate?.();
        } catch (error) {
            console.error('Error creating block:', error);
            alert("فشل في إنشاء المحتوى. تحقق من البيانات.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (blockData) => {
        try {
            setLoading(true);
            console.log("Updating block with data:", Object.fromEntries(blockData));
            await updateBlock(editingBlock.id, blockData);
            setShowForm(false);
            fetchData?.();
            setEditingBlock(null);
            onUpdate?.();
        } catch (error) {
            console.error('Error updating block:', error);
            alert("فشل في تحديث المحتوى.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (blockId) => {
        try {
            setLoading(true);
            await deleteBlock(blockId);
            setBlockToDelete(null);
            onUpdate?.();
        } catch (error) {
            console.error('Error deleting block:', error);
            alert("فشل في حذف المحتوى.");
        } finally {
            setLoading(false);
        }
    };

    const openEditForm = (block) => {
        setEditingBlock(block);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingBlock(null);
    };

    if (loading) return <div className={styles.loading}>جاري التحميل...</div>;

    return (
        <div className={styles.manager}>
            <div className={styles.header}>
                <h3>إدارة المحتوى التعليمي</h3>
                <div className={styles.actions}>
                    <button
                        className={styles.addButton}
                        onClick={() => setShowForm(true)}
                        disabled={loading}
                    >
                        <FaPlus />
                        إضافة محتوى جديد
                    </button>
                </div>
            </div>

            {showForm && (
                <BookBlockForm
                    block={editingBlock}
                    onSubmit={editingBlock ? handleUpdate : handleCreate}
                    onCancel={closeForm}
                    lessonId={lessonId}
                    fetchData={fetchData}

                />
            )}

            <div className={styles.blocksList}>
                {Blocks.length === 0 ? (
                    <div className={styles.emptyState}>لا يوجد محتوى تعليمي</div>
                ) : (
                    Blocks.map(block => (
                        <div key={block.id} className={styles.blockItem}>
                            <div className={styles.blockCardContainer}>
                                <BlockCard block={block} fetchData={fetchData} lessonId={lessonId} partId={partId} />
                            </div>
                            <div className={styles.blockActions}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => openEditForm(block)}
                                    disabled={loading}
                                >
                                    <FaEdit /> تعديل
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => setBlockToDelete(block)}
                                    disabled={loading}
                                >
                                    <FaTrash /> حذف
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {blockToDelete && (
                <ConfirmModal
                    title="تأكيد الحذف"
                    message={`هل أنت متأكد من حذف "${blockToDelete.title}"؟`}
                    onConfirm={() => handleDelete(blockToDelete.id)}
                    onCancel={() => setBlockToDelete(null)}
                />
            )}
        </div>
    );
};

export default BookBlockManager;