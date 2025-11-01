// src/components/BookList/EmptyState/EmptyState.jsx
import React from 'react';
import { FaBook, FaGraduationCap, FaUpload } from 'react-icons/fa';
import styles from './EmptyState.module.css';

const iconMap = {
    book: FaBook,
    'graduation-cap': FaGraduationCap,
    upload: FaUpload
};

const EmptyState = ({ icon, title, description, buttonText, buttonIcon, onButtonClick }) => {
    const Icon = iconMap[icon] || FaBook;

    return (
        <div className={styles.emptyState}>
            <Icon className={styles.emptyIcon} />
            <h2>{title}</h2>
            <p>{description}</p>
            <button className={styles.actionButton} onClick={onButtonClick}>
                {buttonIcon && <FaUpload className={styles.buttonIcon} />}
                {buttonText}
            </button>
        </div>
    );
};

export default EmptyState;