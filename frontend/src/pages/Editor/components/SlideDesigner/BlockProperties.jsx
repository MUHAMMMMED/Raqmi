
import React from 'react';
import {
    FaAlignCenter, FaAlignLeft, FaAlignRight, FaArrowDown,
    FaArrowUp, FaBold,
    FaEye, FaEyeSlash,
    FaFolderOpen, FaFont, FaImage, FaItalic,
    FaLayerGroup,
    FaMinus, FaPalette, FaPlus,
    FaTextHeight,
    FaTimes,
    FaTrash,
    FaUnderline,
    FaVideo
} from 'react-icons/fa';
import { MdTextFields } from 'react-icons/md';
import { FONT_OPTIONS } from './constants';
import styles from './SlideDesigner.module.css';

const BlockProperties = React.memo(({
    block,
    onUpdate,
    onUpdateStyle,
    onDelete,
    onChangeFontSize,
    onToggleStyle,
    onChangeOpacity,
    onChangeBackgroundOpacity,
    onBringToFront,
    onSendToBack,
    onOpenMediaLibrary,
    onRemoveMedia
}) => {
    const handleContentChange = (e) => onUpdate(block.id, { content: e.target.value });
    const handleStyleChange = (prop, value) => onUpdateStyle(block.id, { [prop]: value });



    return (
        <div>
            {/* Content */}
            {['title', 'text', 'bullet_points', 'quote', 'code'].includes(block.type) && (
                <div className={styles.inputGroup}>
                    <label><MdTextFields className={styles.inputIcon} /> المحتوى</label>
                    <textarea
                        value={block.content || ''}
                        onChange={handleContentChange}
                        rows={4}
                        placeholder="اكتب محتوى العنصر هنا..."
                    />
                </div>
            )}

            {/* Media */}
            {['image', 'video'].includes(block.type) && (
                <div className={styles.inputGroup}>
                    <label>{block.type === 'image' ? <FaImage className={styles.inputIcon} /> : <FaVideo className={styles.inputIcon} />}
                        {block.type === 'image' ? 'مصدر الصورة' : 'مصدر الفيديو'}
                    </label>
                    <div className={styles.mediaButtons}>
                        <button type="button" onClick={() => onOpenMediaLibrary(block.id)} className={styles.mediaLibraryButton}>
                            <FaFolderOpen /> اختر من المكتبة
                        </button>

                    </div>
                    {block.media && (
                        <div className={styles.mediaPreview}>
                            {block.type === 'image' ? (
                                <img src={block.media} alt="Media" className={styles.previewImage} />
                            ) : (
                                <video controls className={styles.previewVideo}><source src={block.media} /></video>
                            )}
                            <button onClick={() => onRemoveMedia(block.id)} className={styles.removeMediaButton}>
                                <FaTimes /> إزالة
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Text Styling */}
            {['title', 'text', 'bullet_points', 'quote'].includes(block.type) && (
                <>
                    <div className={styles.inputGroup}>
                        <label><FaFont className={styles.inputIcon} /> نوع الخط</label>
                        <select
                            value={block.style?.fontFamily || 'Arial'}
                            onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                            className={styles.fontSelector}
                        >
                            <optgroup label="الخطوط العربية">
                                {FONT_OPTIONS.filter(f => f.type === 'arabic').map(f => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                            </optgroup>
                            <optgroup label="الخطوط الإنجليزية">
                                {FONT_OPTIONS.filter(f => f.type === 'english').map(f => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label><FaTextHeight className={styles.inputIcon} /> حجم الخط</label>
                        <div className={styles.fontSizeControls}>
                            <button className={styles.sizeButton} onClick={() => onChangeFontSize(block.id, -2)}><FaMinus /></button>
                            <input
                                type="number"
                                value={parseInt(block.style?.fontSize) || 18}
                                onChange={(e) => onUpdateStyle(block.id, { fontSize: `${Math.max(1, parseInt(e.target.value) || 18)}px` })}
                                className={styles.fontSizeInput}
                                min="1"
                            />
                            <button className={styles.sizeButton} onClick={() => onChangeFontSize(block.id, 2)}><FaPlus /></button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label><FaPalette className={styles.inputIcon} /> لون النص</label>
                        <input
                            type="color"
                            value={block.style?.color || '#000000'}
                            onChange={(e) => handleStyleChange('color', e.target.value)}
                            className={styles.colorPicker}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>تنسيق النص</label>
                        <div className={styles.formattingTools}>
                            <button className={`${styles.formatButton} ${block.style?.fontWeight === 'bold' ? styles.active : ''}`}
                                onClick={() => onToggleStyle(block.id, 'fontWeight', 'bold', 'normal')}><strong><FaBold /></strong></button>
                            <button className={`${styles.formatButton} ${block.style?.fontStyle === 'italic' ? styles.active : ''}`}
                                onClick={() => onToggleStyle(block.id, 'fontStyle', 'italic', 'normal')}><em><FaItalic /></em></button>
                            <button className={`${styles.formatButton} ${block.style?.textDecoration === 'underline' ? styles.active : ''}`}
                                onClick={() => onToggleStyle(block.id, 'textDecoration', 'underline', 'none')}><u><FaUnderline /></u></button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>محاذاة النص</label>
                        <div className={styles.formattingTools}>
                            <button className={`${styles.formatButton} ${block.style?.textAlign === 'right' ? styles.active : ''}`}
                                onClick={() => handleStyleChange('textAlign', 'right')}><FaAlignRight /></button>
                            <button className={`${styles.formatButton} ${block.style?.textAlign === 'center' ? styles.active : ''}`}
                                onClick={() => handleStyleChange('textAlign', 'center')}><FaAlignCenter /></button>
                            <button className={`${styles.formatButton} ${block.style?.textAlign === 'left' ? styles.active : ''}`}
                                onClick={() => handleStyleChange('textAlign', 'left')}><FaAlignLeft /></button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label><FaEye className={styles.inputIcon} /> شفافية النص</label>
                        <div className={styles.opacityControl}>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={block.opacity || 1}
                                onChange={(e) => onChangeOpacity(block.id, e.target.value)}
                                className={styles.opacitySlider}
                            />
                            <span className={styles.opacityValue}>{Math.round((block.opacity || 1) * 100)}%</span>
                        </div>
                    </div>
                </>
            )}

            {/* Background Opacity */}
            {['image', 'video', 'code', 'quote'].includes(block.type) && (
                <div className={styles.inputGroup}>
                    <label><FaEyeSlash className={styles.inputIcon} /> شفافية الخلفية</label>
                    <div className={styles.opacityControl}>
                        <input
                            type="range" min="0" max="1" step="0.01"
                            value={block.backgroundOpacity || 1}
                            onChange={(e) => onChangeBackgroundOpacity(block.id, e.target.value)}
                            className={styles.opacitySlider}
                        />
                        <span className={styles.opacityValue}>{Math.round((block.backgroundOpacity || 1) * 100)}%</span>
                    </div>
                </div>
            )}

            {/* Layers */}
            <div className={styles.inputGroup}>
                <label><FaLayerGroup className={styles.inputIcon} /> إدارة الطبقات</label>
                <div className={styles.layerControls}>
                    <button className={styles.controlButton} onClick={() => onBringToFront(block.id)}>
                        <FaArrowUp className={styles.buttonIcon} /> تقديم
                    </button>
                    <button className={styles.controlButton} onClick={() => onSendToBack(block.id)}>
                        <FaArrowDown className={styles.buttonIcon} /> إرسال
                    </button>
                </div>
            </div>

            {/* Dimensions */}
            <div className={styles.dimensionsInfo}>
                <div className={styles.dimensionItem}><span>العرض:</span> <span>{block.size?.width}px</span></div>
                <div className={styles.dimensionItem}><span>الارتفاع:</span> <span>{block.size?.height}px</span></div>
                <div className={styles.dimensionItem}><span>X:</span> <span>{block.position?.x}px</span></div>
                <div className={styles.dimensionItem}><span>Y:</span> <span>{block.position?.y}px</span></div>
                <div className={styles.dimensionItem}><span>الطبقة:</span> <span>{block.zIndex}</span></div>
            </div>

            {/* Delete */}
            <div className={styles.inputGroup}>
                <button className={`${styles.controlButton} ${styles.danger}`} onClick={() => onDelete(block.id)}>
                    <FaTrash className={styles.buttonIcon} /> حذف العنصر
                </button>
            </div>
        </div>
    );
});

export default BlockProperties;