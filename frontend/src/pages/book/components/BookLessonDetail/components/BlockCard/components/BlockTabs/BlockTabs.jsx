

import { useState } from 'react';
import { FaCreditCard, FaGraduationCap, FaQuestionCircle, FaVideo } from 'react-icons/fa';
import ExerciseManager from '../../../ExerciseManager/ExerciseManager';
import CardManager from '../CardManager/CardManager';
import Objectives from '../Objectives/Objectives';
import ReelManager from '../ReelManager/ReelManager';
import styles from './BlockTabs.module.css';

const BlockTabs = ({ objectives = [], exercises = [], flashcards = [], reelPreview = null, blockId, lessonId, partId, fetchData }) => {

    const [activeTab, setActiveTab] = useState('objectives');

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={activeTab === 'objectives' ? styles.active : ''}
                    onClick={() => setActiveTab('objectives')}
                >
                    <FaGraduationCap /> الأهداف ({objectives.length})
                </button>

                <button
                    className={activeTab === 'exercises' ? styles.active : ''}
                    onClick={() => setActiveTab('exercises')}
                >
                    <FaQuestionCircle /> التمارين ({exercises.length})
                </button>

                <button
                    className={activeTab === 'flashcards' ? styles.active : ''}
                    onClick={() => setActiveTab('flashcards')}
                >
                    <FaCreditCard /> البطاقات ({flashcards.length})
                </button>


                <button
                    className={activeTab === 'reelPreview' ? styles.active : ''}
                    onClick={() => setActiveTab('reelPreview')}
                >
                    <FaVideo /> نموذج الريل
                </button>

            </div>

            <div className={styles.content}>
                {activeTab === 'objectives' && (
                    <Objectives
                        objectives={objectives}
                        blockId={blockId}
                        fetchData={fetchData}
                    />
                )}

                {activeTab === 'exercises' && (
                    <div className={styles.exercisesContent}>

                        <ExerciseManager
                            exercises={exercises}
                            blockId={blockId}
                            lessonId={lessonId}
                            partId={partId}
                            fetchData={fetchData} />

                    </div>
                )}


                {activeTab === 'flashcards' && (
                    <div className={styles.flashcardsContent}>
                        <CardManager
                            cards={flashcards}
                            blockId={blockId}
                            lessonId={lessonId}
                            fetchData={fetchData}
                        />
                    </div>
                )}


                {activeTab === 'reelPreview' && (
                    <div className={styles.reelPreviewContent}>
                        <ReelManager
                            reelPreview={reelPreview}
                            blockId={blockId}
                            fetchData={fetchData}
                        />
                    </div>
                )}

                {/* {activeTab === 'reelPreview' && (
                    reelPreview ? (
                        <ReelPreview reelPreview={reelPreview} />
                    ) : (
                        <p className={styles.empty}>لا يوجد نموذج ريل</p>
                    )
                )} */}
            </div>
        </div>
    );
};

export default BlockTabs;