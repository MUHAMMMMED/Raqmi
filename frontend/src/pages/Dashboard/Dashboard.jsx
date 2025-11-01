// pages/Dashboard/Dashboard.jsx
import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1>لوحة التحكم</h1>
                <p>مرحباً بك في نظام إدارة المحتوى التعليمي</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📚</div>
                    <div className={styles.statContent}>
                        <h3>الكورسات</h3>
                        <span className={styles.statNumber}>12</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📖</div>
                    <div className={styles.statContent}>
                        <h3>الدروس</h3>
                        <span className={styles.statNumber}>45</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>🎬</div>
                    <div className={styles.statContent}>
                        <h3>الريلز</h3>
                        <span className={styles.statNumber}>89</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>👥</div>
                    <div className={styles.statContent}>
                        <h3>المستخدمين</h3>
                        <span className={styles.statNumber}>156</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;