
import React from 'react';
import styles from './TabsSection.module.css';

const TabsSection = ({
    activeTab,
    setActiveTab,
    blocksCount = 0,
    exercisesCount = 0,

}) => {
    const tabs = [
        { id: 'content', label: `المحتوى التعليمي (${blocksCount})` },
        { id: 'exercises', label: `التمارين (${exercisesCount})` },
        { id: 'overview', label: 'نظرة عامة' }
    ];



    return (
        <div className={styles.tabs}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default TabsSection;