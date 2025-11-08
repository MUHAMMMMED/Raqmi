



import html2canvas from 'html2canvas';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FaAlignCenter, FaAlignLeft, FaAlignRight, FaArrowDown,
    FaArrowUp, FaBold, FaCode, FaFolderOpen, FaFont, FaImage, FaItalic,
    FaListUl, FaMinus, FaPalette, FaPlus, FaQuoteRight, FaSave,
    FaTimes, FaUnderline, FaVectorSquare, FaVideo
} from 'react-icons/fa';
import { MdClose, MdDragHandle, MdLayers, MdTextFields, MdTitle } from 'react-icons/md';
import { getDefaultContent, getDefaultSize, getDefaultStyle } from './constants';

import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from '../../../../api/AxiosInstance';
import MediaLibraryModal from '../MediaLibrary/MediaLibraryModal';
import BlockProperties from './BlockProperties';
import Image from './components/Image/Image';
import Video from './components/Video/Video';
import styles from './SlideDesigner.module.css';

// مكتبة السحب والإفلات
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

const SlideDesigner = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [slide, setSlide] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [editingBlockId, setEditingBlockId] = useState(null);
    const [slideProperties, setSlideProperties] = useState({
        backgroundColor: '#FFFFFF',
        backgroundImage: null,
        backgroundImageLibraryId: null,
        layoutStyle: 'default',
        backgroundOpacity: 1
    });

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeDirection, setResizeDirection] = useState(null);
    const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
    const [initialMouse, setInitialMouse] = useState({ x: 0, y: 0 });
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [mediaSelectionFor, setMediaSelectionFor] = useState(null);
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const slideRef = useRef(null);

    /* --------------------------------------------------------------
       1. Load slide
    -------------------------------------------------------------- */
    useEffect(() => {
        if (!id) return;
        loadSlide();
    }, [id]);

    const loadSlide = async () => {
        try {
            const { data } = await AxiosInstance.get(`slides/slides/${id}/`);
            setSlide(data);
        } catch (err) {
            alert('فشل تحميل الشريحة');
            navigate(-1);
        }
    };

    /* --------------------------------------------------------------
       2. Transform API → frontend
    -------------------------------------------------------------- */
    useEffect(() => {
        if (!slide) return;

        const processed = (slide.blocks || []).map(b => ({
            id: b.id,
            type: b.type,
            content: b.content || '',
            media: b.image_url || null,
            mediaLibraryId: b.media_library_id || null,

            position: { x: b.position_x, y: b.position_y },
            size: { width: b.width, height: b.height },
            zIndex: b.z_index,
            opacity: b.opacity,
            backgroundOpacity: b.background_opacity,

            style: {
                fontFamily: b.font_family || 'Arial, sans-serif',
                fontSize: `${b.font_size}px`,
                color: b.font_color || '#000000',
                fontWeight: b.font_weight || 'normal',
                fontStyle: b.font_style || 'normal',
                textAlign: b.text_align || 'right',
                textDecoration: b.text_decoration || 'none',
                backgroundColor: b.background_color || 'transparent',
                borderRadius: `${b.border_radius}px`,
                border: `${b.border_width}px solid ${b.border_color || 'transparent'}`,
            },

            extra_data: b.extra_data || {}
        })).sort((a, b) => a.zIndex - b.zIndex);

        setBlocks(processed);

        setSlideProperties({
            backgroundColor: slide.background_color || '#FFFFFF',
            backgroundImage: slide.background_image_url || null,
            backgroundImageLibraryId: slide.background_image || null,
            layoutStyle: slide.layout_style || 'default',
            backgroundOpacity: slide.background_opacity || 1,
        });
    }, [slide]);

    /* --------------------------------------------------------------
       3. Preview - جودة عالية جدًا (بدون تغيير DOM)
    -------------------------------------------------------------- */
    const generateSlidePreview = async () => {
        if (!slideRef.current) return null;
        setIsGeneratingPreview(true);

        try {
            const rect = slideRef.current.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            const canvas = await html2canvas(slideRef.current, {
                backgroundColor: null,
                scale: 3, // جودة عالية جدًا
                useCORS: true,
                allowTaint: true,
                logging: false,
                width,
                height,
                onclone: (doc) => {
                    const style = doc.createElement('style');
                    style.innerHTML = `
                        * { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
                        img { image-rendering: crisp-edges; }
                    `;
                    doc.head.appendChild(style);
                }
            });

            return await new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/png', 1.0);
            });
        } catch (e) {
            console.error('Error generating preview:', e);
            return null;
        } finally {
            setIsGeneratingPreview(false);
        }
    };


    /* --------------------------------------------------------------
       4. Block-level Save / Create / Delete
    -------------------------------------------------------------- */
    const saveBlock = async (block) => {
        if (!slide?.id) return { success: false };

        const payload = {
            type: block.type,
            content: block.content || null,
            media: block.mediaLibraryId ? block.mediaLibraryId : null,
            position_x: Math.round(block.position.x),
            position_y: Math.round(block.position.y),
            width: block.size.width,
            height: block.size.height,
            z_index: block.zIndex,
            opacity: block.opacity,
            background_opacity: block.backgroundOpacity,
            font_family: block.style.fontFamily,
            font_size: parseInt(block.style.fontSize) || 18,
            font_color: block.style.color,
            font_weight: block.style.fontWeight,
            font_style: block.style.fontStyle,
            text_align: block.style.textAlign,
            text_decoration: block.style.textDecoration,
            background_color: block.style.backgroundColor === 'transparent' ? null : block.style.backgroundColor,
            border_radius: parseInt(block.style.borderRadius) || 0,
            border_color: (block.style.border?.match(/solid\s+(.+)/) || [])[1] || null,
            border_width: parseInt(block.style.border) || 0,
            extra_data: block.extra_data || {},
            slide: slide.id
        };

        try {
            if (String(block.id).startsWith('temp-')) {
                const res = await AxiosInstance.post(`slides/blocks/`, payload);
                const newId = res.data.id;
                setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, id: newId } : b));
                setHasUnsavedChanges(false);
                return { success: true, action: 'created', id: newId };
            } else {
                await AxiosInstance.patch(`slides/blocks/${block.id}/`, payload);
                setHasUnsavedChanges(false);
                return { success: true, action: 'updated' };
            }
        } catch (e) {
            console.error('Block save failed', e);
            alert('فشل حفظ العنصر');
            return { success: false };
        }
    };

    const saveAllBlocks = async () => {
        const results = [];
        for (const block of blocks) {
            const payload = {
                type: block.type,
                content: block.content || null,
                media: block.mediaLibraryId ? block.mediaLibraryId : null,
                position_x: Math.round(block.position.x),
                position_y: Math.round(block.position.y),
                width: block.size.width,
                height: block.size.height,
                z_index: block.zIndex,
                opacity: block.opacity,
                background_opacity: block.backgroundOpacity,
                font_family: block.style.fontFamily,
                font_size: parseInt(block.style.fontSize) || 18,
                font_color: block.style.color,
                font_weight: block.style.fontWeight,
                font_style: block.style.fontStyle,
                text_align: block.style.textAlign,
                text_decoration: block.style.textDecoration,
                background_color: block.style.backgroundColor === 'transparent' ? null : block.style.backgroundColor,
                border_radius: parseInt(block.style.borderRadius) || 0,
                border_color: (block.style.border?.match(/solid\s+(.+)/) || [])[1] || null,
                border_width: parseInt(block.style.border) || 0,
                extra_data: block.extra_data || {},
                slide: slide.id
            };

            try {
                if (String(block.id).startsWith('temp-')) {
                    const res = await AxiosInstance.post(`slides/blocks/`, payload);
                    const newId = res.data.id;
                    setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, id: newId } : b));
                    results.push({ success: true, action: 'created', id: newId });
                } else {
                    await AxiosInstance.patch(`slides/blocks/${block.id}/`, payload);
                    results.push({ success: true, action: 'updated', id: block.id });
                }
            } catch (e) {
                console.error(`Failed to save block ${block.id}`, e);
                results.push({ success: false, id: block.id });
            }
        }

        if (results.length > 0) setHasUnsavedChanges(false);
        return results;
    };

    const deleteBlockFromServer = async (blockId) => {
        if (String(blockId).startsWith('temp-')) {
            setBlocks(prev => prev.filter(b => b.id !== blockId));
            if (selectedBlock?.id === blockId) setSelectedBlock(null);
            if (editingBlockId === blockId) setEditingBlockId(null);
            setHasUnsavedChanges(false);
            return { success: true };
        }

        try {
            await AxiosInstance.delete(`slides/blocks/${blockId}/`);
            setBlocks(prev => prev.filter(b => b.id !== blockId));
            if (selectedBlock?.id === blockId) setSelectedBlock(null);
            if (editingBlockId === blockId) setEditingBlockId(null);
            setHasUnsavedChanges(false);
            return { success: true };
        } catch (e) {
            alert('فشل حذف العنصر');
            return { success: false };
        }
    };

    /* --------------------------------------------------------------
       5. Add block
    -------------------------------------------------------------- */
    const addBlock = (type) => {
        const maxZ = Math.max(...blocks.map(b => b.zIndex || 1), 0);
        const newBlock = {
            id: `temp-${Date.now()}-${Math.random()}`,
            type,
            content: getDefaultContent(type),
            media: null,
            mediaLibraryId: null,
            position: { x: 100, y: 100 },
            size: getDefaultSize(type),
            zIndex: maxZ + 1,
            opacity: 1,
            backgroundOpacity: 1,
            style: { ...getDefaultStyle(type) },
            extra_data: {}
        };
        setBlocks([...blocks, newBlock]);
        setSelectedBlock(newBlock);
        setEditingBlockId(newBlock.id);
        setHasUnsavedChanges(true);
    };

    /* --------------------------------------------------------------
       6. Block helpers
    -------------------------------------------------------------- */
    const updateBlock = (blockId, updates) => {
        setBlocks(prev => prev.map(b => (b.id === blockId ? { ...b, ...updates } : b)));
        setHasUnsavedChanges(true);
    };

    const updateBlockStyle = (blockId, styleUpdates) => {
        setBlocks(prev => prev.map(b =>
            b.id === blockId ? { ...b, style: { ...b.style, ...styleUpdates } } : b
        ));
        setHasUnsavedChanges(true);
    };

    const toggleEdit = (blockId) => {
        setEditingBlockId(prev => (prev === blockId ? null : blockId));
    };

    const updateBlockContent = (blockId, newContent) => {
        updateBlock(blockId, { content: newContent });
    };

    const selectBlock = (block) => {
        setSelectedBlock(block);
    };

    const showProperties = (block) => {
        setSelectedBlock(block);
    };

    const changeFontSize = (blockId, delta) => {
        const cur = parseInt(selectedBlock?.style?.fontSize) || 18;
        const next = Math.max(1, cur + delta);
        updateBlockStyle(blockId, { fontSize: `${next}px` });
    };

    const toggleStyle = (blockId, prop, on, off = 'normal') => {
        const cur = selectedBlock?.style?.[prop];
        updateBlockStyle(blockId, { [prop]: cur === on ? off : on });
    };

    const changeOpacity = (blockId, v) => {
        const val = Math.max(0, Math.min(1, parseFloat(v)));
        updateBlock(blockId, { opacity: val });
    };

    const changeBackgroundOpacity = (blockId, v) => {
        const val = Math.max(0, Math.min(1, parseFloat(v)));
        updateBlock(blockId, { backgroundOpacity: val });
    };

    const changeSlideBackgroundOpacity = (v) => {
        const val = Math.max(0, Math.min(1, parseFloat(v)));
        setSlideProperties(p => ({ ...p, backgroundOpacity: val }));
        setHasUnsavedChanges(true);
    };

    const bringToFront = (blockId) => {
        const max = Math.max(...blocks.map(b => b.zIndex || 1), 0);
        updateBlock(blockId, { zIndex: max + 1 });
    };

    const sendToBack = (blockId) => {
        const min = Math.min(...blocks.map(b => b.zIndex || 1), 1);
        updateBlock(blockId, { zIndex: Math.max(1, min - 1) });
    };

    /* --------------------------------------------------------------
       7. Media
    -------------------------------------------------------------- */
    const openMediaLibrary = (forWhat) => {
        setMediaSelectionFor(forWhat);
        setShowMediaLibrary(true);
    };

    const handleMediaSelect = (mediaItem) => {
        if (mediaSelectionFor === 'background') {
            setSlideProperties(p => ({
                ...p,
                backgroundImage: mediaItem.file_url,
                backgroundImageLibraryId: mediaItem.id
            }));
        } else if (mediaSelectionFor) {
            updateBlock(mediaSelectionFor, {
                media: mediaItem.file_url,
                mediaLibraryId: mediaItem.id
            });
        }
        setShowMediaLibrary(false);
        setMediaSelectionFor(null);
        setHasUnsavedChanges(true);
    };

    const removeBackgroundImage = () => {
        setSlideProperties(p => ({ ...p, backgroundImage: null, backgroundImageLibraryId: null }));
        setHasUnsavedChanges(true);
    };

    const removeBlockMedia = (blockId) => {
        updateBlock(blockId, { media: null, mediaLibraryId: null });
    };

    /* --------------------------------------------------------------
       8. Drag & Resize
    -------------------------------------------------------------- */
    const startDrag = useCallback((e, block) => {
        e.stopPropagation();
        setIsDragging(true);
        setSelectedBlock(block);
        setEditingBlockId(null);
        const rect = slideRef.current.getBoundingClientRect();
        const offX = e.clientX - rect.left - block.position.x;
        const offY = e.clientY - rect.top - block.position.y;
        setDragOffset({ x: offX, y: offY });
    }, []);

    const startResize = useCallback((e, block, dir) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(dir);
        setSelectedBlock(block);
        setEditingBlockId(null);
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
            position: {
                x: Math.round(boundedX),
                y: Math.round(boundedY)
            }
        });
    }, [isDragging, selectedBlock, dragOffset]);

    const handleResize = useCallback((e) => {
        if (!isResizing || !selectedBlock) return;
        const dx = e.clientX - initialMouse.x;
        const dy = e.clientY - initialMouse.y;
        let w = initialSize.width;
        let h = initialSize.height;
        switch (resizeDirection) {
            case 'nw': w = Math.max(50, initialSize.width - dx); h = Math.max(30, initialSize.height - dy); break;
            case 'ne': w = Math.max(50, initialSize.width + dx); h = Math.max(30, initialSize.height - dy); break;
            case 'sw': w = Math.max(50, initialSize.width - dx); h = Math.max(30, initialSize.height + dy); break;
            case 'se': w = Math.max(50, initialSize.width + dx); h = Math.max(30, initialSize.height + dy); break;
            default: break;
        }
        updateBlock(selectedBlock.id, { size: { width: w, height: h } });
    }, [isResizing, selectedBlock, resizeDirection, initialSize, initialMouse]);

    const stopDrag = useCallback(() => { setIsDragging(false); setHasUnsavedChanges(true); }, []);
    const stopResize = useCallback(() => { setIsResizing(false); setResizeDirection(null); setHasUnsavedChanges(true); }, []);

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

    /* --------------------------------------------------------------
       9. Final save - مُحسّن لحفظ الصورة تلقائياً (باستخدام FormData)
    -------------------------------------------------------------- */
    const handleFinalSave = async () => {
        setIsGeneratingPreview(true);
        try {
            // 1. حفظ خصائص الشريحة
            await AxiosInstance.patch(`slides/slides/${slide.id}/`, {
                background_color: slideProperties.backgroundColor,
                background_image: slideProperties.backgroundImageLibraryId ?? null,
                background_opacity: slideProperties.backgroundOpacity,
                layout_style: slideProperties.layoutStyle,
            });

            // 2. حفظ جميع الكتل
            const blockResults = await saveAllBlocks();
            const successBlocks = blockResults.filter(r => r.success).length;
            console.log(`تم حفظ ${successBlocks} من ${blockResults.length} كتلة`);

            // 3. إنشاء وحفظ صورة المعاينة
            const blob = await generateSlidePreview();
            if (blob) {
                const formData = new FormData();
                formData.append('slide_viewer', blob, `slide_preview_${slide.id}.png`);

                await AxiosInstance.patch(`slides/slides/${slide.id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('تم حفظ صورة المعاينة بنجاح');
            }

            alert('تم حفظ الشريحة بنجاح!');
            navigate(-1);
        } catch (e) {
            console.error('Error in final save:', e);
            alert('خطأ أثناء الحفظ النهائي');
        } finally {
            setIsGeneratingPreview(false);
        }
    };

    /* --------------------------------------------------------------
       10. Save Preview Only - لحفظ المعاينة فقط
    -------------------------------------------------------------- */
    const savePreviewOnly = async () => {
        if (!slide?.id) {
            alert('لا توجد شريحة نشطة');
            return;
        }

        setIsGeneratingPreview(true);
        try {
            await saveAllBlocks();

            const blob = await generateSlidePreview();
            if (!blob) {
                alert('فشل في إنشاء المعاينة');
                return;
            }

            const formData = new FormData();
            formData.append('slide_viewer', blob, `slide_preview_${slide.id}.png`);

            await AxiosInstance.patch(`slides/slides/${slide.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('تم حفظ صورة المعاينة بنجاح!');
            setHasUnsavedChanges(false);
        } catch (e) {
            console.error('Error saving preview:', e);
            alert('خطأ في حفظ المعاينة');
        } finally {
            setIsGeneratingPreview(false);
        }
    };

    const handleCancel = () => {
        if (hasUnsavedChanges && !window.confirm('هناك تغييرات غير محفوظة، هل تريد الخروج؟')) return;
        navigate(-1);
    };

    const hexToRgb = (hex) => {
        const c = hex.replace('#', '');
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    };

    const deleteBlock = (blockId) => {
        setBlocks(prev => prev.filter(b => b.id !== blockId));
        if (selectedBlock?.id === blockId) setSelectedBlock(null);
        if (editingBlockId === blockId) setEditingBlockId(null);
        setHasUnsavedChanges(true);
    };

    /* --------------------------------------------------------------
       11. Layers Drag & Drop
    -------------------------------------------------------------- */
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const newBlocks = Array.from(blocks);
        const [moved] = newBlocks.splice(source.index, 1);
        newBlocks.splice(destination.index, 0, moved);

        const reordered = newBlocks.map((b, idx) => ({
            ...b,
            zIndex: idx + 1,
        }));

        setBlocks(reordered);
        setHasUnsavedChanges(true);
    };

    /* --------------------------------------------------------------
       12. Render block
    -------------------------------------------------------------- */
    const renderBlock = (block) => {
        const isSel = selectedBlock?.id === block.id;
        const isEdit = editingBlockId === block.id;
        const pos = block.position || { x: 100, y: 100 };
        const sz = block.size || getDefaultSize(block.type);

        const blockStyle = {
            ...block.style,
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            width: `${sz.width}px`,
            height: `${sz.height}px`,
            position: 'absolute',
            cursor: isDragging ? 'grabbing' : (isEdit ? 'text' : 'grab'),
            zIndex: block.zIndex || 1,
            opacity: block.opacity ?? 1,
            padding: '8px',
            boxSizing: 'border-box',
            overflow: 'hidden',
        };

        const isTextBlock = ['title', 'text', 'bullet_points', 'quote', 'code'].includes(block.type);

        let content;
        if (isTextBlock) {
            content = (
                <EditableContent
                    block={block}
                    isEditing={isEdit}
                    onToggleEdit={() => toggleEdit(block.id)}
                    onUpdate={updateBlockContent}
                    onSelectBlock={selectBlock}
                    onShowProperties={showProperties}
                    selectedBlock={selectedBlock}
                />
            );
        } else {
            content = block.type === 'image' ? <Image block={block} styles={styles} /> :
                block.type === 'video' ? <Video block={block} styles={styles} /> : null;
        }

        return (
            <div
                key={block.id}
                className={`${styles.block} ${isSel ? styles.selected : ''} ${isEdit ? styles.editing : ''}`}
                style={blockStyle}
                onMouseDown={(e) => !isEdit && startDrag(e, block)}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isEdit) {
                        selectBlock(block);
                        showProperties(block);
                    }
                }}
            >
                {isSel && !isEdit && (
                    <button className={styles.deleteButton} onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}>
                        <MdClose size={16} />
                    </button>
                )}
                {content}
                {isSel && !isEdit && (
                    <>
                        <div className={`${styles.resizeHandle} ${styles.topLeft}`} onMouseDown={(e) => startResize(e, block, 'nw')} />
                        <div className={`${styles.resizeHandle} ${styles.topRight}`} onMouseDown={(e) => startResize(e, block, 'ne')} />
                        <div className={`${styles.resizeHandle} ${styles.bottomLeft}`} onMouseDown={(e) => startResize(e, block, 'sw')} />
                        <div className={`${styles.resizeHandle} ${styles.bottomRight}`} onMouseDown={(e) => startResize(e, block, 'se')} />
                    </>
                )}
                {isSel && !isEdit && (
                    <div className={styles.layerControls}>
                        <button onClick={(e) => { e.stopPropagation(); bringToFront(block.id); }}><FaArrowUp size={19} /></button>
                        <button onClick={(e) => { e.stopPropagation(); sendToBack(block.id); }}><FaArrowDown size={19} /></button>
                    </div>
                )}
            </div>
        );
    };

    if (!slide) return <div className={styles.loading}>جاري التحميل...</div>;

    return (
        <div className={styles.designerContainer}>
            {/* TOOLBAR */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarHeader}>
                    <FaVectorSquare className={styles.headerIcon} />
                    أدوات التصميم
                    {hasUnsavedChanges && <span className={styles.unsavedIndicator}>*</span>}
                </div>

                {/* Add Elements */}
                <div className={styles.toolbarSection}>
                    <h3><FaPlus className={styles.sectionIcon} /> إضافة عناصر</h3>
                    <div className={styles.blockPalette}>
                        <div className={styles.blockOption} onClick={() => addBlock('title')}><MdTitle className={styles.blockIcon} /><div className={styles.blockLabel}>عنوان</div></div>
                        <div className={styles.blockOption} onClick={() => addBlock('text')}><MdTextFields className={styles.blockIcon} /><div className={styles.blockLabel}>نص</div></div>
                        <div className={styles.blockOption} onClick={() => addBlock('bullet_points')}><FaListUl className={styles.blockIcon} /><div className={styles.blockLabel}>قائمة</div></div>
                        <div className={styles.blockOption} onClick={() => addBlock('image')}><FaImage className={styles.blockIcon} /><div className={styles.blockLabel}>صورة</div></div>
                        <div className={styles.blockOption} onClick={() => addBlock('video')}><FaVideo className={styles.blockIcon} /><div className={styles.blockLabel}>فيديو</div></div>
                        <div className={styles.blockOption} onClick={() => addBlock('quote')}><FaQuoteRight className={styles.blockIcon} /><div className={styles.blockLabel}>اقتباس</div></div>
                        <div className={styles.blockOption} onClick={() => addBlock('code')}><FaCode className={styles.blockIcon} /><div className={styles.blockLabel}>كود</div></div>
                    </div>
                </div>

                {/* Background */}
                <div className={styles.toolbarSection}>
                    <h3><FaPalette className={styles.sectionIcon} /> خلفية الشريحة</h3>
                    <div className={styles.inputGroup}>
                        <label>لون الخلفية</label>
                        <input type="color" value={slideProperties.backgroundColor}
                            onChange={e => { setSlideProperties(p => ({ ...p, backgroundColor: e.target.value })); setHasUnsavedChanges(true); }} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>شفافية الخلفية</label>
                        <div className={styles.opacityControl}>
                            <input type="range" min="0" max="1" step="0.01"
                                value={slideProperties.backgroundOpacity}
                                onChange={e => changeSlideBackgroundOpacity(e.target.value)}
                                className={styles.opacitySlider} />
                            <span className={styles.opacityValue}>{Math.round(slideProperties.backgroundOpacity * 100)}%</span>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>صورة الخلفية</label>
                        <button onClick={() => openMediaLibrary('background')} className={styles.mediaLibraryButton}>
                            <FaFolderOpen /> اختر من المكتبة
                        </button>
                        {slideProperties.backgroundImage && (
                            <div className={styles.mediaPreview}>
                                <img src={slideProperties.backgroundImage} alt="bg" className={styles.previewImage} />
                                <button onClick={removeBackgroundImage} className={styles.removeMediaButton}><FaTimes /> إزالة</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Elements List + Save All */}
                <div className={styles.toolbarSection}>
                    <h3><MdLayers className={styles.sectionIcon} /> العناصر ({blocks.length})</h3>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="blocks-list">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={styles.elementsList}
                                >
                                    {blocks.map((b, idx) => (
                                        <Draggable key={b.id} draggableId={String(b.id)} index={idx}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`${styles.elementItem} ${selectedBlock?.id === b.id ? styles.selectedElement : ''} ${snapshot.isDragging ? styles.draggingElement : ''}`}
                                                    onClick={() => { selectBlock(b); showProperties(b); }}
                                                >
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className={styles.elementDragHandle}
                                                    >
                                                        <MdDragHandle size={16} />
                                                    </div>
                                                    <div className={styles.elementIcon}>
                                                        {b.type === 'title' && <MdTitle />}
                                                        {b.type === 'text' && <MdTextFields />}
                                                        {b.type === 'bullet_points' && <FaListUl />}
                                                        {b.type === 'image' && <FaImage />}
                                                        {b.type === 'video' && <FaVideo />}
                                                        {b.type === 'quote' && <FaQuoteRight />}
                                                        {b.type === 'code' && <FaCode />}
                                                    </div>
                                                    <div className={styles.elementInfo}>
                                                        <span className={styles.elementName}>
                                                            {b.type === 'title' ? 'عنوان' : b.type === 'text' ? 'نص' : b.type === 'bullet_points' ? 'قائمة' : b.type === 'image' ? 'صورة' : b.type === 'video' ? 'فيديو' : b.type === 'quote' ? 'اقتباس' : 'كود'}
                                                        </span>
                                                        <span className={styles.elementPreview}>
                                                            {b.content ? b.content.substring(0, 20) + (b.content.length > 20 ? '...' : '') : 'لا يوجد محتوى'}
                                                        </span>
                                                    </div>
                                                    <div className={styles.elementActions}>
                                                        <button
                                                            className={styles.blockSaveBtn}
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                const result = await saveBlock(b);
                                                                if (result.success) alert(`تم ${result.action === 'created' ? 'إنشاء' : 'تحديث'} العنصر!`);
                                                            }}
                                                        >
                                                            <FaSave size={12} />
                                                        </button>
                                                        <button
                                                            className={styles.blockDeleteBtn}
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                if (window.confirm('حذف العنصر؟')) {
                                                                    const res = await deleteBlockFromServer(b.id);
                                                                    if (res.success) alert('تم الحذف');
                                                                }
                                                            }}
                                                        >
                                                            <MdClose size={12} />
                                                        </button>
                                                        <span className={styles.layerBadge}>{b.zIndex}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <div style={{ marginTop: '16px' }}>
                        <button
                            className={styles.saveAllButton}
                            onClick={async () => {
                                const results = await saveAllBlocks();
                                const success = results.filter(r => r.success).length;
                                const fail = results.length - success;
                                alert(fail === 0 ? `تم حفظ ${success} عنصر!` : `نجح: ${success}، فشل: ${fail}`);
                            }}
                            disabled={!hasUnsavedChanges}
                        >
                            <FaSave /> حفظ الجميع
                        </button>
                    </div>
                </div>
            </div>

            {/* WORKSPACE */}
            <div className={styles.workspace}>
                <div className={styles.workspaceHeader}>
                    <div className={styles.workspaceTitle}>
                        <FaFont className={styles.titleIcon} />
                        {slide?.title || 'شريحة جديدة'}
                        {hasUnsavedChanges && <span className={styles.unsavedBadge}>غير محفوظة</span>}
                    </div>
                    <div className={styles.workspaceActions}>
                        <button
                            className={styles.controlButton}
                            onClick={savePreviewOnly}
                            disabled={isGeneratingPreview}
                        >
                            {isGeneratingPreview ? 'جاري الحفظ...' : 'حفظ المعاينة'}
                        </button>
                        <button className={`${styles.controlButton} ${styles.danger}`} onClick={handleCancel}>إلغاء</button>
                    </div>
                </div>

                {selectedBlock && (
                    <div className={styles.formattingToolbar}>
                        {['title', 'text', 'bullet_points', 'quote'].includes(selectedBlock.type) && (
                            <>
                                <div className={styles.formatSection}>
                                    <button className={styles.sizeButton} onClick={() => changeFontSize(selectedBlock.id, -2)}><FaMinus /></button>
                                    <input type="number" value={parseInt(selectedBlock.style.fontSize) || 18}
                                        onChange={e => updateBlockStyle(selectedBlock.id, { fontSize: `${Math.max(1, e.target.value)}px` })}
                                        className={styles.fontSizeInput} />
                                    <button className={styles.sizeButton} onClick={() => changeFontSize(selectedBlock.id, 2)}><FaPlus /></button>
                                </div>
                                <div className={styles.formatSection}>
                                    <button className={`${styles.formatButton} ${selectedBlock.style?.fontWeight === 'bold' ? styles.active : ''}`} onClick={() => toggleStyle(selectedBlock.id, 'fontWeight', 'bold')}><FaBold /></button>
                                    <button className={`${styles.formatButton} ${selectedBlock.style?.fontStyle === 'italic' ? styles.active : ''}`} onClick={() => toggleStyle(selectedBlock.id, 'fontStyle', 'italic')}><FaItalic /></button>
                                    <button className={`${styles.formatButton} ${selectedBlock.style?.textDecoration === 'underline' ? styles.active : ''}`} onClick={() => toggleStyle(selectedBlock.id, 'textDecoration', 'underline')}><FaUnderline /></button>
                                </div>
                                <div className={styles.formatSection}>
                                    <button className={`${styles.formatButton} ${selectedBlock.style?.textAlign === 'right' ? styles.active : ''}`} onClick={() => updateBlockStyle(selectedBlock.id, { textAlign: 'right' })}><FaAlignRight /></button>
                                    <button className={`${styles.formatButton} ${selectedBlock.style?.textAlign === 'center' ? styles.active : ''}`} onClick={() => updateBlockStyle(selectedBlock.id, { textAlign: 'center' })}><FaAlignCenter /></button>
                                    <button className={`${styles.formatButton} ${selectedBlock.style?.textAlign === 'left' ? styles.active : ''}`} onClick={() => updateBlockStyle(selectedBlock.id, { textAlign: 'left' })}><FaAlignLeft /></button>
                                </div>
                                <div className={styles.formatSection}>
                                    <input type="range" min="0" max="1" step="0.01" value={selectedBlock.opacity || 1}
                                        onChange={e => changeOpacity(selectedBlock.id, e.target.value)} className={styles.opacitySlider} />
                                    <span>{Math.round((selectedBlock.opacity || 1) * 100)}%</span>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className={styles.slideArea}>
                    <div
                        ref={slideRef}
                        className={styles.slideContainer}
                        style={{
                            background: slideProperties.backgroundImage
                                ? `rgba(${hexToRgb(slideProperties.backgroundColor)}, ${slideProperties.backgroundOpacity}) url(${slideProperties.backgroundImage}) center/cover no-repeat`
                                : `rgba(${hexToRgb(slideProperties.backgroundColor)}, ${slideProperties.backgroundOpacity})`,
                            cursor: isDragging ? 'grabbing' : (editingBlockId ? 'default' : 'pointer')
                        }}
                        onClick={() => { setSelectedBlock(null); setEditingBlockId(null); }}
                    >
                        {blocks.map(renderBlock)}
                    </div>
                </div>
            </div>

            {/* PROPERTIES PANEL */}
            {selectedBlock && (
                <div className={styles.propertiesPanel}>
                    <div className={styles.propertiesHeader}>خصائص العنصر</div>
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

            <MediaLibraryModal
                isOpen={showMediaLibrary}
                onClose={() => { setShowMediaLibrary(false); setMediaSelectionFor(null); }}
                onSelect={handleMediaSelect}
                mediaType={mediaSelectionFor === 'background' ? 'image' : selectedBlock?.type === 'image' ? 'image' : 'video'}
            />
        </div>
    );
};

// ====================== EditableContent ======================
const EditableContent = ({
    block,
    onUpdate,
    isEditing,
    onToggleEdit,
    onSelectBlock,
    onShowProperties,
    selectedBlock
}) => {
    const [localContent, setLocalContent] = useState(block.content || '');
    const textareaRef = useRef(null);

    useEffect(() => {
        setLocalContent(block.content || '');
    }, [block.content]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
            onShowProperties(block);
        }
    }, [isEditing, block, onShowProperties]);

    const handleSave = () => {
        if (localContent !== block.content) {
            onUpdate(block.id, localContent);
        }
        onToggleEdit();
        onShowProperties(block);
    };

    const handleCancel = () => {
        setLocalContent(block.content || '');
        onToggleEdit();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleChange = (e) => {
        setLocalContent(e.target.value);
        if (!selectedBlock || selectedBlock.id !== block.id) {
            onShowProperties(block);
        }
    };

    if (isEditing) {
        return (
            <div className={styles.editingContainer}>
                <textarea
                    ref={textareaRef}
                    value={localContent}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={styles.contentTextarea}
                    style={{
                        fontFamily: block.style?.fontFamily || 'inherit',
                        fontSize: block.style?.fontSize || '16px',
                        color: block.style?.color || '#000',
                        fontWeight: block.style?.fontWeight || 'normal',
                        fontStyle: block.style?.fontStyle || 'normal',
                        textDecoration: block.style?.textDecoration || 'none',
                        textAlign: block.style?.textAlign || 'right',
                        width: '100%',
                        height: '100%',
                        border: '2px solid #4299e1',
                        borderRadius: '6px',
                        padding: '10px',
                        background: 'white',
                        resize: 'none',
                        outline: 'none',
                        lineHeight: '1.6',
                        boxShadow: '0 0 10px rgba(66, 153, 225, 0.3)'
                    }}
                />
                <div className={styles.editingControls}>
                    <button className={styles.saveButton} onClick={handleSave}>حفظ</button>
                    <button className={styles.cancelButton} onClick={handleCancel}>إلغاء</button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={styles.contentDisplay}
            onClick={(e) => {
                e.stopPropagation();
                onSelectBlock(block);
                onToggleEdit();
                onShowProperties(block);
            }}
            style={{
                cursor: 'text',
                width: '100%',
                height: '100%',
                padding: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: block.style?.textAlign === 'right' ? 'flex-end' : block.style?.textAlign === 'center' ? 'center' : 'flex-start'
            }}
        >
            {block.content || 'انقر للكتابة...'}
        </div>
    );
};

export default SlideDesigner;