
import { useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import FlashCardItem from '../CardManager/components/FlashCardItem/FlashCardItem';
import styles from './CardManager.module.css';
import CardForm from './components/CardForm/CardForm';

import {
    createCard,
    deleteCard,
    updateCard,
} from '../../../../../../../../api/cards';

const CardManager = ({ cards = [], blockId, lessonId, fetchData, IsManager }) => {
    const [showForm, setShowForm] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCreate = () => {
        setEditingCard(null);
        setShowForm(true);
    };

    const handleEdit = (card) => {
        setEditingCard(card);
        setShowForm(true);
    };

    const handleDelete = async (cardId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه البطاقة؟')) return;
        setLoading(true);
        try {
            await deleteCard(cardId);
            fetchData();
        } catch (error) {
            console.error('Error deleting card:', error);
            alert('حدث خطأ أثناء الحذف');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (formData) => {
        setLoading(true);
        try {
            if (editingCard) {
                await updateCard(editingCard.id, formData);
            } else {
                await createCard(formData);
            }
            setShowForm(false);
            setEditingCard(null);
            fetchData();
        } catch (error) {
            console.error('Error saving card:', error);
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h3>إدارة البطاقات التعليمية</h3>
                {IsManager &&
                    <button className={styles.addButton} onClick={handleCreate} disabled={loading}>
                        <FaPlus /> إضافة بطاقة جديدة
                    </button>}
            </div>

            {/* Cards Grid */}
            <div className={styles.cardsGrid}>
                {cards.map((card) => (
                    <div key={card.id} className={styles.cardWrapper}>
                        {IsManager &&
                            <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => handleEdit(card)}
                                    disabled={loading}
                                >
                                    <FaEdit /> تعديل
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(card.id)}
                                    disabled={loading}
                                >
                                    <FaTrash /> حذف
                                </button>
                            </div>
                        }
                        <FlashCardItem card={card} />
                    </div>
                ))}
            </div>


            {/* Empty State */}
            {cards.length === 0 && (
                <div className={styles.emptyState}>
                    <p>لا توجد بطاقات تعليمية حتى الآن</p>
                    {IsManager &&
                        <button className={styles.addButton} onClick={handleCreate}>
                            <FaPlus /> إضافة أول بطاقة
                        </button>}
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <CardForm
                    card={editingCard}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingCard(null);
                    }}
                    blockId={blockId}
                    lessonId={lessonId}
                />
            )}
        </div>
    );
};

export default CardManager;