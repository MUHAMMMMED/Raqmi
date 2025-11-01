// src/components/BookList/HeaderSection/HeaderSection.jsx
import React from 'react';
import { FaBook, FaGraduationCap, FaList, FaPlus, FaTimes } from 'react-icons/fa';
import styles from './HeaderSection.module.css';

const HeaderSection = ({
    showLessons,
    showParts,
    selectedBook,
    selectedPart,
    booksCount,
    onAddBook,
    onBackToParts,
    onBackToBooks
}) => {
    const getHeaderConfig = () => {
        if (showLessons) {
            return {
                icon: <FaGraduationCap className={styles.headerIcon} />,
                title: `دروس الجزء: ${selectedPart?.title}`,
                subtitle: 'استعراض وبدء دراسة الدروس التعليمية',
                stat: selectedPart?.lessons?.length || 0,
                statLabel: 'درس متاح',
                action: (
                    <button className={styles.backButton} onClick={onBackToParts}>
                        <FaTimes className={styles.buttonIcon} />
                        العودة للأجزاء
                    </button>
                )
            };
        }
        if (showParts) {
            return {
                icon: <FaList className={styles.headerIcon} />,
                title: `أجزاء الكتاب: ${selectedBook?.title}`,
                subtitle: 'إدارة واستعراض أجزاء الكتاب التعليمية',
                stat: selectedBook?.parts?.length || 0,
                statLabel: 'جزء متاح',
                action: (
                    <button className={styles.backButton} onClick={onBackToBooks}>
                        <FaTimes className={styles.buttonIcon} />
                        العودة للكتب
                    </button>
                )
            };
        }
        return {
            icon: <FaBook className={styles.headerIcon} />,
            title: 'مكتبة الكتب التعليمية',
            subtitle: 'اختر كتاباً لبدء رحلة التعلم واستكشاف الدروس',
            stat: booksCount,
            statLabel: 'كتاب متاح',
            action: (
                <button className={styles.addBookButton} onClick={onAddBook}>
                    <FaPlus className={styles.buttonIcon} />
                    إضافة كتاب جديد
                </button>
            )
        };
    };

    const config = getHeaderConfig();

    return (
        <div className={styles.headerSection}>
            <div className={styles.headerContent}>
                <div className={styles.titleSection}>
                    {config.icon}
                    <div>
                        <h1 className={styles.mainTitle}>{config.title}</h1>
                        <p className={styles.subtitle}>{config.subtitle}</p>
                    </div>
                </div>
                <div className={styles.statsSection}>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>{config.stat}</span>
                        <span className={styles.statLabel}>{config.statLabel}</span>
                    </div>
                    {config.action}
                </div>
            </div>
        </div>
    );
};

export default HeaderSection;