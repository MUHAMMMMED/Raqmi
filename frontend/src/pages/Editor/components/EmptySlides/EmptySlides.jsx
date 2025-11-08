import React from "react";
import { FaPalette, FaPlus } from "react-icons/fa";
import styles from "./EmptySlides.module.css";

export default function EmptySlides({ onCreateSlide }) {
    return (
        <div className={styles.empty}>
            <FaPalette className={styles.icon} />
            <h3>لا توجد شرائح</h3>
            <p>أنشئ شريحة جديدة للبدء</p>
            <button className={styles.btn} onClick={onCreateSlide}>
                <FaPlus className={styles.btnIcon} /> إنشاء الشريحة الأولى
            </button>
        </div>
    );
}