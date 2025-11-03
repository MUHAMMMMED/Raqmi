
import React, { useState } from 'react';
import EmptyState from '../EmptyState/EmptyState';
import LessonCard from './components/LessonCard/LessonCard';
import LessonForm from './components/LessonForm/LessonForm';
import styles from './LessonManager.module.css';

export default function LessonManager({ selectedPart, selectedBook, handleLessonClick, handleBackToParts, onLessonsUpdate }) {
    const [showCreateForm, setShowCreateForm] = useState(false);

    if (!selectedPart) return null;

    const lessons = selectedPart.lessons || [];

    return (
        <div className={styles.container}>
            {/* رأس الصفحة */}
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>دروس الجزء: {selectedPart.title}</h2>
                    <p className={styles.subtitle}>الكتاب: {selectedBook?.title}</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.addButton} onClick={() => setShowCreateForm(true)}>
                        + إضافة درس
                    </button>
                    <button className={styles.backButton} onClick={handleBackToParts}>
                        العودة
                    </button>
                </div>
            </div>

            {/* نموذج إضافة درس */}
            {showCreateForm && (
                <div className={styles.modalOverlay} onClick={() => setShowCreateForm(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <LessonForm
                            partId={selectedPart.id}
                            onSuccess={() => {
                                setShowCreateForm(false);
                                onLessonsUpdate?.();
                            }}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    </div>
                </div>
            )}

            {/* قائمة الدروس */}
            {lessons.length === 0 ? (
                <EmptyState
                    icon="graduation-cap"
                    title="لا توجد دروس"
                    description="ابدأ بإضافة درس جديد"
                    buttonText="إضافة درس"
                    onButtonClick={() => setShowCreateForm(true)}
                />
            ) : (
                <div className={styles.lessonsGrid}>
                    {lessons
                        .sort((a, b) => a.order - b.order)
                        .map(lesson => (
                            <LessonCard
                                key={lesson.id}
                                lesson={lesson}
                                partId={selectedPart.id}
                                onClick={handleLessonClick}
                                onUpdate={onLessonsUpdate}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}