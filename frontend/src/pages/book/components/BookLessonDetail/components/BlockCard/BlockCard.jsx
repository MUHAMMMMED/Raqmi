
// // // import { FaFileAlt, FaImage, FaLightbulb, FaStickyNote, FaTable } from 'react-icons/fa';

// // // import styles from './BlockCard.module.css';
// // // import BlockTabs from './components/BlockTabs/BlockTabs';

// // // const getIcon = type => {
// // //     const map = { image: FaImage, table: FaTable, example: FaLightbulb, note: FaStickyNote };
// // //     return map[type] ?? FaFileAlt;
// // // };

// // // const getLabel = type => ({
// // //     text: 'نص', image: 'صورة', table: 'جدول', example: 'مثال توضيحي', note: 'ملاحظة'
// // // }[type] ?? type);

// // // const BlockCard = ({ block, fetchData, lessonId, partId, IsManager }) => {
// // //     if (!block || typeof block !== 'object') return null;
// // //     const Icon = getIcon(block.block_type);

// // //     return (
// // //         <article className={styles.card}>
// // //             <header className={styles.header}>
// // //                 <div className={styles.type}>
// // //                     <span className={styles.icon}><Icon /></span>
// // //                     <span className={styles.label}>{getLabel(block.block_type)}</span>
// // //                 </div>
// // //                 {block.page_number && <span className={styles.page}>الصفحة {block.page_number}</span>}
// // //             </header>

// // //             <h1 className={styles.title}>{block.title}</h1>

// // //             <div className={styles.content}>
// // //                 {block.image && <img src={block.image} alt="" className={styles.img} />}
// // //                 {block.content && block.content.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
// // //             </div>

// // //             {/* التبويبات الجديدة */}
// // //             <BlockTabs
// // //                 objectives={block.objective_block || []}
// // //                 exercises={block.exercises || []}
// // //                 flashcards={block.book_block_card || []}
// // //                 reelPreview={block.reel_block || null}
// // //                 blockId={block?.id}
// // //                 lessonId={lessonId}
// // //                 partId={partId}
// // //                 fetchData={fetchData}
// // //                 IsManager={IsManager}
// // //             />
// // //         </article>
// // //     );
// // // };

// // // export default BlockCard;


// // // import { FaFileAlt, FaImage, FaLightbulb, FaStickyNote, FaTable } from 'react-icons/fa';
// // // import MathJax from 'react-mathjax2';
// // // import styles from './BlockCard.module.css';
// // // import BlockTabs from './components/BlockTabs/BlockTabs';

// // // const getIcon = type => {
// // //     const map = { image: FaImage, table: FaTable, example: FaLightbulb, note: FaStickyNote };
// // //     return map[type] ?? FaFileAlt;
// // // };

// // // const getLabel = type => ({
// // //     text: 'نص', image: 'صورة', table: 'جدول', example: 'مثال توضيحي', note: 'ملاحظة'
// // // }[type] ?? type);

// // // const BlockCard = ({ block, fetchData, lessonId, partId, IsManager }) => {
// // //     if (!block || typeof block !== 'object') return null;
// // //     const Icon = getIcon(block.block_type);

// // //     return (
// // //         <article className={styles.card}>
// // //             <header className={styles.header}>
// // //                 <div className={styles.type}>
// // //                     <span className={styles.icon}><Icon /></span>
// // //                     <span className={styles.label}>{getLabel(block.block_type)}</span>
// // //                 </div>
// // //                 {block.page_number && <span className={styles.page}>الصفحة {block.page_number}</span>}
// // //             </header>

// // //             <h1 className={styles.title}>{block.title}</h1>

// // //             <div className={styles.content}>
// // //                 {block.image && <img src={block.image} alt="" className={styles.img} />}

// // //                 {/* ✅ عرض النصوص والمعادلات مع دعم MathJax */}
// // //                 <MathJax.Provider>
// // //                     {block.content &&
// // //                         block.content.split('\n').map((line, i) =>
// // //                             line.trim() ? (
// // //                                 <p key={i}>
// // //                                     <MathJax.Text text={line} />
// // //                                 </p>
// // //                             ) : null
// // //                         )
// // //                     }
// // //                 </MathJax.Provider>
// // //             </div>

// // //             <BlockTabs
// // //                 objectives={block.objective_block || []}
// // //                 exercises={block.exercises || []}
// // //                 flashcards={block.book_block_card || []}
// // //                 reelPreview={block.reel_block || null}
// // //                 blockId={block?.id}
// // //                 lessonId={lessonId}
// // //                 partId={partId}
// // //                 fetchData={fetchData}
// // //                 IsManager={IsManager}
// // //             />
// // //         </article>
// // //     );
// // // };

// // // export default BlockCard;



// import 'katex/dist/katex.min.css';
// import React from 'react';
// import { FaFileAlt, FaImage, FaLightbulb, FaStickyNote, FaTable } from 'react-icons/fa';
// import { BlockMath, InlineMath } from 'react-katex';
// import styles from './BlockCard.module.css';
// import BlockTabs from './components/BlockTabs/BlockTabs';

