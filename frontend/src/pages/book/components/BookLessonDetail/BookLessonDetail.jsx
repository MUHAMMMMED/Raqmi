import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookLesson } from '../../../../api/books';

import BookBlockManager from './components/BookBlockManager/BookBlockManager';
import EmptyState from './components/EmptyState/EmptyState';
import HeaderSection from './components/HeaderSection/HeaderSection';
import LoadingState from './components/LoadingState/LoadingState';
import OverviewSection from './components/OverviewSection/OverviewSection';
import TabsSection from './components/TabsSection/TabsSection';

import styles from './BookLessonDetail.module.css';
import ExerciseCard from './components/ExerciseManager/components/ExerciseCard/ExerciseCard';

const BookLessonDetail = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('content');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getBookLesson(lessonId);
            setLesson(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [lessonId, refreshTrigger]);

    const handleBlockUpdate = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (loading) return <LoadingState />;
    if (!lesson) return <EmptyState message="الدرس غير موجود" onBack={() => navigate(-1)} />;

    const sortedBlocks = (lesson.blocks || []).sort((a, b) => a.order - b.order);
    const sortedExercises = (lesson.exercises || []).sort((a, b) => a.order - b.order);

    return (
        <div className={styles.container}>
            <HeaderSection lesson={lesson} onBack={() => navigate(-1)} />
            <TabsSection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                blocksCount={lesson.blocks?.length || 0}
                exercisesCount={lesson.exercises?.length || 0}
                showManagement={true}
            />

            <section className={styles.content}>
                {activeTab === 'content' && (
                    <div className={styles.contentSection}>
                        <div className={styles.managementSection}>


                            <BookBlockManager
                                Blocks={sortedBlocks}
                                lessonId={lessonId}
                                partId={lesson?.part}
                                onUpdate={handleBlockUpdate}
                                fetchData={load}
                                IsManager={false}
                            />

                        </div>
                    </div>
                )}



                {activeTab === 'exercises' && (
                    <div className={styles.list}>
                        {sortedExercises.length > 0 ? (
                            sortedExercises.map((exercise) => (
                                <ExerciseCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    onEdit={(ex) => console.log('edit', ex)}
                                    onDelete={(ex) => console.log('delete', ex)}
                                />
                            ))
                        ) : (
                            <EmptyState message="لا توجد تمارين" />
                        )}
                    </div>
                )}

                {activeTab === 'overview' && <OverviewSection lesson={lesson} />}

                {activeTab === 'management' && (
                    <BookBlockManager
                        Blocks={sortedBlocks}
                        lessonId={lessonId}
                        partId={lesson.part}
                        onUpdate={handleBlockUpdate}
                        fetchData={load}
                        IsManager={true}
                    />
                )}
            </section>
        </div>
    );
};

export default BookLessonDetail;




