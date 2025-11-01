
import React from 'react';
import BookUpload from '../BookUpload/BookUpload';
import styles from './BookUploadModal.module.css';

const BookUploadModal = ({ isOpen, onClose, onSuccess }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.uploadModal}>
            <div className={styles.modalContent}>
                <BookUpload onSuccess={onSuccess} onCancel={onClose} />
            </div>
            <div className={styles.modalOverlay} onClick={onClose} />
        </div>
    );
};

export default BookUploadModal;