// // أيقونة حسب نوع البلوك
// const getIcon = (type) => {
//     const map = { image: FaImage, table: FaTable, example: FaLightbulb, note: FaStickyNote };
//     return map[type] ?? FaFileAlt;
// };

// // تسمية حسب اللغة العربية
// const getLabel = (type) => ({
//     text: 'نص',
//     image: 'صورة',
//     table: 'جدول',
//     example: 'مثال توضيحي',
//     note: 'ملاحظة'
// }[type] ?? type);

// // كشف إذا كان السطر "معادلة رئيسية" (مثل $$...$$ أو F = ma)
// const isMainEquation = (line) => {
//     if (typeof line !== 'string') return false;
//     const trimmed = line.trim();
//     if (!trimmed) return false;

//     const startsWith = (prefix) => trimmed.startsWith(prefix);
//     const endsWith = (suffix) => trimmed.endsWith(suffix);

//     // 1. معادلة محاطة بـ $$ أو \[ \] أو \( \)
//     if (
//         (startsWith('$$') && endsWith('$$')) ||
//         (startsWith('\\[') && endsWith('\\]')) ||
//         (startsWith('\\(') && endsWith('\\)'))
//     ) {
//         return true;
//     }

//     // 2. معادلة قصيرة تحتوي على رموز رياضية واضحة
//     const hasMath = /[=\+\-\*\/∫∑√∞α-ωΑ-Ω]/.test(trimmed);
//     const hasVars = /[a-zA-Z]\w*[_\^]?/.test(trimmed);
//     const wordCount = trimmed.split(/\s+/).filter(w => w).length;

//     return hasMath && hasVars && wordCount <= 12;
// };

// // استخراج المعادلة من \( \), \[ \], $$ $$
// const extractMath = (line) => {
//     let math = line.trim();

//     if (math.startsWith('$$') && math.endsWith('$$')) {
//         math = math.slice(2, -2);
//     } else if (math.startsWith('\\[') && math.endsWith('\\]')) {
//         math = math.slice(2, -2);
//     } else if (math.startsWith('\\(') && math.endsWith('\\)')) {
//         math = math.slice(2, -2);
//     }

//     return math.trim();
// };

// // عرض نص مع دعم inline math مثل \(...\)
// const renderTextWithInlineMath = (text, keyPrefix) => {
//     const parts = [];
//     let i = 0;
//     let buffer = '';

//     while (i < text.length) {
//         if (text.startsWith('\\(', i)) {
//             if (buffer) {
//                 parts.push(<span key={`${keyPrefix}-t-${i}`}>{buffer}</span>);
//                 buffer = '';
//             }
//             const end = text.indexOf('\\)', i);
//             if (end !== -1) {
//                 const math = text.slice(i + 2, end);
//                 parts.push(<InlineMath key={`${keyPrefix}-i-${i}`} math={math} />);
//                 i = end + 2;
//             } else {
//                 buffer += '\\(';
//                 i += 2;
//             }
//         } else {
//             buffer += text[i];
//             i++;
//         }
//     }
//     if (buffer) parts.push(<span key={`${keyPrefix}-t-end`}>{buffer}</span>);
//     return parts;
// };

// // المكون الرئيسي
// const BlockCard = ({ block, fetchData, lessonId, partId, IsManager }) => {
//     if (!block || typeof block !== 'object') return null;

//     const Icon = getIcon(block.block_type);

//     const contentLines = typeof block.content === 'string'
//         ? block.content.split('\n').map(l => l.trim()).filter(l => l)
//         : [];

//     return (
//         <article className={styles.card}>
//             <header className={styles.header}>
//                 <div className={styles.type}>
//                     <span className={styles.icon}><Icon /></span>
//                     <span className={styles.label}>{getLabel(block.block_type)}</span>
//                 </div>
//                 {block.page_number && <span className={styles.page}>الصفحة {block.page_number}</span>}
//             </header>

//             <h1 className={styles.title}>{block.title}</h1>

//             <div className={styles.content}>
//                 {block.image && <img src={block.image} alt={block.title || ''} className={styles.img} />}

//                 {contentLines.length > 0 && (
//                     <div className={styles.dynamicContent}>
//                         {contentLines.map((line, i) => {
//                             if (isMainEquation(line)) {
//                                 const equation = extractMath(line);
//                                 return (
//                                     <div key={i} className={styles.equationWrapper}>
//                                         <BlockMath math={equation} />
//                                     </div>
//                                 );
//                             } else {
//                                 return (
//                                     <p key={i} className={styles.textLine}>
//                                         {renderTextWithInlineMath(line, i)}
//                                     </p>
//                                 );
//                             }
//                         })}
//                     </div>
//                 )}
//             </div>

//             <BlockTabs
//                 objectives={block.objective_block || []}
//                 exercises={block.exercises || []}
//                 flashcards={block.book_block_card || []}
//                 reelPreview={block.reel_block || null}
//                 blockId={block?.id}
//                 lessonId={lessonId}
//                 partId={partId}
//                 fetchData={fetchData}
//                 IsManager={IsManager}
//             />
//         </article>
//     );
// };

// export default BlockCard;







