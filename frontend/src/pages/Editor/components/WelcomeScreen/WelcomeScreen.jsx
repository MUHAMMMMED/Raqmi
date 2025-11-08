import React from "react";
import { FaPalette, FaPlus } from "react-icons/fa";
import styles from "./WelcomeScreen.module.css";

export default function WelcomeScreen({ onCreateSlide }) {
    return (
        <div className={styles.screen}>
            <div className={styles.content}>
                <FaPalette className={styles.icon} />
                <h1>مرحباً في مصمم الشرائح</h1>
                <p>اختر شريحة من القائمة الجانبية لبدء التصميم، أو أنشئ شريحة جديدة</p>
                <button className={styles.btn} onClick={onCreateSlide}>
                    <FaPlus className={styles.btnIcon} /> إنشاء شريحة جديدة
                </button>
            </div>
        </div>
    );
}