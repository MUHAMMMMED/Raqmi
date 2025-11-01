import { FaLightbulb, FaListOl, FaPalette, FaQuestion, FaVideo } from 'react-icons/fa';
import styles from './ReelPreview.module.css';

const ReelPreview = ({ reelPreview }) => {
    if (!reelPreview) return null;

    const getToneLabel = (tone) => {
        const tones = {
            "informative": "معلوماتي",
            "enthusiastic": "متحمس",
            "curious": "فضولي",
            "motivational": "تحفيزي"
        };
        return tones[tone] || tone;
    };

    const getToneColor = (tone) => {
        const colors = {
            "informative": "#3182ce",
            "enthusiastic": "#dd6b20",
            "curious": "#805ad5",
            "motivational": "#38a169"
        };
        return colors[tone] || "#667eea";
    };

    const getCorrectOptionLabel = (optionNumber) => {
        const options = { 1: "A", 2: "B", 3: "C", 4: "D" };
        return options[optionNumber] || optionNumber;
    };

    // التحقق من وجود سؤال
    const hasQuestion = reelPreview.question_text && (
        reelPreview.option1 || reelPreview.option2 || reelPreview.option3 || reelPreview.option4
    );

    return (
        <div className={styles.reelPreview}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    <FaVideo />
                    نموذج الريل المقترح
                </h3>
                <div
                    className={styles.toneBadge}
                    style={{ backgroundColor: getToneColor(reelPreview.tone) }}
                >
                    {getToneLabel(reelPreview.tone)}
                </div>
            </div>

            <div className={styles.content}>
                {/* عرض المحتوى والسؤال جنباً إلى جنب */}
                <div className={styles.mainLayout}>
                    {/* قسم المحتوى */}
                    <div className={styles.contentSection}>
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <FaLightbulb />
                                <h4>جملة الجذب (Hook)</h4>
                            </div>
                            <div className={styles.sectionContent}>
                                <p>{reelPreview.hook_text}</p>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <FaVideo />
                                <h4>الفكرة الرئيسية</h4>
                            </div>
                            <div className={styles.sectionContent}>
                                <p>{reelPreview.body_summary}</p>
                            </div>
                        </div>

                        {reelPreview.outro_question && (
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FaQuestion />
                                    <h4>السؤال الختامي</h4>
                                </div>
                                <div className={styles.sectionContent}>
                                    <p>{reelPreview.outro_question}</p>
                                </div>
                            </div>
                        )}

                        {reelPreview.visual_hint && (
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FaPalette />
                                    <h4>الاقتراح البصري</h4>
                                </div>
                                <div className={styles.sectionContent}>
                                    <p>{reelPreview.visual_hint}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* قسم السؤال إذا كان موجوداً */}
                    {hasQuestion && (
                        <div className={styles.questionSection}>
                            <div className={styles.questionCard}>
                                <div className={styles.questionHeader}>
                                    <FaListOl />
                                    <h4>سؤال الريل</h4>
                                </div>

                                <div className={styles.questionContent}>
                                    <p className={styles.questionText}>{reelPreview.question_text}</p>

                                    {reelPreview.question_image && (
                                        <div className={styles.questionImage}>
                                            <img src={reelPreview.question_image} alt="سؤال الريل" />
                                        </div>
                                    )}

                                    <div className={styles.optionsList}>
                                        {reelPreview.option1 && (
                                            <div className={`${styles.option} ${reelPreview.correct_option === 1 ? styles.correct : ''}`}>
                                                <span className={styles.optionLetter}>A</span>
                                                <span className={styles.optionText}>{reelPreview.option1}</span>
                                                {reelPreview.correct_option === 1 && (
                                                    <span className={styles.correctBadge}>الإجابة الصحيحة</span>
                                                )}
                                            </div>
                                        )}

                                        {reelPreview.option2 && (
                                            <div className={`${styles.option} ${reelPreview.correct_option === 2 ? styles.correct : ''}`}>
                                                <span className={styles.optionLetter}>B</span>
                                                <span className={styles.optionText}>{reelPreview.option2}</span>
                                                {reelPreview.correct_option === 2 && (
                                                    <span className={styles.correctBadge}>الإجابة الصحيحة</span>
                                                )}
                                            </div>
                                        )}

                                        {reelPreview.option3 && (
                                            <div className={`${styles.option} ${reelPreview.correct_option === 3 ? styles.correct : ''}`}>
                                                <span className={styles.optionLetter}>C</span>
                                                <span className={styles.optionText}>{reelPreview.option3}</span>
                                                {reelPreview.correct_option === 3 && (
                                                    <span className={styles.correctBadge}>الإجابة الصحيحة</span>
                                                )}
                                            </div>
                                        )}

                                        {reelPreview.option4 && (
                                            <div className={`${styles.option} ${reelPreview.correct_option === 4 ? styles.correct : ''}`}>
                                                <span className={styles.optionLetter}>D</span>
                                                <span className={styles.optionText}>{reelPreview.option4}</span>
                                                {reelPreview.correct_option === 4 && (
                                                    <span className={styles.correctBadge}>الإجابة الصحيحة</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* المعلومات الإضافية */}
                <div className={styles.metaInfo}>
                    <div className={styles.metaItem}>
                        <strong>تم الإنشاء:</strong>
                        <span>{new Date(reelPreview.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                    {reelPreview.updated_at && (
                        <div className={styles.metaItem}>
                            <strong>آخر تحديث:</strong>
                            <span>{new Date(reelPreview.updated_at).toLocaleDateString('ar-EG')}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReelPreview;