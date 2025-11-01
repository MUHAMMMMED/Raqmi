
import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSave, FaTimes, FaTrash, FaUndo } from 'react-icons/fa';

import styles from './PartManagerModal.module.css';

import { createPart, deletePart, updatePart } from '../../../../api/parts';
const PartManagerModal = ({ book, isOpen, onClose, onUpdate }) => {
    const [parts, setParts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        order: 0,
        start_page: '',
        end_page: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (book?.parts) {
            setParts([...book.parts].sort((a, b) => a.order - b.order));
        }
    }, [book]);

    const handleCreate = async () => {
        if (!formData.title.trim()) return;
        setLoading(true);
        try {
            const newPart = await createPart(book.id, formData);
            setParts(prev => [...prev, newPart].sort((a, b) => a.order - b.order));
            setFormData({ title: '', order: 0, start_page: '', end_page: '' });
            onUpdate();
        } catch (error) {
            console.error('Error creating part:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (partId) => {
        const part = parts.find(p => p.id === partId);
        setLoading(true);
        try {
            const updated = await updatePart(partId, formData);
            setParts(prev => prev.map(p => p.id === partId ? updated : p));
            setEditingId(null);
            setFormData({ title: '', order: 0, start_page: '', end_page: '' });
            onUpdate();
        } catch (error) {
            console.error('Error updating part:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (partId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الجزء؟')) return;
        setLoading(true);
        try {
            await deletePart(partId);
            setParts(prev => prev.filter(p => p.id !== partId));
            onUpdate();
        } catch (error) {
            console.error('Error deleting part:', error);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (part) => {
        setEditingId(part.id);
        setFormData({
            title: part.title,
            order: part.order,
            start_page: part.start_page || '',
            end_page: part.end_page || ''
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', order: 0, start_page: '', end_page: '' });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>إدارة أجزاء الكتاب: {book.title}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {/* نموذج الإضافة */}
                    <div className={styles.addForm}>
                        <h3><FaPlus /> إضافة جزء جديد</h3>
                        <div className={styles.formGrid}>
                            <input
                                type="text"
                                placeholder="عنوان الجزء"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="ترتيب"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: +e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="صفحة البداية"
                                value={formData.start_page}
                                onChange={(e) => setFormData({ ...formData, start_page: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="صفحة النهاية"
                                value={formData.end_page}
                                onChange={(e) => setFormData({ ...formData, end_page: e.target.value })}
                            />
                            <button
                                className={styles.addButton}
                                onClick={handleCreate}
                                disabled={loading || !formData.title.trim()}
                            >
                                <FaPlus /> إضافة
                            </button>
                        </div>
                    </div>

                    {/* قائمة الأجزاء */}
                    <div className={styles.partsTable}>
                        <h3>الأجزاء الحالية ({parts.length})</h3>
                        {parts.length === 0 ? (
                            <p className={styles.empty}>لا توجد أجزاء بعد. أضف أول جزء!</p>
                        ) : (
                            <div className={styles.table}>
                                {parts.map(part => (
                                    <div key={part.id} className={styles.partRow}>
                                        {editingId === part.id ? (
                                            <>
                                                <input
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                />
                                                <input
                                                    type="number"
                                                    value={formData.order}
                                                    onChange={(e) => setFormData({ ...formData, order: +e.target.value })}
                                                />
                                                <input
                                                    type="number"
                                                    value={formData.start_page}
                                                    onChange={(e) => setFormData({ ...formData, start_page: e.target.value })}
                                                />
                                                <input
                                                    type="number"
                                                    value={formData.end_page}
                                                    onChange={(e) => setFormData({ ...formData, end_page: e.target.value })}
                                                />
                                                <button onClick={() => handleUpdate(part.id)} disabled={loading}>
                                                    <FaSave />
                                                </button>
                                                <button onClick={cancelEdit} disabled={loading}>
                                                    <FaUndo />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className={styles.partTitle}>{part.title}</span>
                                                <span>ترتيب: {part.order}</span>
                                                <span>
                                                    {part.start_page ? `من ${part.start_page}` : '—'}
                                                    {part.end_page ? ` إلى ${part.end_page}` : ''}
                                                </span>
                                                <div className={styles.actions}>
                                                    <button onClick={() => startEdit(part)} className={styles.editBtn}>
                                                        <FaEdit />
                                                    </button>
                                                    <button onClick={() => handleDelete(part.id)} className={styles.deleteBtn}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.overlay} onClick={onClose} />
        </div>
    );
};

export default PartManagerModal;