import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from './CardDetails.module.css';

import {
    FaArrowLeft,
    FaBook,
    FaCheckCircle,
    FaImage,
    FaPlus,
    FaQuestion,
    FaStar,
    FaVideo
} from 'react-icons/fa';
import { getCardsByLesson } from "../../../../api/cards";
import { getLesson } from "../../../../api/lessons";

const CardDetails = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        loadData();
    }, [lessonId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [lessonData, cardsData] = await Promise.all([
                getLesson(lessonId),
                getCardsByLesson(lessonId)
            ]);
            setLesson(lessonData);
            setCards(cardsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const CardItem = ({ card, index }) => {
        const totalReviews = card.again_count + card.hard_count + card.good_count + card.easy_count;
        const masteryPercentage = totalReviews > 0
            ? Math.round(((card.easy_count + card.good_count) / totalReviews) * 100)
            : 0;

        return (
            <div
                className={styles.cardItem}
                onClick={() => setSelectedCard(card)}
            >
                <div className={styles.cardHeader}>
                    <div className={styles.cardNumber}>
                        <span>#{index + 1}</span>
                    </div>
                    <div className={styles.cardStats}>
                        <div className={styles.masteryIndicator}>
                            <div
                                className={styles.masteryBar}
                                style={{ width: `${masteryPercentage}%` }}
                            />
                            <span>{masteryPercentage}% إتقان</span>
                        </div>
                        <div className={styles.reviewStats}>
                            <span className={styles.reviewCount}>
                                <FaStar className={styles.reviewIcon} />
                                {totalReviews} مراجعة
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.cardContent}>
                    {card.front_text && (
                        <div className={styles.frontText}>
                            <h4>النص الأمامي:</h4>
                            <p>{card.front_text.substring(0, 100)}...</p>
                        </div>
                    )}

                    {card.question_text && (
                        <div className={styles.questionText}>
                            <h4>
                                <FaQuestion className={styles.questionIcon} />
                                السؤال:
                            </h4>
                            <p>{card.question_text.substring(0, 80)}...</p>
                        </div>
                    )}

                    <div className={styles.cardMedia}>
                        {card.front_image && (
                            <span className={styles.mediaBadge}>
                                <FaImage /> صورة
                            </span>
                        )}
                        {card.front_video && (
                            <span className={styles.mediaBadge}>
                                <FaVideo /> فيديو
                            </span>
                        )}
                        {card.question_image && (
                            <span className={styles.mediaBadge}>
                                <FaImage /> صورة سؤال
                            </span>
                        )}
                    </div>

                    {card.correct_answer && (
                        <div className={styles.correctAnswer}>
                            <FaCheckCircle className={styles.correctIcon} />
                            الإجابة الصحيحة: {card.correct_answer}
                        </div>
                    )}
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.difficultyLevels}>
                        <span className={`${styles.level} ${styles.again}`}>
                            مرة أخرى: {card.again_count}
                        </span>
                        <span className={`${styles.level} ${styles.hard}`}>
                            صعب: {card.hard_count}
                        </span>
                        <span className={`${styles.level} ${styles.good}`}>
                            جيد: {card.good_count}
                        </span>
                        <span className={`${styles.level} ${styles.easy}`}>
                            سهل: {card.easy_count}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل البطاقات...</p>
            </div>
        );
    }

    return (
        <div className={styles.cardDetailsContainer}>
            <div className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft />
                    رجوع
                </button>
                <div className={styles.headerContent}>
                    <FaBook className={styles.headerIcon} />
                    <div>
                        <h1>إدارة البطاقات التعليمية</h1>
                        <p>{lesson?.title} - {cards.length} بطاقة</p>
                    </div>
                </div>
                <button className={styles.addButton}>
                    <FaPlus />
                    إضافة بطاقة
                </button>
            </div>

            <div className={styles.statsOverview}>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>{cards.length}</span>
                    <span className={styles.statLabel}>إجمالي البطاقات</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {cards.filter(card => card.correct_answer).length}
                    </span>
                    <span className={styles.statLabel}>بطاقات بأسئلة</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {cards.reduce((total, card) => total + card.again_count, 0)}
                    </span>
                    <span className={styles.statLabel}>مراجعات "مرة أخرى"</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {cards.reduce((total, card) => total + card.easy_count, 0)}
                    </span>
                    <span className={styles.statLabel}>مراجعات "سهل"</span>
                </div>
            </div>

            <div className={styles.cardsGrid}>
                {cards.length > 0 ? (
                    cards.map((card, index) => (
                        <CardItem key={card.id} card={card} index={index} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <FaBook className={styles.emptyIcon} />
                        <h3>لا توجد بطاقات بعد</h3>
                        <p>ابدأ بإضافة أول بطاقة تعليمية</p>
                        <button className={styles.addButton}>
                            <FaPlus />
                            إضافة بطاقة جديدة
                        </button>
                    </div>
                )}
            </div>

            {selectedCard && (
                <div className={styles.cardModal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>تفاصيل البطاقة</h2>
                            <button
                                className={styles.closeButton}
                                onClick={() => setSelectedCard(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.detailSection}>
                                <h3>النص الأمامي</h3>
                                <p>{selectedCard.front_text || "لا يوجد نص"}</p>
                            </div>

                            {selectedCard.question_text && (
                                <div className={styles.detailSection}>
                                    <h3>السؤال</h3>
                                    <p>{selectedCard.question_text}</p>
                                </div>
                            )}

                            {selectedCard.correct_answer && (
                                <div className={styles.detailSection}>
                                    <h3>الإجابة الصحيحة</h3>
                                    <p>الخيار {selectedCard.correct_answer}</p>
                                </div>
                            )}

                            <div className={styles.detailSection}>
                                <h3>إحصائيات المراجعة</h3>
                                <div className={styles.reviewDetails}>
                                    <span>مرة أخرى: {selectedCard.again_count}</span>
                                    <span>صعب: {selectedCard.hard_count}</span>
                                    <span>جيد: {selectedCard.good_count}</span>
                                    <span>سهل: {selectedCard.easy_count}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={styles.modalOverlay}
                        onClick={() => setSelectedCard(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default CardDetails;