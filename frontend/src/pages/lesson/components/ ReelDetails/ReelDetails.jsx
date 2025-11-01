// ReelDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLesson } from "../../../../api/lessons";
import { getReelsByLesson } from "../../../../api/reels"; // تأكد من المسار الصحيح
import styles from './ReelDetails.module.css';

import {
    FaArrowLeft,
    FaAudioDescription,
    FaMagic,
    FaMusic,
    FaPlay,
    FaPlus,
    FaVideo
} from 'react-icons/fa';

const ReelDetails = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReel, setSelectedReel] = useState(null);

    useEffect(() => {
        loadData();
    }, [lessonId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [lessonData, reelsData] = await Promise.all([
                getLesson(lessonId),
                getReelsByLesson(lessonId)
            ]);
            setLesson(lessonData);
            setReels(reelsData);
        } catch (error) {
            console.error('Error loading data:', error);
            // في حالة الخطأ، ضع مصفوفة فارغة لتجنب الأخطاء
            setReels([]);
        } finally {
            setLoading(false);
        }
    };

    const getAudioStrategyText = (strategy) => {
        const strategies = {
            'global': 'موسيقى خلفية عامة',
            'per_segment': 'صوت لكل مقطع',
            'none': 'بدون صوت'
        };
        return strategies[strategy] || strategy;
    };

    const handleCreateReel = () => {
        // التنقل إلى صفحة إنشاء ريل جديد
        navigate(`/lessons/${lessonId}/reels/create`);
    };

    const ReelItem = ({ reel, index }) => {
        return (
            <div
                className={styles.reelItem}
                onClick={() => setSelectedReel(reel)}
            >
                <div className={styles.reelHeader}>
                    <div className={styles.reelNumber}>
                        <FaVideo className={styles.videoIcon} />
                        <span>ريل #{index + 1}</span>
                    </div>
                    {reel.ai_generated && (
                        <div className={styles.aiBadge}>
                            <FaMagic className={styles.aiIcon} />
                            <span>تم إنشاؤه بالذكاء الاصطناعي</span>
                        </div>
                    )}
                </div>

                <div className={styles.reelContent}>
                    <h4 className={styles.reelTitle}>{reel.title}</h4>

                    {reel.description && (
                        <p className={styles.reelDescription}>
                            {reel.description.substring(0, 100)}...
                        </p>
                    )}

                    <div className={styles.reelProperties}>
                        <div className={styles.property}>
                            <FaAudioDescription className={styles.propertyIcon} />
                            <span>{getAudioStrategyText(reel.audio_strategy)}</span>
                        </div>

                        <div className={styles.property}>
                            <span>نوع الصوت: {reel.voice_type}</span>
                        </div>

                        {reel.background_music && (
                            <div className={styles.property}>
                                <FaMusic className={styles.propertyIcon} />
                                <span>موسيقى خلفية</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.reelFooter}>
                    <button
                        className={styles.playButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            // TODO: تشغيل المعاينة
                            console.log('تشغيل معاينة الريل:', reel.id);
                        }}
                    >
                        <FaPlay />
                        تشغيل المعاينة
                    </button>
                    <div className={styles.reelMeta}>
                        <span>تم الإنشاء: {new Date(reel.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل الريلز...</p>
            </div>
        );
    }

    return (
        <div className={styles.reelDetailsContainer}>
            {/* رأس الصفحة */}
            <div className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft />
                    رجوع
                </button>
                <div className={styles.headerContent}>
                    <FaVideo className={styles.headerIcon} />
                    <div>
                        <h1>إدارة الريلز</h1>
                        <p>{lesson?.title} - {reels.length} ريل</p>
                    </div>
                </div>
                <button
                    className={styles.addButton}
                    onClick={handleCreateReel}
                >
                    <FaPlus />
                    إنشاء ريل جديد
                </button>
            </div>

            {/* إحصائيات عامة */}
            <div className={styles.statsOverview}>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>{reels.length}</span>
                    <span className={styles.statLabel}>إجمالي الريلز</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {reels.filter(reel => reel.ai_generated).length}
                    </span>
                    <span className={styles.statLabel}>ريل بالذكاء الاصطناعي</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {reels.filter(reel => reel.background_music).length}
                    </span>
                    <span className={styles.statLabel}>ريل بموسيقى</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {reels.filter(reel => reel.audio_track).length}
                    </span>
                    <span className={styles.statLabel}>ريل بملف صوتي</span>
                </div >
            </div >

            {/* قائمة الريلز */}
            < div className={styles.reelsGrid} >
                {
                    reels.length > 0 ? (
                        reels.map((reel, index) => (
                            <ReelItem key={reel.id} reel={reel} index={index} />
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <FaVideo className={styles.emptyIcon} />
                            <h3>لا توجد ريلز بعد</h3>
                            <p>ابدأ بإنشاء أول ريل تعليمي</p>
                            <button
                                className={styles.addButton}
                                onClick={handleCreateReel}
                            >
                                <FaPlus />
                                إنشاء ريل جديد
                            </button>
                        </div>
                    )
                }
            </div >

            {/* نافذة عرض تفاصيل الريل */}
            {
                selectedReel && (
                    <div className={styles.reelModal}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h2>تفاصيل الريل</h2>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setSelectedReel(null)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.detailGrid}>
                                    <div className={styles.detailItem}>
                                        <label>العنوان:</label>
                                        <span>{selectedReel.title}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <label>الوصف:</label>
                                        <span>{selectedReel.description || "لا يوجد وصف"}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <label>إستراتيجية الصوت:</label>
                                        <span>{getAudioStrategyText(selectedReel.audio_strategy)}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <label>نوع الصوت:</label>
                                        <span>{selectedReel.voice_type}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <label>تم الإنشاء بالذكاء الاصطناعي:</label>
                                        <span>{selectedReel.ai_generated ? 'نعم' : 'لا'}</span>
                                    </div>
                                    {selectedReel.ai_generated_at && (
                                        <div className={styles.detailItem}>
                                            <label>تاريخ الإنشاء بالذكاء الاصطناعي:</label>
                                            <span>{new Date(selectedReel.ai_generated_at).toLocaleString('ar-EG')}</span>
                                        </div>
                                    )}
                                    {selectedReel.template && (
                                        <div className={styles.detailItem}>
                                            <label>القالب:</label>
                                            <span>{selectedReel.template.name}</span>
                                        </div>
                                    )}
                                </div>

                                {selectedReel.segments && selectedReel.segments.length > 0 && (
                                    <div className={styles.templateSection}>
                                        <h3>المقاطع:</h3>
                                        <div className={styles.segmentsList}>
                                            {selectedReel.segments.map((segment, index) => (
                                                <div key={segment.id} className={styles.segmentItem}>
                                                    <strong>#{index + 1} - {segment.part}</strong>:
                                                    {segment.type} ({segment.duration_seconds} ثانية)
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            className={styles.modalOverlay}
                            onClick={() => setSelectedReel(null)}
                        />
                    </div>
                )
            }
        </div >
    );
};

export default ReelDetails;