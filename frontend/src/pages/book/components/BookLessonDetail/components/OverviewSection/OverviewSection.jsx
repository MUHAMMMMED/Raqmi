
import styles from './OverviewSection.module.css';

const label = type => ({
    text: 'نص', image: 'صورة', table: 'جدول', example: 'مثال توضيحي', note: 'ملاحظة'
}[type] ?? type);

const OverviewSection = ({ lesson }) => {
    const uniqueTypes = [...new Set(lesson.blocks?.map(b => b.block_type) ?? [])];
    const totalObjs = lesson.blocks?.reduce((s, b) => s + (b.blockobjectives?.length || 0), 0) ?? 0;

    return (
        <div className={styles.grid}>
            {/* معلومات الدرس */}
            <div className={styles.card}>
                <h3>معلومات الدرس</h3>
                <div className={styles.item}><strong>العنوان:</strong> <span>{lesson.title}</span></div>
                <div className={styles.item}><strong>نطاق الصفحات:</strong> <span>من {lesson.start_page} إلى {lesson.end_page}</span></div>
                <div className={styles.item}><strong>الترتيب:</strong> <span>{lesson.order + 1}</span></div>
            </div>

            {/* الإحصائيات */}
            <div className={styles.card}>
                <h3>الإحصائيات</h3>
                <div className={styles.item}><strong>الكتل التعليمية:</strong> <span>{lesson.blocks?.length || 0}</span></div>
                <div className={styles.item}><strong>التمارين:</strong> <span>{lesson.exercises?.length || 0}</span></div>
                <div className={styles.item}><strong>أنواع الكتل:</strong>
                    <div className={styles.tags}>{uniqueTypes.map(t => <span key={t}>{label(t)}</span>)}</div>
                </div>
            </div>

            {/* الأهداف */}
            <div className={styles.card}>
                <h3>الأهداف التعليمية</h3>
                {totalObjs ? (
                    <div className={styles.count}>{totalObjs} هدف تعليمي</div>
                ) : (
                    <p className={styles.none}>لا توجد أهداف تعليمية محددة</p>
                )}
            </div>
        </div>
    );
};

export default OverviewSection;