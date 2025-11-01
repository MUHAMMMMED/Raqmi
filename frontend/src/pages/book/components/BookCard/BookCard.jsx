// src/components/BookList/BookCard/BookCard.jsx
import React from 'react';
import { FaBook, FaCalendar, FaExternalLinkAlt, FaFilePdf, FaFont, FaList, FaPalette } from 'react-icons/fa';
import styles from './BookCard.module.css';

const BookCard = ({ book, onViewParts, onOpenPdf }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const design = {
        primaryColor: book.primary_color || '#1E90FF',
        secondaryColor: book.secondary_color || '#FFD700',
        backgroundColor: book.background_color || '#FFFFFF',
        mainFont: book.main_font || 'Cairo',
        descFont: book.desc_font || 'Tajawal',
        borderRadius: book.border_radius || 16,
        padding: book.padding || 12
    };

    return (
        <div
            className={styles.bookCard}
            style={{
                '--primary-color': design.primaryColor,
                '--secondary-color': design.secondaryColor,
                '--background-color': design.backgroundColor,
                '--border-radius': `${design.borderRadius}px`,
                '--padding': `${design.padding}px`,
                '--main-font': design.mainFont,
                '--desc-font': design.descFont
            }}
        >
            <div className={styles.cardHeader}>
                <div className={styles.bookIcon}>
                    <FaBook />
                </div>
                <div className={styles.bookInfo}>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <div className={styles.metaInfo}>
                        <span className={styles.metaItem}>
                            <FaCalendar className={styles.metaIcon} />
                            {formatDate(book.uploaded_at)}
                        </span>
                        <span className={styles.metaItem}>
                            <FaFilePdf className={styles.metaIcon} />
                            PDF
                        </span>
                        <span className={styles.metaItem}>
                            <FaBook className={styles.metaIcon} />
                            {book.parts?.length || 0} أجزاء
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.designPreview}>
                <div className={styles.colorPalette}>
                    <div className={styles.colorSample} style={{ backgroundColor: design.primaryColor }} title={`اللون الأساسي: ${design.primaryColor}`} />
                    <div className={styles.colorSample} style={{ backgroundColor: design.secondaryColor }} title={`اللون الثانوي: ${design.secondaryColor}`} />
                    <div className={styles.colorSample} style={{ backgroundColor: design.backgroundColor }} title={`لون الخلفية: ${design.backgroundColor}`} />
                </div>

                <div className={styles.fontPreview}>
                    <div className={styles.fontSample}>
                        <span className={styles.mainFontSample} style={{ fontFamily: design.mainFont }}>{design.mainFont}</span>
                        <span className={styles.fontLabel}>العناوين</span>
                    </div>
                    <div className={styles.fontSample}>
                        <span className={styles.descFontSample} style={{ fontFamily: design.descFont }}>{design.descFont}</span>
                        <span className={styles.fontLabel}>النصوص</span>
                    </div>
                </div>
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.designSpecs}>
                    <span className={styles.specItem}>
                        <FaPalette className={styles.specIcon} />
                        نصف قطر: {design.borderRadius}px
                    </span>
                    <span className={styles.specItem}>
                        <FaFont className={styles.specIcon} />
                        مسافة: {design.padding}px
                    </span>
                </div>
                <div className={styles.actionButtons}>
                    <button className={styles.secondaryButton} onClick={() => onOpenPdf(book.pdf)}>
                        <FaExternalLinkAlt className={styles.buttonIcon} />
                        فتح الكتاب
                    </button>
                    <button className={styles.primaryButton} onClick={() => onViewParts(book)}>
                        <FaList className={styles.buttonIcon} />
                        عرض الأجزاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;