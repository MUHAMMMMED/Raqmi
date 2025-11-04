
import { FaFileAlt, FaImage, FaLightbulb, FaStickyNote, FaTable } from 'react-icons/fa';

import styles from './BlockCard.module.css';
import BlockTabs from './components/BlockTabs/BlockTabs';

const getIcon = type => {
    const map = { image: FaImage, table: FaTable, example: FaLightbulb, note: FaStickyNote };
    return map[type] ?? FaFileAlt;
};

const getLabel = type => ({
    text: 'نص', image: 'صورة', table: 'جدول', example: 'مثال توضيحي', note: 'ملاحظة'
}[type] ?? type);

const BlockCard = ({ block, fetchData, lessonId, partId, IsManager }) => {
    if (!block || typeof block !== 'object') return null;
    const Icon = getIcon(block.block_type);

    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <div className={styles.type}>
                    <span className={styles.icon}><Icon /></span>
                    <span className={styles.label}>{getLabel(block.block_type)}</span>
                </div>
                {block.page_number && <span className={styles.page}>الصفحة {block.page_number}</span>}
            </header>

            <h1 className={styles.title}>{block.title}</h1>

            <div className={styles.content}>
                {block.image && <img src={block.image} alt="" className={styles.img} />}
                {block.content && block.content.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
            </div>

            {/* التبويبات الجديدة */}
            <BlockTabs
                objectives={block.objective_block || []}
                exercises={block.exercises || []}
                flashcards={block.book_block_card || []}
                reelPreview={block.reel_block || null}
                blockId={block?.id}
                lessonId={lessonId}
                partId={partId}
                fetchData={fetchData}
                IsManager={IsManager}
            />
        </article>
    );
};

export default BlockCard;