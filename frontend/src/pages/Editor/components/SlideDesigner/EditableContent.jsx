
// import React, { useEffect, useRef, useState } from 'react';
// import styles from './SlideDesigner.module.css';

// const EditableContent = ({ block, onUpdate, isEditing, onToggleEdit, onSelectBlock }) => {
//     const [localContent, setLocalContent] = useState(block.content || '');
//     const textareaRef = useRef(null);

//     useEffect(() => {
//         setLocalContent(block.content || '');
//     }, [block.content]);

//     useEffect(() => {
//         if (isEditing && textareaRef.current) {
//             textareaRef.current.focus();
//             textareaRef.current.select();
//         }
//     }, [isEditing]);

//     const handleSave = () => {
//         if (localContent !== block.content) {
//             onUpdate(block.id, { content: localContent });
//         }
//         onToggleEdit(false);
//     };

//     const handleCancel = () => {
//         setLocalContent(block.content || '');
//         onToggleEdit(false);
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter' && e.ctrlKey) handleSave();
//         if (e.key === 'Escape') handleCancel();
//     };

//     useEffect(() => {
//         if (isEditing) onSelectBlock(block);
//     }, [isEditing, block, onSelectBlock]);

//     if (isEditing) {
//         return (
//             <div className={styles.editingContainer}>
//                 <textarea
//                     ref={textareaRef}
//                     value={localContent}
//                     onChange={(e) => setLocalContent(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     className={styles.contentTextarea}
//                     style={{
//                         fontFamily: block.style?.fontFamily,
//                         fontSize: block.style?.fontSize,
//                         color: block.style?.color,
//                         fontWeight: block.style?.fontWeight,
//                         fontStyle: block.style?.fontStyle,
//                         textDecoration: block.style?.textDecoration,
//                         textAlign: block.style?.textAlign,
//                         width: '100%',
//                         height: '100%',
//                         border: '2px solid #4299e1',
//                         borderRadius: '4px',
//                         padding: '8px',
//                         background: 'white',
//                         resize: 'none',
//                         outline: 'none',
//                         lineHeight: '1.5'
//                     }}
//                 />
//                 <div className={styles.editingControls}>
//                     <button className={styles.saveButton} onClick={handleSave}>
//                         حفظ (Ctrl+Enter)
//                     </button>
//                     <button className={styles.CancelButton} onClick={handleCancel}>
//                         إلغاء (Esc)
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div
//             className={styles.contentDisplay}
//             onClick={(e) => {
//                 e.stopPropagation();
//                 onSelectBlock(block);
//                 onToggleEdit(true);
//             }}
//             style={{
//                 cursor: 'text',
//                 width: '100%',
//                 height: '100%',
//                 padding: '8px',
//                 overflow: 'hidden',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: block.style?.textAlign === 'right' ? 'flex-end' :
//                     block.style?.textAlign === 'center' ? 'center' : 'flex-start'
//             }}
//         >
//             {block.content || 'انقر للكتابة...'}
//         </div>
//     );
// };

// export default EditableContent;