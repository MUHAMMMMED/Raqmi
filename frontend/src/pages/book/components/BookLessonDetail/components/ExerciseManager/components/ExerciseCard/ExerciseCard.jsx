import { FaCheckCircle, FaEdit, FaImage, FaQuestionCircle, FaTrash } from 'react-icons/fa';
import styles from './ExerciseCard.module.css';

const label = type => ({
    mcq: 'اختيار من متعدد',
    true_false: 'صح أو خطأ',
    short_answer: 'إجابة قصيرة',
    essay: 'مقال'
}[type] ?? type);

const ExerciseCard = ({ exercise, onEdit, onDelete, IsManager }) => {
    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <div className={styles.type}>
                    <FaQuestionCircle className={styles.icon} />
                    <span>{label(exercise.question_type)}</span>
                </div>
                {exercise.page_number && <span className={styles.page}>الصفحة {exercise.page_number}</span>}
            </header>

            <div className={styles.blockTitle}>{exercise.block_title}</div>

            {/* عرض صورة السؤال إذا كانت موجودة */}
            {exercise.question_image && (
                <section className={styles.questionImage}>
                    <h4>
                        <FaImage className={styles.imageIcon} />
                        صورة السؤال:
                    </h4>
                    <div className={styles.imageContainer}>
                        <img
                            src={exercise.question_image}
                            alt="صورة السؤال"
                            className={styles.image}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        <div className={styles.imageError} style={{ display: 'none' }}>
                            <FaImage className={styles.errorIcon} />
                            <span>تعذر تحميل الصورة</span>
                        </div>
                    </div>
                </section>
            )}

            <section className={styles.question}>
                <h4>السؤال:</h4>
                <p>{exercise.question_text}</p>
            </section>

            {exercise.options?.length > 0 && (
                <section className={styles.options}>
                    <h4>الخيارات:</h4>
                    {exercise.options.map((opt, i) => (
                        <div key={i} className={styles.opt}>
                            <span className={styles.lbl}>{String.fromCharCode(65 + i)}</span>
                            <span>{opt.message}</span>
                        </div>
                    ))}
                </section>
            )}

            {exercise.correct_answer && (
                <section className={styles.answer}>
                    <h4><FaCheckCircle className={styles.check} /> الإجابة الصحيحة:</h4>
                    <p>{exercise.correct_answer}</p>
                </section>
            )}

            {exercise.explanation && (
                <section className={styles.explain}>
                    <h4>التفسير:</h4>
                    <p>{exercise.explanation}</p>
                </section>
            )}

            {IsManager && (
                <div className={styles.actions}>
                    <button onClick={() => onEdit(exercise)} title="تعديل">
                        <FaEdit /> تعديل
                    </button>
                    <button onClick={() => onDelete(exercise)} title="حذف">
                        <FaTrash /> حذف
                    </button>
                </div>
            )}
        </article>
    );
};

export default ExerciseCard;