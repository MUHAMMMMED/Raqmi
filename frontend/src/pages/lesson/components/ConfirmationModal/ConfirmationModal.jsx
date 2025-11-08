import React from 'react';
import { FaCheck, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "تأكيد",
    cancelText = "إلغاء",
    type = "warning"
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <FaExclamationTriangle className={styles.iconDanger} />;
            case 'success':
                return <FaCheck className={styles.iconSuccess} />;
            default:
                return <FaExclamationTriangle className={styles.iconWarning} />;
        }
    };

    const getButtonClass = () => {
        switch (type) {
            case 'danger':
                return styles.confirmButtonDanger;
            case 'success':
                return styles.confirmButtonSuccess;
            default:
                return styles.confirmButtonWarning;
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    {getIcon()}
                    <h2 className={styles.modalTitle}>{title}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <p className={styles.message}>{message}</p>
                </div>

                <div className={styles.modalActions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.confirmButton} ${getButtonClass()}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;