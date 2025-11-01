
import html2canvas from 'html2canvas';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FaAlignCenter,
    FaAlignLeft,
    FaAlignRight,
    FaArrowDown,
    FaArrowsAlt,
    FaArrowUp,
    FaBold,
    FaCamera,
    FaCode,
    FaExpandArrowsAlt,
    FaEye,
    FaEyeSlash,
    FaFolderOpen,
    FaFont,
    FaImage,
    FaItalic,
    FaLayerGroup,
    FaListUl,
    FaMinus,
    FaPalette,
    FaPlus,
    FaQuoteRight,
    FaSave,
    FaTextHeight,
    FaTimes,
    FaTrash,
    FaUnderline,
    FaVectorSquare,
    FaVideo
} from 'react-icons/fa';
import {
    MdClose,
    MdDragHandle,
    MdLayers,
    MdTextFields,
    MdTitle
} from 'react-icons/md';

import MediaLibraryModal from '../MediaLibrary/MediaLibraryModal';
import styles from './SlideDesigner.module.css';

// Font options list
const FONT_OPTIONS = [
    { value: 'Arial, sans-serif', label: 'Arial', type: 'english' },
    { value: "'Times New Roman', serif", label: 'Times New Roman', type: 'english' },
    { value: "'Courier New', monospace", label: 'Courier New', type: 'english' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma', type: 'english' },
    { value: "'Segoe UI', sans-serif", label: 'Segoe UI', type: 'english' },
    { value: "'Cairo', sans-serif", label: 'Cairo', type: 'arabic' },
    { value: "'Tajawal', sans-serif", label: 'Tajawal', type: 'arabic' },
    { value: "'Amiri', serif", label: 'Amiri', type: 'arabic' },
    { value: "'Almarai', sans-serif", label: 'Almarai', type: 'arabic' },
    { value: "'Changa', sans-serif", label: 'Changa', type: 'arabic' },
    { value: "'El Messiri', sans-serif", label: 'El Messiri', type: 'arabic' },
    { value: "'Lalezar', cursive", label: 'Lalezar', type: 'arabic' },
    { value: "'Reem Kufi', sans-serif", label: 'Reem Kufi', type: 'arabic' },
    { value: "'Scheherazade New', serif", label: 'Scheherazade', type: 'arabic' },
    { value: "'IBM Plex Sans Arabic', sans-serif", label: 'IBM Plex Arabic', type: 'arabic' }
];

const SlideDesigner = ({ slide, onSave, onCancel }) => {
    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [slideProperties, setSlideProperties] = useState({
        backgroundColor: '#FFFFFF',
        backgroundImage: null,
        backgroundImageLibraryId: null,
        layoutStyle: 'default',
        backgroundOpacity: 1
    });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeDirection, setResizeDirection] = useState(null);
    const [reorderBlock, setReorderBlock] = useState(null);
    const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
    const [initialMouse, setInitialMouse] = useState({ x: 0, y: 0 });
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [mediaSelectionFor, setMediaSelectionFor] = useState(null);
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

    const slideRef = useRef(null);

    // Process data from API
    useEffect(() => {
        if (slide) {
            const processedBlocks = (slide.blocks || []).map(block => {
                const extra = typeof block.extra === 'string' ? JSON.parse(block.extra) : (block.extra || {});

                return {
                    id: block.id,
                    type: block.type,
                    content: block.content || '',
                    media: block.media || null,
                    mediaLibraryId: block.media_library_id || null,
                    position: extra.position || { x: 100, y: 100 },
                    size: extra.size || getDefaultSize(block.type),
                    style: {
                        ...getDefaultStyle(block.type),
                        ...extra.style
                    },
                    zIndex: extra.zIndex || 1,
                    opacity: extra.opacity !== undefined ? extra.opacity : 1,
                    backgroundOpacity: extra.backgroundOpacity !== undefined ? extra.backgroundOpacity : 1
                };
            }).sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));

            setBlocks(processedBlocks);

            setSlideProperties({
                backgroundColor: slide.background_color || '#FFFFFF',
                backgroundImage: slide.background_image || null,
                backgroundImageLibraryId: slide.background_image_library_id || null,
                layoutStyle: slide.layout_style || 'default',
                backgroundOpacity: slide.background_opacity || 1
            });
        }
    }, [slide]);

    // Generate slide preview as image
    const generateSlidePreview = async () => {
        if (!slideRef.current) return null;

        setIsGeneratingPreview(true);

        try {
            const canvas = await html2canvas(slideRef.current, {
                backgroundColor: null,
                scale: 0.8, // تخفيض الحجم للحصول على صورة أصغر
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: slideRef.current.scrollWidth,
                height: slideRef.current.scrollHeight
            });

            // تحويل Canvas إلى Blob
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/jpeg', 0.8); // جودة 80%
            });

            // تحويل Blob إلى Base64
            const base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });

            return base64Image;
        } catch (error) {
            console.error('Error generating slide preview:', error);
            return null;
        } finally {
            setIsGeneratingPreview(false);
        }
    };

    // Get default size
    const getDefaultSize = (type) => {
        switch (type) {
            case 'title': return { width: 400, height: 80 };
            case 'text': return { width: 350, height: 120 };
            case 'bullet_points': return { width: 350, height: 150 };
            case 'quote': return { width: 450, height: 100 };
            case 'code': return { width: 450, height: 180 };
            case 'image': return { width: 250, height: 200 };
            case 'video': return { width: 320, height: 240 };
            default: return { width: 200, height: 100 };
        }
    };

    // Get default style
    const getDefaultStyle = (type) => {
        const baseStyle = {
            fontFamily: 'Arial, sans-serif',
            fontSize: type === 'title' ? '36px' : type === 'quote' ? '24px' : '18px',
            color: type === 'code' ? '#e2e8f0' : '#2d3748',
            backgroundColor: type === 'code' ? '#2d3748' : 'transparent',
            textAlign: 'right',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'none'
        };

        return baseStyle;
    };

    // Add new block
    const addBlock = (type) => {
        const maxZIndex = Math.max(...blocks.map(b => b.zIndex || 1), 0);
        const newBlock = {
            id: `temp-${Date.now()}`,
            type,
            content: getDefaultContent(type),
            media: null,
            mediaLibraryId: null,
            position: { x: 100, y: 100 },
            size: getDefaultSize(type),
            style: getDefaultStyle(type),
            zIndex: maxZIndex + 1,
            opacity: 1,
            backgroundOpacity: 1
        };

        setBlocks([...blocks, newBlock]);
        setSelectedBlock(newBlock);
    };

    // Default content
    const getDefaultContent = (type) => {
        switch (type) {
            case 'title': return 'Main Title';
            case 'text': return 'This is a normal text that you can modify according to your needs';
            case 'bullet_points': return '• First point\n• Second point\n• Third point';
            case 'quote': return 'This is an inspiring quote that you can modify to suit you';
            case 'code': return '// Example code\nfunction example() {\n  return "Hello World";\n}';
            default: return '';
        }
    };

    // Update block
    const updateBlock = (blockId, updates) => {
        setBlocks(blocks.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
        ));
    };

    // Update style
    const updateBlockStyle = (blockId, styleUpdates) => {
        setBlocks(blocks.map(block =>
            block.id === blockId
                ? { ...block, style: { ...block.style, ...styleUpdates } }
                : block
        ));
    };

    // Toggle style
    const toggleStyle = (blockId, property, activeValue, inactiveValue = 'normal') => {
        const currentValue = selectedBlock?.style?.[property];
        const newValue = currentValue === activeValue ? inactiveValue : activeValue;
        updateBlockStyle(blockId, { [property]: newValue });
    };

    // Change font size
    const changeFontSize = (blockId, change) => {
        const currentSize = parseInt(selectedBlock?.style?.fontSize) || 18;
        const newSize = Math.max(1, currentSize + change);
        updateBlockStyle(blockId, { fontSize: `${newSize}px` });
    };

    // Change opacity
    const changeOpacity = (blockId, opacity) => {
        const newOpacity = Math.max(0, Math.min(1, parseFloat(opacity)));
        updateBlock(blockId, { opacity: newOpacity });
    };

    // Change background opacity
    const changeBackgroundOpacity = (blockId, opacity) => {
        const newOpacity = Math.max(0, Math.min(1, parseFloat(opacity)));
        updateBlock(blockId, { backgroundOpacity: newOpacity });
    };

    // Change slide background opacity
    const changeSlideBackgroundOpacity = (opacity) => {
        const newOpacity = Math.max(0, Math.min(1, parseFloat(opacity)));
        setSlideProperties(prev => ({
            ...prev,
            backgroundOpacity: newOpacity
        }));
    };

    // Layer management
    const bringToFront = (blockId) => {
        const maxZIndex = Math.max(...blocks.map(b => b.zIndex || 1), 0);
        updateBlock(blockId, { zIndex: maxZIndex + 1 });
    };

    const sendToBack = (blockId) => {
        const minZIndex = Math.min(...blocks.map(b => b.zIndex || 1), 1);
        updateBlock(blockId, { zIndex: Math.max(1, minZIndex - 1) });
    };

    // Media Library functions
    const openMediaLibrary = (forWhat) => {
        setMediaSelectionFor(forWhat);
        setShowMediaLibrary(true);
    };

    const handleMediaSelect = (mediaItem) => {
        if (mediaSelectionFor === 'background') {
            // For slide background
            setSlideProperties(prev => ({
                ...prev,
                backgroundImage: mediaItem.file_url,
                backgroundImageLibraryId: mediaItem.id
            }));
        } else if (mediaSelectionFor) {
            // For block media
            updateBlock(mediaSelectionFor, {
                media: mediaItem.file_url,
                mediaLibraryId: mediaItem.id
            });
        }
        setShowMediaLibrary(false);
        setMediaSelectionFor(null);
    };

    const removeBackgroundImage = () => {
        setSlideProperties(prev => ({
            ...prev,
            backgroundImage: null,
            backgroundImageLibraryId: null
        }));
    };

    const removeBlockMedia = (blockId) => {
        updateBlock(blockId, {
            media: null,
            mediaLibraryId: null
        });
    };

    // Reordering layers
    const startReorder = (e, block) => {
        e.stopPropagation();
        setIsReordering(true);
        setReorderBlock(block);
    };

    const handleReorder = (targetIndex) => {
        if (!reorderBlock || !isReordering) return;

        const newBlocks = [...blocks];
        const currentIndex = newBlocks.findIndex(b => b.id === reorderBlock.id);

        if (currentIndex !== -1 && targetIndex !== currentIndex) {
            const [movedBlock] = newBlocks.splice(currentIndex, 1);
            newBlocks.splice(targetIndex, 0, movedBlock);

            const updatedBlocks = newBlocks.map((block, index) => ({
                ...block,
                zIndex: index + 1
            }));

            setBlocks(updatedBlocks);
        }
    };

    const stopReorder = () => {
        setIsReordering(false);
        setReorderBlock(null);
    };

    // Drag and resize functions
    const startDrag = useCallback((e, block) => {
        e.stopPropagation();
        setIsDragging(true);
        setSelectedBlock(block);

        const rect = slideRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - block.position.x;
        const offsetY = e.clientY - rect.top - block.position.y;
        setDragOffset({ x: offsetX, y: offsetY });
    }, []);

    const startResize = useCallback((e, block, direction) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);
        setSelectedBlock(block);
        setInitialSize({ width: block.size.width, height: block.size.height });
        setInitialMouse({ x: e.clientX, y: e.clientY });
    }, []);

    const handleDrag = useCallback((e) => {
        if (!isDragging || !selectedBlock) return;

        const rect = slideRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - dragOffset.x;
        const y = e.clientY - rect.top - dragOffset.y;

        const maxX = rect.width - selectedBlock.size.width;
        const maxY = rect.height - selectedBlock.size.height;

        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(0, Math.min(y, maxY));

        updateBlock(selectedBlock.id, {
            position: { x: boundedX, y: boundedY }
        });
    }, [isDragging, selectedBlock, dragOffset]);

    const handleResize = useCallback((e) => {
        if (!isResizing || !selectedBlock) return;

        const deltaX = e.clientX - initialMouse.x;
        const deltaY = e.clientY - initialMouse.y;

        let newWidth = initialSize.width;
        let newHeight = initialSize.height;

        switch (resizeDirection) {
            case 'nw':
                newWidth = Math.max(50, initialSize.width - deltaX);
                newHeight = Math.max(30, initialSize.height - deltaY);
                break;
            case 'ne':
                newWidth = Math.max(50, initialSize.width + deltaX);
                newHeight = Math.max(30, initialSize.height - deltaY);
                break;
            case 'sw':
                newWidth = Math.max(50, initialSize.width - deltaX);
                newHeight = Math.max(30, initialSize.height + deltaY);
                break;
            case 'se':
                newWidth = Math.max(50, initialSize.width + deltaX);
                newHeight = Math.max(30, initialSize.height + deltaY);
                break;
            default:
                break;
        }

        updateBlock(selectedBlock.id, {
            size: { width: newWidth, height: newHeight }
        });
    }, [isResizing, selectedBlock, resizeDirection, initialSize, initialMouse]);

    const stopDrag = useCallback(() => {
        setIsDragging(false);
    }, []);

    const stopResize = useCallback(() => {
        setIsResizing(false);
        setResizeDirection(null);
    }, []);

    // Event listeners for drag and resize
    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', isDragging ? handleDrag : handleResize);
            document.addEventListener('mouseup', isDragging ? stopDrag : stopResize);

            return () => {
                document.removeEventListener('mousemove', isDragging ? handleDrag : handleResize);
                document.removeEventListener('mouseup', isDragging ? stopDrag : stopResize);
            };
        }
    }, [isDragging, isResizing, handleDrag, handleResize, stopDrag, stopResize]);

    // Delete block
    const deleteBlock = (blockId) => {
        setBlocks(blocks.filter(block => block.id !== blockId));
        if (selectedBlock && selectedBlock.id === blockId) {
            setSelectedBlock(null);
        }
    };

    // Save slide with all properties including preview
    const handleSave = async () => {
        setIsGeneratingPreview(true);

        try {
            // Generate slide preview
            const slidePreview = await generateSlidePreview();

            const slideData = {
                ...slide,
                blocks: blocks.map(block => ({
                    id: block.id,
                    type: block.type,
                    content: block.content,
                    media: block.media,
                    media_library_id: block.mediaLibraryId,
                    extra: {
                        position: block.position,
                        size: block.size,
                        style: block.style,
                        zIndex: block.zIndex,
                        opacity: block.opacity,
                        backgroundOpacity: block.backgroundOpacity
                    }
                })),
                background_color: slideProperties.backgroundColor,
                background_image: slideProperties.backgroundImage,
                background_image_library_id: slideProperties.backgroundImageLibraryId,
                layout_style: slideProperties.layoutStyle,
                background_opacity: slideProperties.backgroundOpacity,
                slide_preview: slidePreview // إضافة المعاينة كـ Base64
            };

            onSave(slideData);
        } catch (error) {
            console.error('Error generating preview:', error);
            // إذا فشل توليد المعاينة، احفظ بدونها
            const slideData = {
                ...slide,
                blocks: blocks.map(block => ({
                    id: block.id,
                    type: block.type,
                    content: block.content,
                    media: block.media,
                    media_library_id: block.mediaLibraryId,
                    extra: {
                        position: block.position,
                        size: block.size,
                        style: block.style,
                        zIndex: block.zIndex,
                        opacity: block.opacity,
                        backgroundOpacity: block.backgroundOpacity
                    }
                })),
                background_color: slideProperties.backgroundColor,
                background_image: slideProperties.backgroundImage,
                background_image_library_id: slideProperties.backgroundImageLibraryId,
                layout_style: slideProperties.layoutStyle,
                background_opacity: slideProperties.backgroundOpacity
            };

            onSave(slideData);
        } finally {
            setIsGeneratingPreview(false);
        }
    };

    // Helper function to convert HEX to RGB
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : '255, 255, 255';
    };

    // Render block function
    const renderBlock = (block) => {
        const isSelected = selectedBlock && selectedBlock.id === block.id;

        const position = block.position || { x: 100, y: 100 };
        const size = block.size || getDefaultSize(block.type);

        const blockStyle = {
            ...block.style,
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: `${size.height}px`,
            position: 'absolute',
            cursor: isDragging ? 'grabbing' : 'grab',
            zIndex: block.zIndex || 1,
            opacity: block.opacity !== undefined ? block.opacity : 1
        };

        // Prevent text overflow
        if (['title', 'text', 'bullet_points', 'quote', 'code'].includes(block.type)) {
            blockStyle.overflow = 'hidden';
            blockStyle.wordWrap = 'break-word';
            blockStyle.overflowWrap = 'break-word';
        }

        let content;

        switch (block.type) {
            case 'title':
                content = (
                    <div
                        className={styles.titleBlock}
                        style={{
                            fontFamily: block.style?.fontFamily,
                            fontSize: block.style?.fontSize,
                            color: block.style?.color,
                            fontWeight: block.style?.fontWeight,
                            textAlign: block.style?.textAlign,
                            fontStyle: block.style?.fontStyle,
                            textDecoration: block.style?.textDecoration,
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden'
                        }}
                    >
                        {block.content}
                    </div>
                );
                break;

            case 'text':
                content = (
                    <div
                        className={styles.textBlock}
                        style={{
                            fontFamily: block.style?.fontFamily,
                            fontSize: block.style?.fontSize,
                            color: block.style?.color,
                            textAlign: block.style?.textAlign,
                            lineHeight: '1.6',
                            fontStyle: block.style?.fontStyle,
                            textDecoration: block.style?.textDecoration,
                            fontWeight: block.style?.fontWeight,
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden'
                        }}
                    >
                        {block.content}
                    </div>
                );
                break;

            case 'bullet_points':
                const points = block.content?.split('\n').filter(point => point.trim()) || [];
                content = (
                    <div
                        className={styles.bulletBlock}
                        style={{
                            fontFamily: block.style?.fontFamily,
                            fontSize: block.style?.fontSize,
                            color: block.style?.color,
                            textAlign: block.style?.textAlign,
                            fontStyle: block.style?.fontStyle,
                            textDecoration: block.style?.textDecoration,
                            fontWeight: block.style?.fontWeight,
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden'
                        }}
                    >
                        <ul>
                            {points.map((point, index) => (
                                <li key={index}>{point.replace('•', '').trim()}</li>
                            ))}
                        </ul>
                    </div>
                );
                break;

            case 'quote':
                content = (
                    <div
                        className={styles.quoteBlock}
                        style={{
                            fontFamily: block.style?.fontFamily,
                            fontSize: block.style?.fontSize,
                            color: block.style?.color,
                            fontStyle: block.style?.fontStyle,
                            textDecoration: block.style?.textDecoration,
                            fontWeight: block.style?.fontWeight,
                            borderLeftColor: block.style?.borderColor || '#4299e1',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            backgroundColor: block.style?.backgroundColor ?
                                `rgba(${hexToRgb(block.style.backgroundColor || '#ffffff')}, ${block.backgroundOpacity || 1})` :
                                'transparent'
                        }}
                    >
                        {block.content}
                    </div>
                );
                break;

            case 'code':
                content = (
                    <div
                        className={styles.codeBlock}
                        style={{
                            fontFamily: block.style?.fontFamily || 'Courier New, monospace',
                            fontSize: block.style?.fontSize,
                            backgroundColor: block.style?.backgroundColor ?
                                `rgba(${hexToRgb(block.style.backgroundColor || '#2d3748')}, ${block.backgroundOpacity || 1})` :
                                '#2d3748',
                            color: block.style?.color,
                            width: '100%',
                            height: '100%',
                            overflow: 'auto'
                        }}
                    >
                        <pre>{block.content}</pre>
                    </div>
                );
                break;

            case 'image':
                content = (
                    <div
                        className={styles.imageBlock}
                        style={{
                            opacity: block.backgroundOpacity !== undefined ? block.backgroundOpacity : 1
                        }}
                    >
                        {block.media ? (
                            <img
                                src={block.media}
                                alt="Block content"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        ) : (
                            <div className={styles.mediaPlaceholder}>
                                <FaImage size={32} />
                                <span>Image</span>
                            </div>
                        )}
                    </div>
                );
                break;

            case 'video':
                content = (
                    <div
                        className={styles.videoBlock}
                        style={{
                            opacity: block.backgroundOpacity !== undefined ? block.backgroundOpacity : 1
                        }}
                    >
                        {block.media ? (
                            <video controls style={{ width: '100%', height: '100%' }}>
                                <source src={block.media} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className={styles.mediaPlaceholder}>
                                <FaVideo size={32} />
                                <span>Video</span>
                            </div>
                        )}
                    </div>
                );
                break;

            default:
                content = <div>{block.content}</div>;
        }

        return (
            <div
                key={block.id}
                className={`${styles.block} ${isSelected ? styles.selected : ''}`}
                style={blockStyle}
                onMouseDown={(e) => startDrag(e, block)}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlock(block);
                }}
            >
                {/* Delete button */}
                {isSelected && (
                    <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteBlock(block.id);
                        }}
                        title="Delete element"
                    >
                        <MdClose size={16} />
                    </button>
                )}

                {/* Drag handle */}
                {isSelected && (
                    <div className={styles.dragHandle}>
                        <FaExpandArrowsAlt size={14} />
                        Drag to move
                    </div>
                )}

                {content}

                {/* Resize handles */}
                {isSelected && (
                    <>
                        <div
                            className={`${styles.resizeHandle} ${styles.topLeft}`}
                            onMouseDown={(e) => startResize(e, block, 'nw')}
                        />
                        <div
                            className={`${styles.resizeHandle} ${styles.topRight}`}
                            onMouseDown={(e) => startResize(e, block, 'ne')}
                        />
                        <div
                            className={`${styles.resizeHandle} ${styles.bottomLeft}`}
                            onMouseDown={(e) => startResize(e, block, 'sw')}
                        />
                        <div
                            className={`${styles.resizeHandle} ${styles.bottomRight}`}
                            onMouseDown={(e) => startResize(e, block, 'se')}
                        />
                    </>
                )}

                {/* Layer buttons */}
                {isSelected && (
                    <div className={styles.layerControls}>
                        <button
                            className={styles.layerButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                bringToFront(block.id);
                            }}
                            title="Bring to Front"
                        >
                            <FaArrowUp size={12} />
                        </button>
                        <button
                            className={styles.layerButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                sendToBack(block.id);
                            }}
                            title="Send to Back"
                        >
                            <FaArrowDown size={12} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Render elements list with drag and drop
    const renderElementsList = () => {
        return (
            <div className={styles.elementsList}>
                {blocks.map((block, index) => (
                    <div
                        key={block.id}
                        className={`${styles.elementItem} ${selectedBlock?.id === block.id ? styles.selectedElement : ''} ${reorderBlock?.id === block.id ? styles.draggingElement : ''}`}
                        onClick={() => setSelectedBlock(block)}
                        draggable
                        onDragStart={(e) => startReorder(e, block)}
                        onDragOver={(e) => {
                            e.preventDefault();
                            if (reorderBlock?.id !== block.id) {
                                e.currentTarget.classList.add(styles.dragOver);
                            }
                        }}
                        onDragLeave={(e) => {
                            e.currentTarget.classList.remove(styles.dragOver);
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove(styles.dragOver);
                            handleReorder(index);
                        }}
                        onDragEnd={stopReorder}
                    >
                        <div className={styles.elementDragHandle}>
                            <MdDragHandle size={16} />
                        </div>
                        <div className={styles.elementIcon}>
                            {block.type === 'title' && <MdTitle />}
                            {block.type === 'text' && <MdTextFields />}
                            {block.type === 'bullet_points' && <FaListUl />}
                            {block.type === 'image' && <FaImage />}
                            {block.type === 'video' && <FaVideo />}
                            {block.type === 'quote' && <FaQuoteRight />}
                            {block.type === 'code' && <FaCode />}
                        </div>
                        <div className={styles.elementInfo}>
                            <span className={styles.elementName}>
                                {block.type === 'title' ? 'Title' :
                                    block.type === 'text' ? 'Text' :
                                        block.type === 'bullet_points' ? 'List' :
                                            block.type === 'image' ? 'Image' :
                                                block.type === 'video' ? 'Video' :
                                                    block.type === 'quote' ? 'Quote' : 'Code'}
                            </span>
                            <span className={styles.elementPreview}>
                                {block.content ? block.content.substring(0, 20) + (block.content.length > 20 ? '...' : '') : 'No content'}
                            </span>
                        </div>
                        <div className={styles.elementActions}>
                            <span className={styles.layerBadge}>
                                {block.zIndex}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.designerContainer}>
            {/* Tools Sidebar */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarHeader}>
                    <FaVectorSquare className={styles.headerIcon} />
                    Design Tools
                </div>

                <div className={styles.toolbarSection}>
                    <h3>
                        <FaPlus className={styles.sectionIcon} />
                        Add Elements
                    </h3>
                    <div className={styles.blockPalette}>
                        <div className={styles.blockOption} onClick={() => addBlock('title')}>
                            <MdTitle className={styles.blockIcon} />
                            <div className={styles.blockLabel}>Title</div>
                        </div>
                        <div className={styles.blockOption} onClick={() => addBlock('text')}>
                            <MdTextFields className={styles.blockIcon} />
                            <div className={styles.blockLabel}>Text</div>
                        </div>
                        <div className={styles.blockOption} onClick={() => addBlock('bullet_points')}>
                            <FaListUl className={styles.blockIcon} />
                            <div className={styles.blockLabel}>Bullet List</div>
                        </div>
                        <div className={styles.blockOption} onClick={() => addBlock('image')}>
                            <FaImage className={styles.blockIcon} />
                            <div className={styles.blockLabel}>Image</div>
                        </div>
                        <div className={styles.blockOption} onClick={() => addBlock('video')}>
                            <FaVideo className={styles.blockIcon} />
                            <div className={styles.blockLabel}>Video</div>
                        </div>
                        <div className={styles.blockOption} onClick={() => addBlock('quote')}>
                            <FaQuoteRight className={styles.blockIcon} />
                            <div className={styles.blockLabel}>Quote</div>
                        </div>
                        <div className={styles.blockOption} onClick={() => addBlock('code')}>
                            <FaCode className={styles.blockIcon} />
                            <div className={styles.blockLabel}>Code</div>
                        </div>
                    </div>
                </div>

                <div className={styles.toolbarSection}>
                    <h3>
                        <FaPalette className={styles.sectionIcon} />
                        Slide Background
                    </h3>
                    <div className={styles.inputGroup}>
                        <label>Background Color</label>
                        <input
                            type="color"
                            value={slideProperties.backgroundColor}
                            onChange={(e) => setSlideProperties({
                                ...slideProperties,
                                backgroundColor: e.target.value
                            })}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Background Opacity</label>
                        <div className={styles.opacityControl}>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={slideProperties.backgroundOpacity}
                                onChange={(e) => changeSlideBackgroundOpacity(e.target.value)}
                                className={styles.opacitySlider}
                            />
                            <span className={styles.opacityValue}>
                                {Math.round(slideProperties.backgroundOpacity * 100)}%
                            </span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Background Image</label>
                        <div className={styles.mediaButtons}>
                            <button
                                type="button"
                                onClick={() => openMediaLibrary('background')}
                                className={styles.mediaLibraryButton}
                            >
                                <FaFolderOpen />
                                Choose from Library
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setSlideProperties({
                                                ...slideProperties,
                                                backgroundImage: event.target.result,
                                                backgroundImageLibraryId: null
                                            });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className={styles.fileInput}
                            />
                        </div>
                        {slideProperties.backgroundImage && (
                            <div className={styles.mediaPreview}>
                                <img src={slideProperties.backgroundImage} alt="Background" className={styles.previewImage} />
                                <button
                                    onClick={removeBackgroundImage}
                                    className={styles.removeMediaButton}
                                >
                                    <FaTimes />
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Elements list with drag and drop */}
                <div className={styles.toolbarSection}>
                    <h3>
                        <MdLayers className={styles.sectionIcon} />
                        Elements ({blocks.length})
                    </h3>
                    {renderElementsList()}
                </div>
            </div>

            {/* Main workspace */}
            <div className={styles.workspace}>
                <div className={styles.workspaceHeader}>
                    <div className={styles.workspaceTitle}>
                        <FaFont className={styles.titleIcon} />
                        {slide?.title || 'New Slide'}
                    </div>
                    <div className={styles.workspaceActions}>
                        <button
                            className={styles.controlButton}
                            onClick={handleSave}
                            disabled={isGeneratingPreview}
                        >
                            {isGeneratingPreview ? (
                                <>
                                    <FaCamera className={styles.buttonIcon} />
                                    Generating Preview...
                                </>
                            ) : (
                                <>
                                    <FaSave className={styles.buttonIcon} />
                                    Save
                                </>
                            )}
                        </button>
                        <button
                            className={`${styles.controlButton} ${styles.secondary}`}
                            onClick={onCancel}
                            disabled={isGeneratingPreview}
                        >
                            <FaTimes className={styles.buttonIcon} />
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Enhanced formatting toolbar */}
                {selectedBlock && (
                    <div className={styles.formattingToolbar}>
                        {/* Text tools */}
                        {['title', 'text', 'bullet_points', 'quote'].includes(selectedBlock.type) && (
                            <>
                                <div className={styles.formatSection}>
                                    <span className={styles.formatLabel}>Font Size:</span>
                                    <button
                                        className={styles.formatButton}
                                        onClick={() => changeFontSize(selectedBlock.id, -10)}
                                        title="Decrease Font Size"
                                    >
                                        <FaMinus />
                                    </button>
                                    <input
                                        type="number"
                                        value={parseInt(selectedBlock.style?.fontSize) || 18}
                                        onChange={(e) => {
                                            const newSize = Math.max(1, parseInt(e.target.value) || 18);
                                            updateBlockStyle(selectedBlock.id, { fontSize: `${newSize}px` });
                                        }}
                                        className={styles.fontSizeInput}
                                        min="1"
                                    />
                                    <button
                                        className={styles.formatButton}
                                        onClick={() => changeFontSize(selectedBlock.id, 10)}
                                        title="Increase Font Size"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>

                                <div className={styles.formatSection}>
                                    <button
                                        className={`${styles.formatButton} ${selectedBlock.style?.fontWeight === 'bold' ? styles.active : ''}`}
                                        onClick={() => toggleStyle(selectedBlock.id, 'fontWeight', 'bold', 'normal')}
                                        title="Bold"
                                    >
                                        <FaBold />
                                    </button>
                                    <button
                                        className={`${styles.formatButton} ${selectedBlock.style?.fontStyle === 'italic' ? styles.active : ''}`}
                                        onClick={() => toggleStyle(selectedBlock.id, 'fontStyle', 'italic', 'normal')}
                                        title="Italic"
                                    >
                                        <FaItalic />
                                    </button>
                                    <button
                                        className={`${styles.formatButton} ${selectedBlock.style?.textDecoration === 'underline' ? styles.active : ''}`}
                                        onClick={() => toggleStyle(selectedBlock.id, 'textDecoration', 'underline', 'none')}
                                        title="Underline"
                                    >
                                        <FaUnderline />
                                    </button>
                                </div>

                                <div className={styles.formatSection}>
                                    <button
                                        className={`${styles.formatButton} ${selectedBlock.style?.textAlign === 'right' ? styles.active : ''}`}
                                        onClick={() => updateBlockStyle(selectedBlock.id, { textAlign: 'right' })}
                                        title="Align Right"
                                    >
                                        <FaAlignRight />
                                    </button>
                                    <button
                                        className={`${styles.formatButton} ${selectedBlock.style?.textAlign === 'center' ? styles.active : ''}`}
                                        onClick={() => updateBlockStyle(selectedBlock.id, { textAlign: 'center' })}
                                        title="Align Center"
                                    >
                                        <FaAlignCenter />
                                    </button>
                                    <button
                                        className={`${styles.formatButton} ${selectedBlock.style?.textAlign === 'left' ? styles.active : ''}`}
                                        onClick={() => updateBlockStyle(selectedBlock.id, { textAlign: 'left' })}
                                        title="Align Left"
                                    >
                                        <FaAlignLeft />
                                    </button>
                                </div>

                                <div className={styles.formatSection}>
                                    <span className={styles.formatLabel}>Text Opacity:</span>
                                    <div className={styles.opacityControl}>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={selectedBlock.opacity || 1}
                                            onChange={(e) => changeOpacity(selectedBlock.id, e.target.value)}
                                            className={styles.opacitySlider}
                                        />
                                        <span className={styles.opacityValue}>
                                            {Math.round((selectedBlock.opacity || 1) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Background opacity for images and elements */}
                        {['image', 'video', 'code', 'quote'].includes(selectedBlock.type) && (
                            <div className={styles.formatSection}>
                                <span className={styles.formatLabel}>Background Opacity:</span>
                                <div className={styles.opacityControl}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={selectedBlock.backgroundOpacity || 1}
                                        onChange={(e) => changeBackgroundOpacity(selectedBlock.id, e.target.value)}
                                        className={styles.opacitySlider}
                                    />
                                    <span className={styles.opacityValue}>
                                        {Math.round((selectedBlock.backgroundOpacity || 1) * 100)}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Slide area */}
                <div className={styles.slideArea}>
                    <div
                        ref={slideRef}
                        className={styles.slideContainer}
                        style={{
                            backgroundColor: slideProperties.backgroundColor ?
                                `rgba(${hexToRgb(slideProperties.backgroundColor)}, ${slideProperties.backgroundOpacity})`
                                : '#FFFFFF',
                            backgroundImage: slideProperties.backgroundImage ? `url(${slideProperties.backgroundImage})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            cursor: isDragging ? 'grabbing' : 'default'
                        }}
                        onClick={() => setSelectedBlock(null)}
                    >
                        {blocks.map(renderBlock)}
                    </div>
                </div>
            </div>

            {/* Properties panel */}
            {selectedBlock && (
                <div className={styles.propertiesPanel}>
                    <div className={styles.propertiesHeader}>
                        <FaArrowsAlt className={styles.headerIcon} />
                        Element Properties
                    </div>
                    <div className={styles.propertiesContent}>
                        <BlockProperties
                            block={selectedBlock}
                            onUpdate={updateBlock}
                            onUpdateStyle={updateBlockStyle}
                            onDelete={deleteBlock}
                            onChangeFontSize={changeFontSize}
                            onToggleStyle={toggleStyle}
                            onChangeOpacity={changeOpacity}
                            onChangeBackgroundOpacity={changeBackgroundOpacity}
                            onBringToFront={bringToFront}
                            onSendToBack={sendToBack}
                            onOpenMediaLibrary={openMediaLibrary}
                            onRemoveMedia={removeBlockMedia}
                        />
                    </div>
                </div>
            )}

            {/* Media Library Modal */}
            <MediaLibraryModal
                isOpen={showMediaLibrary}
                onClose={() => {
                    setShowMediaLibrary(false);
                    setMediaSelectionFor(null);
                }}
                onSelect={handleMediaSelect}
                mediaType={mediaSelectionFor === 'background' ? 'image' :
                    selectedBlock?.type === 'image' ? 'image' :
                        selectedBlock?.type === 'video' ? 'video' : ''}
            />
        </div>
    );
};

// Enhanced Block Properties Component
const BlockProperties = ({
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
    const handleContentChange = (e) => {
        onUpdate(block.id, { content: e.target.value });
    };

    const handleStyleChange = (property, value) => {
        onUpdateStyle(block.id, { [property]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onUpdate(block.id, {
                    media: event.target.result,
                    mediaLibraryId: null
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            {/* Block content */}
            {['title', 'text', 'bullet_points', 'quote', 'code'].includes(block.type) && (
                <div className={styles.inputGroup}>
                    <label>
                        <MdTextFields className={styles.inputIcon} />
                        Content
                    </label>
                    <textarea
                        value={block.content || ''}
                        onChange={handleContentChange}
                        rows={4}
                    />
                </div>
            )}

            {/* Media management */}
            {['image', 'video'].includes(block.type) && (
                <div className={styles.inputGroup}>
                    <label>
                        {block.type === 'image' ? <FaImage className={styles.inputIcon} /> : <FaVideo className={styles.inputIcon} />}
                        {block.type === 'image' ? 'Image' : 'Video'} Source
                    </label>
                    <div className={styles.mediaButtons}>
                        <button
                            type="button"
                            onClick={() => onOpenMediaLibrary(block.id)}
                            className={styles.mediaLibraryButton}
                        >
                            <FaFolderOpen />
                            Choose from Library
                        </button>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept={block.type === 'image' ? 'image/*' : 'video/*'}
                            className={styles.fileInput}
                        />
                    </div>
                    {block.media && (
                        <div className={styles.mediaPreview}>
                            {block.type === 'image' ? (
                                <img src={block.media} alt="Block media" className={styles.previewImage} />
                            ) : (
                                <video controls className={styles.previewVideo}>
                                    <source src={block.media} type="video/mp4" />
                                </video>
                            )}
                            <button
                                onClick={() => onRemoveMedia(block.id)}
                                className={styles.removeMediaButton}
                            >
                                <FaTimes />
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Text formatting tools */}
            {['title', 'text', 'bullet_points', 'quote'].includes(block.type) && (
                <>
                    <div className={styles.inputGroup}>
                        <label>
                            <FaFont className={styles.inputIcon} />
                            Font Family
                        </label>
                        <select
                            value={block.style?.fontFamily || 'Arial'}
                            onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                            className={styles.fontSelector}
                        >
                            <optgroup label="Arabic Fonts">
                                {FONT_OPTIONS.filter(font => font.type === 'arabic').map(font => (
                                    <option key={font.value} value={font.value}>
                                        {font.label}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="English Fonts">
                                {FONT_OPTIONS.filter(font => font.type === 'english').map(font => (
                                    <option key={font.value} value={font.value}>
                                        {font.label}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <FaTextHeight className={styles.inputIcon} />
                            Font Size
                        </label>
                        <div className={styles.fontSizeControls}>
                            <button
                                className={styles.sizeButton}
                                onClick={() => onChangeFontSize(block.id, -10)}
                            >
                                <FaMinus />
                            </button>
                            <input
                                type="number"
                                value={parseInt(block.style?.fontSize) || 18}
                                onChange={(e) => {
                                    const newSize = Math.max(1, parseInt(e.target.value) || 18);
                                    onUpdateStyle(block.id, { fontSize: `${newSize}px` });
                                }}
                                className={styles.fontSizeInput}
                                min="1"
                            />
                            <button
                                className={styles.sizeButton}
                                onClick={() => onChangeFontSize(block.id, 10)}
                            >
                                <FaPlus />
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <FaPalette className={styles.inputIcon} />
                            Text Color
                        </label>
                        <input
                            type="color"
                            value={block.style?.color || '#000000'}
                            onChange={(e) => handleStyleChange('color', e.target.value)}
                            className={styles.colorPicker}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Text Formatting</label>
                        <div className={styles.formattingTools}>
                            <button
                                className={`${styles.formatButton} ${block.style?.fontWeight === 'bold' ? styles.active : ''}`}
                                onClick={() => onToggleStyle(block.id, 'fontWeight', 'bold', 'normal')}
                            >
                                <strong>B</strong>
                            </button>
                            <button
                                className={`${styles.formatButton} ${block.style?.fontStyle === 'italic' ? styles.active : ''}`}
                                onClick={() => onToggleStyle(block.id, 'fontStyle', 'italic', 'normal')}
                            >
                                <em>I</em>
                            </button>
                            <button
                                className={`${styles.formatButton} ${block.style?.textDecoration === 'underline' ? styles.active : ''}`}
                                onClick={() => onToggleStyle(block.id, 'textDecoration', 'underline', 'none')}
                            >
                                <u>U</u>
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Text Alignment</label>
                        <div className={styles.formattingTools}>
                            <button
                                className={`${styles.formatButton} ${block.style?.textAlign === 'right' ? styles.active : ''}`}
                                onClick={() => handleStyleChange('textAlign', 'right')}
                            >
                                <FaAlignRight />
                            </button>
                            <button
                                className={`${styles.formatButton} ${block.style?.textAlign === 'center' ? styles.active : ''}`}
                                onClick={() => handleStyleChange('textAlign', 'center')}
                            >
                                <FaAlignCenter />
                            </button>
                            <button
                                className={`${styles.formatButton} ${block.style?.textAlign === 'left' ? styles.active : ''}`}
                                onClick={() => handleStyleChange('textAlign', 'left')}
                            >
                                <FaAlignLeft />
                            </button>
                        </div>
                    </div>

                    {/* Text opacity */}
                    <div className={styles.inputGroup}>
                        <label>
                            <FaEye className={styles.inputIcon} />
                            Text Opacity
                        </label>
                        <div className={styles.opacityControl}>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={block.opacity || 1}
                                onChange={(e) => onChangeOpacity(block.id, e.target.value)}
                                className={styles.opacitySlider}
                            />
                            <span className={styles.opacityValue}>
                                {Math.round((block.opacity || 1) * 100)}%
                            </span>
                        </div>
                    </div>
                </>
            )}

            {/* Background opacity for images and elements */}
            {['image', 'video', 'code', 'quote'].includes(block.type) && (
                <div className={styles.inputGroup}>
                    <label>
                        <FaEyeSlash className={styles.inputIcon} />
                        Background Opacity
                    </label>
                    <div className={styles.opacityControl}>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={block.backgroundOpacity || 1}
                            onChange={(e) => onChangeBackgroundOpacity(block.id, e.target.value)}
                            className={styles.opacitySlider}
                        />
                        <span className={styles.opacityValue}>
                            {Math.round((block.backgroundOpacity || 1) * 100)}%
                        </span>
                    </div>
                </div>
            )}

            {/* Layer management */}
            <div className={styles.inputGroup}>
                <label>
                    <FaLayerGroup className={styles.inputIcon} />
                    Layer Management
                </label>
                <div className={styles.layerControls}>
                    <button
                        className={styles.controlButton}
                        onClick={() => onBringToFront(block.id)}
                    >
                        <FaArrowUp className={styles.buttonIcon} />
                        Bring to Front
                    </button>
                    <button
                        className={styles.controlButton}
                        onClick={() => onSendToBack(block.id)}
                    >
                        <FaArrowDown className={styles.buttonIcon} />
                        Send to Back
                    </button>
                </div>
            </div>

            {/* Dimensions info */}
            <div className={styles.dimensionsInfo}>
                <div className={styles.dimensionItem}>
                    <span>Width:</span>
                    <span>{block.size?.width}px</span>
                </div>
                <div className={styles.dimensionItem}>
                    <span>Height:</span>
                    <span>{block.size?.height}px</span>
                </div>
                <div className={styles.dimensionItem}>
                    <span>Position X:</span>
                    <span>{block.position?.x}px</span>
                </div>
                <div className={styles.dimensionItem}>
                    <span>Position Y:</span>
                    <span>{block.position?.y}px</span>
                </div>
                <div className={styles.dimensionItem}>
                    <span>Layer:</span>
                    <span>{block.zIndex}</span>
                </div>
            </div>

            {/* Delete block */}
            <div className={styles.inputGroup}>
                <button
                    className={`${styles.controlButton} ${styles.danger}`}
                    onClick={() => onDelete(block.id)}
                >
                    <FaTrash className={styles.buttonIcon} />
                    Delete Element
                </button>
            </div>
        </div>
    );
};

export default SlideDesigner;