
import { FaArrowLeft, FaBook } from 'react-icons/fa';
import styles from './HeaderSection.module.css';

const HeaderSection = ({ lesson, onBack }) => (
    <header className={styles.header}>
        <div className={styles.content}>
            <button className={styles.backBtn} onClick={onBack}>
                <FaArrowLeft /> العودة
            </button>

            <div className={styles.info}>
                <h1 className={styles.title}>{lesson.title}</h1>
                <div className={styles.meta}>
                    <span className={styles.metaItem}><FaBook /> من الصفحة {lesson.start_page} إلى {lesson.end_page}</span>
                    <span className={styles.metaItem}>الترتيب: {lesson.order + 1}</span>
                </div>
            </div>

            <div className={styles.stats}>
                <div className={styles.stat}><span className={styles.num}>{lesson.blocks?.length || 0}</span> كتلة تعليمية</div>
                <div className={styles.stat}><span className={styles.num}>{lesson.exercises?.length || 0}</span> تمرين</div>
            </div>
        </div>
    </header>
);

export default HeaderSection;