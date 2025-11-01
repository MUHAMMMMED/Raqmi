import { useState } from 'react';
import { FaChartBar, FaEye, FaEyeSlash, FaPlay } from 'react-icons/fa';
import styles from './FlashCardItem.module.css';

const FlashCardItem = ({ card }) => {
    const [flipped, setFlipped] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showVideo, setShowVideo] = useState(false);


    const totalReviews = card.again_count + card.hard_count + card.good_count + card.easy_count;

    const hasVideo = card.front_video && card.front_video.trim() !== '';

    return (
        <div className={styles.cardContainer}>
            <div className={styles.card} onClick={() => setFlipped(!flipped)}>
                <div className={`${styles.inner} ${flipped ? styles.flipped : ''}`}>
                    {/* الوجه الأمامي */}
                    <div className={styles.front}>
                        <div className={styles.header}>
                            <span className={styles.eye}><FaEye /></span>
                            <span className={styles.label}>الوجه الأمامي</span>
                            {hasVideo && (
                                <span className={styles.videoBadge}>
                                    <FaPlay /> فيديو
                                </span>
                            )}
                        </div>
                        <div className={styles.content}>
                            {hasVideo && !showVideo && (
                                <div className={styles.videoPlaceholder}>
                                    <div className={styles.videoThumbnail}>
                                        <img
                                            src={`https://img.youtube.com/vi/${card.front_video}/hqdefault.jpg`}
                                            alt="فيديو تعليمي"
                                            className={styles.videoImage}
                                        />
                                        <button
                                            className={styles.playButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowVideo(true);
                                            }}
                                        >
                                            <FaPlay />
                                        </button>
                                    </div>
                                    <p className={styles.videoText}>انقر لمشاهدة الفيديو</p>
                                </div>
                            )}

                            {hasVideo && showVideo && (
                                <div className={styles.videoContainer}>
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${card.front_video}?autoplay=1`}
                                        title="فيديو تعليمي"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className={styles.youtubeVideo}
                                    ></iframe>
                                    <button
                                        className={styles.hideVideoButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowVideo(false);
                                        }}
                                    >
                                        إخفاء الفيديو
                                    </button>
                                </div>
                            )}

                            {card.front_image && (
                                <img src={card.front_image} alt="front" className={styles.image} />
                            )}
                            {card.front_text && card.front_text.trim() && (
                                <p className={styles.text}>{card.front_text}</p>
                            )}
                        </div>
                    </div>

                    {/* الوجه الخلفي */}
                    <div className={styles.back}>
                        <div className={styles.header}>
                            <span className={styles.eye}><FaEyeSlash /></span>
                            <span className={styles.label}>الوجه الخلفي (السؤال)</span>
                        </div>
                        <div className={styles.content}>
                            {card.question_image && (
                                <img src={card.question_image} alt="question" className={styles.image} />
                            )}
                            {card.question_text && card.question_text.trim() && (
                                <p className={styles.text}>{card.question_text}</p>
                            )}

                            <div className={styles.options}>
                                {['a', 'b', 'c', 'd'].map(letter => {
                                    const option = card[`option_${letter}`];
                                    if (!option || !option.trim()) return null;
                                    return (
                                        <div
                                            key={letter}
                                            className={`${styles.option} ${card.correct_answer?.toUpperCase() === letter.toUpperCase()
                                                ? styles.correct
                                                : ''
                                                }`}
                                        >
                                            <span className={styles.letter}>{letter.toUpperCase()}</span>
                                            <span className={styles.optionText}>{option}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* زر عرض التقارير */}
            <button
                className={styles.reportButton}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowReport(!showReport);
                }}
            >
                <FaChartBar />
                التقارير
            </button>

            {/* قسم التقارير */}
            {showReport && (
                <div className={styles.reportSection}>
                    <h4 className={styles.reportTitle}>إحصائيات المراجعة</h4>
                    <div className={styles.reportGrid}>
                        <div className={styles.reportItem}>
                            <span className={`${styles.reportCount} ${styles.again}`}>
                                {card.again_count}
                            </span>
                            <span className={styles.reportLabel}>مرات التكرار</span>
                        </div>
                        <div className={styles.reportItem}>
                            <span className={`${styles.reportCount} ${styles.hard}`}>
                                {card.hard_count}
                            </span>
                            <span className={styles.reportLabel}>صعب</span>
                        </div>
                        <div className={styles.reportItem}>
                            <span className={`${styles.reportCount} ${styles.good}`}>
                                {card.good_count}
                            </span>
                            <span className={styles.reportLabel}>جيد</span>
                        </div>
                        <div className={styles.reportItem}>
                            <span className={`${styles.reportCount} ${styles.easy}`}>
                                {card.easy_count}
                            </span>
                            <span className={styles.reportLabel}>سهل</span>
                        </div>
                    </div>
                    {totalReviews > 0 && (
                        <div className={styles.totalReviews}>
                            <span>إجمالي المراجعات: {totalReviews}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FlashCardItem;