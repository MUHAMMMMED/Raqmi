
import React, { useState } from 'react';
import EmptyState from '../EmptyState/EmptyState';
import PartCard from './components/PartCard/PartCard';
import PartForm from './components/PartForm/PartForm';
import styles from './PartManager.module.css';

export default function PartManager({ selectedBook, handleViewLessons, handleBackToBooks, onPartsUpdate }) {
    const [showCreateForm, setShowCreateForm] = useState(false);

    if (!selectedBook) return null;

    const parts = selectedBook.parts || [];

    return (
        <div className={styles.container}>
            {/* رأس الصفحة */}
            <div className={styles.header}>
                <h2 className={styles.title}>أجزاء الكتاب: {selectedBook.title}</h2>
                <div className={styles.actions}>
                    <button className={styles.addButton} onClick={() => setShowCreateForm(true)}>
                        + إضافة جزء
                    </button>
                    <button className={styles.backButton} onClick={handleBackToBooks}>
                        العودة
                    </button>
                </div>
            </div>

            {/* نموذج إضافة جزء */}
            {showCreateForm && (
                <div className={styles.modalOverlay} onClick={() => setShowCreateForm(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <PartForm
                            bookId={selectedBook.id}
                            onSuccess={() => {
                                setShowCreateForm(false);
                                onPartsUpdate?.();
                            }}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    </div>
                </div>
            )}

            {/* قائمة الأجزاء */}
            {parts.length === 0 ? (
                <EmptyState
                    icon="book"
                    title="لا توجد أجزاء"
                    description="ابدأ بإضافة جزء جديد"
                    buttonText="إضافة جزء"
                    onButtonClick={() => setShowCreateForm(true)}
                />
            ) : (
                <div className={styles.partsGrid}>
                    {parts
                        .sort((a, b) => a.order - b.order)
                        .map(part => (
                            <PartCard
                                key={part.id}
                                part={part}
                                bookId={selectedBook.id}
                                onViewLessons={handleViewLessons}
                                onUpdate={onPartsUpdate}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}