
import React from 'react';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className={styles.modalActions}>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        إلغاء
                    </button>
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        تأكيد الحذف
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;