import 'katex/dist/katex.min.css';
import React from 'react';
import { FaFileAlt, FaImage, FaLightbulb, FaStickyNote, FaTable } from 'react-icons/fa';
import { BlockMath, InlineMath } from 'react-katex';
import styles from './BlockCard.module.css';
import BlockTabs from './components/BlockTabs/BlockTabs';

// LaTeX
const getIcon = (type) => {
    const map = { image: FaImage, table: FaTable, example: FaLightbulb, note: FaStickyNote };
    return map[type] ?? FaFileAlt;
};

const getLabel = (type) => ({
    text: 'نص',
    image: 'صورة',
    table: 'جدول',
    example: 'مثال توضيحي',
    note: 'ملاحظة'
}[type] ?? type);

// كشف إذا كان السطر يحتوي على \بداية{المعادلة*} ... \نهاية{المعادلة*}
const isCustomEquationBlock = (lines, startIndex) => {
    if (startIndex >= lines.length) return null;
    const startLine = lines[startIndex].trim();
    if (!startLine.startsWith('\\بداية{المعادلة*}')) return null;

    let endIndex = startIndex;
    while (endIndex < lines.length) {
        if (lines[endIndex].trim() === '\\نهاية{المعادلة*}') {
            return { start: startIndex, end: endIndex };
        }
        endIndex++;
    }
    return null;
};

// استخراج المعادلة من أي تنسيق
const extractMath = (line) => {
    let math = line.trim();

    // دعم $$...$$
    if (math.startsWith('$$') && math.endsWith('$$')) {
        math = math.slice(2, -2);
    }
    // دعم \[...\]
    else if (math.startsWith('\\[') && math.endsWith('\\]')) {
        math = math.slice(2, -2);
    }
    // دعم \(...\)
    else if (math.startsWith('\\(') && math.endsWith('\\)')) {
        math = math.slice(2, -2);
    }

    return math.trim();
};

// عرض نص مع دعم inline math \(...\)
const renderTextWithInlineMath = (text, keyPrefix) => {
    const parts = [];
    let i = 0;
    let buffer = '';

    while (i < text.length) {
        if (text.startsWith('\\(', i)) {
            if (buffer) {
                parts.push(<span key={`${keyPrefix}-t-${i}`}>{buffer}</span>);
                buffer = '';
            }
            const end = text.indexOf('\\)', i);
            if (end !== -1) {
                const math = text.slice(i + 2, end);
                parts.push(<InlineMath key={`${keyPrefix}-i-${i}`} math={math} />);
                i = end + 2;
            } else {
                buffer += '\\(';
                i += 2;
            }
        } else {
            buffer += text[i];
            i++;
        }
    }
    if (buffer) parts.push(<span key={`${keyPrefix}-t-end`}>{buffer}</span>);
    return parts;
};

const BlockCard = ({ block, fetchData, lessonId, partId, IsManager }) => {
    if (!block || typeof block !== 'object') return null;

    const Icon = getIcon(block.block_type);

    // تحويل المحتوى إلى أسطر
    const rawLines = typeof block.content === 'string'
        ? block.content.split('\n').map(l => l)
        : [];

    const contentLines = [];
    let i = 0;

    while (i < rawLines.length) {
        const currentLine = rawLines[i];

        // كشف كتلة المعادلة المخصصة
        const equationBlock = isCustomEquationBlock(rawLines, i);
        if (equationBlock) {
            const equationLines = rawLines
                .slice(equationBlock.start + 1, equationBlock.end)
                .map(l => l.trim())
                .filter(l => l && !l.startsWith('\\'))
                .join(' ');

            contentLines.push({ type: 'equation', math: equationLines });
            i = equationBlock.end + 1;
            continue;
        }

        // كشف معادلة سطر واحد ($$ أو \[ أو \( أو معادلة قصيرة)
        const trimmed = currentLine.trim();
        if (
            (trimmed.startsWith('$$') && trimmed.endsWith('$$')) ||
            (trimmed.startsWith('\\[') && trimmed.endsWith('\\]')) ||
            (trimmed.startsWith('\\(') && trimmed.endsWith('\\)')) ||
            (/[=\+\-\*\/∫∑√]/.test(trimmed) && /[a-zA-Z]/.test(trimmed) && trimmed.split(/\s+/).length <= 15)
        ) {
            contentLines.push({ type: 'equation', math: extractMath(currentLine) });
        } else {
            contentLines.push({ type: 'text', text: currentLine });
        }

        i++;
    }

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
                {block.image && <img src={block.image} alt={block.title || ''} className={styles.img} />}

                {contentLines.length > 0 && (
                    <div className={styles.dynamicContent}>
                        {contentLines.map((item, idx) => {
                            if (item.type === 'equation') {
                                return (
                                    <div key={idx} className={styles.equationWrapper}>
                                        <BlockMath math={item.math} />
                                    </div>
                                );
                            } else {
                                return (
                                    <p key={idx} className={styles.textLine}>
                                        {renderTextWithInlineMath(item.text, idx)}
                                    </p>
                                );
                            }
                        })}
                    </div>
                )}
            </div>

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