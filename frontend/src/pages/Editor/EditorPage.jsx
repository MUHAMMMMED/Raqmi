import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSlide, deleteSlide, getSlides, updateSlideOrder } from "../../api/slides";
import styles from './EditorPage.module.css';

import {
    FaCopy,
    FaEdit,
    FaEye,
    FaLayerGroup,
    FaPalette,
    FaPlus,
    FaTrash
} from 'react-icons/fa';
import { MdDragIndicator } from 'react-icons/md';
import { getBlocks } from "../../api/blocks";
import SlideDesigner from "./components/SlideDesigner/SlideDesigner";

export default function EditorPage() {
    const { lessonId } = useParams();
    const [slides, setSlides] = useState([]);
    const [selectedSlide, setSelectedSlide] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [designMode, setDesignMode] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    useEffect(() => {
        if (!lessonId) return;
        loadSlides();
    }, [lessonId]);

    const loadSlides = () => {
        getSlides(lessonId).then((res) => {
            const sortedSlides = Array.isArray(res.data)
                ? res.data.sort((a, b) => a.order - b.order)
                : [];
            setSlides(sortedSlides);
        });
    };

    useEffect(() => {
        if (selectedSlide) {
            getBlocks(selectedSlide.id).then((res) =>
                setBlocks(Array.isArray(res.data) ? res.data : [])
            );
        }
    }, [selectedSlide]);

    const handleSaveDesign = async (slideData) => {
        try {
            console.log('Saving slide design:', slideData);
            setSelectedSlide(slideData);
            setSlides(prev => prev.map(s => s.id === slideData.id ? slideData : s));
            setDesignMode(false);
            loadSlides();
        } catch (error) {
            console.error('Error saving design:', error);
        }
    };

    const handleCreateSlide = async () => {
        try {
            const newSlide = {
                lesson: lessonId,
                title: `شريحة جديدة ${slides.length + 1}`,
                order: slides.length,
                background_color: '#FFFFFF',
                layout_style: 'default'
            };

            const response = await createSlide(newSlide);
            if (response.data) {
                loadSlides();
                setSelectedSlide(response.data);
            }
        } catch (error) {
            console.error('Error creating slide:', error);
        }
    };

    const handleDeleteSlide = async (slideId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه الشريحة؟')) return;

        try {
            await deleteSlide(slideId);
            if (selectedSlide?.id === slideId) {
                setSelectedSlide(null);
            }
            loadSlides();
        } catch (error) {
            console.error('Error deleting slide:', error);
        }
    };

    const handleDuplicateSlide = async (slide) => {
        try {
            const duplicatedSlide = {
                ...slide,
                title: `${slide.title} (نسخة)`,
                order: slides.length,
                id: undefined
            };

            const response = await createSlide(duplicatedSlide);
            if (response.data) {
                loadSlides();
                setSelectedSlide(response.data);
            }
        } catch (error) {
            console.error('Error duplicating slide:', error);
        }
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
        setIsDragging(true);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = async (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));

        if (sourceIndex === targetIndex) {
            setDragOverIndex(null);
            setIsDragging(false);
            return;
        }

        const reorderedSlides = [...slides];
        const [movedSlide] = reorderedSlides.splice(sourceIndex, 1);
        reorderedSlides.splice(targetIndex, 0, movedSlide);

        // تحديث الـ order بناءً على الموضع الجديد
        const updatedSlides = reorderedSlides.map((slide, index) => ({
            ...slide,
            order: index
        }));

        setSlides(updatedSlides);
        setDragOverIndex(null);
        setIsDragging(false);

        // تحديث الـ order في الخادم
        try {
            await updateSlideOrder(updatedSlides);
        } catch (error) {
            console.error('Error updating slide order:', error);
            loadSlides(); // إعادة التحميل في حالة الخطأ
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setDragOverIndex(null);
    };

    const SlideThumbnail = ({ slide, index, isSelected, onSelect, onDelete, onDuplicate, onEdit }) => {
        const slideBlocks = slide.blocks || [];

        return (
            <div
                className={`${styles.slideThumbnail} ${isSelected ? styles.selected : ''} ${dragOverIndex === index ? styles.dragOver : ''
                    }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelect(slide)}
            >
                <div className={styles.thumbnailHeader}>
                    <div className={styles.dragHandle}>
                        <MdDragIndicator />
                    </div>
                    <span className={styles.slideNumber}>{index + 1}</span>
                    <div className={styles.thumbnailActions}>
                        <button
                            className={styles.iconButton}
                            onClick={(e) => { e.stopPropagation(); onEdit(slide); }}
                            title="تحرير التصميم"
                        >
                            <FaEdit size={12} />
                        </button>
                        <button
                            className={styles.iconButton}
                            onClick={(e) => { e.stopPropagation(); onDuplicate(slide); }}
                            title="نسخ الشريحة"
                        >
                            <FaCopy size={12} />
                        </button>
                        <button
                            className={`${styles.iconButton} ${styles.danger}`}
                            onClick={(e) => { e.stopPropagation(); onDelete(slide.id); }}
                            title="حذف الشريحة"
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                </div>

                <div
                    className={styles.thumbnailPreview}
                    style={{
                        backgroundColor: slide.background_color || '#FFFFFF',
                        backgroundImage: slide.background_image ? `url(${slide.background_image})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {slideBlocks.slice(0, 3).map((block, blockIndex) => {
                        const extra = typeof block.extra === 'string' ? JSON.parse(block.extra) : (block.extra || {});
                        const position = extra.position || { x: 10, y: 10 + blockIndex * 20 };
                        const size = extra.size || { width: 80, height: 15 };

                        return (
                            <div
                                key={blockIndex}
                                className={styles.thumbnailBlock}
                                style={{
                                    left: `${position.x / 4}%`,
                                    top: `${position.y / 4}%`,
                                    width: `${size.width / 4}%`,
                                    height: `${size.height / 4}%`,
                                    backgroundColor: block.type === 'title' ? '#4299e1' :
                                        block.type === 'text' ? '#48bb78' :
                                            block.type === 'image' ? '#ed8936' : '#9f7aea'
                                }}
                            />
                        );
                    })}
                </div>

                <div className={styles.thumbnailFooter}>
                    <span className={styles.slideTitle}>
                        {slide.title || `شريحة ${index + 1}`}
                    </span>
                    <span className={styles.elementsCount}>
                        {slideBlocks.length} عناصر
                    </span>
                </div>
            </div>
        );
    };

    if (designMode) {
        return (
            <SlideDesigner
                slide={selectedSlide}
                onSave={handleSaveDesign}
                onCancel={() => setDesignMode(false)}
            />
        );
    }

    return (
        <div className={styles.editorContainer}>
            {/* الشريط الجانبي */}
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.headerInfo}>
                        <FaLayerGroup className={styles.headerIcon} />
                        <div>
                            <h2>شرائح الدرس</h2>
                            <span className={styles.slidesCount}>{slides.length} شريحة</span>
                        </div>
                    </div>

                    <button
                        className={styles.createButton}
                        onClick={handleCreateSlide}
                    >
                        <FaPlus className={styles.buttonIcon} />
                        شريحة جديدة
                    </button>
                </div>

                <div className={styles.slidesContainer}>
                    {slides.map((slide, index) => (
                        <SlideThumbnail
                            key={slide.id}
                            slide={slide}
                            index={index}
                            isSelected={selectedSlide?.id === slide.id}
                            onSelect={setSelectedSlide}
                            onDelete={handleDeleteSlide}
                            onDuplicate={handleDuplicateSlide}
                            onEdit={(slide) => {
                                setSelectedSlide(slide);
                                setDesignMode(true);
                            }}
                        />
                    ))}

                    {slides.length === 0 && (
                        <div className={styles.emptyState}>
                            <FaPalette className={styles.emptyIcon} />
                            <h3>لا توجد شرائح</h3>
                            <p>أنشئ شريحة جديدة للبدء</p>
                            <button
                                className={styles.createButton}
                                onClick={handleCreateSlide}
                            >
                                <FaPlus className={styles.buttonIcon} />
                                إنشاء الشريحة الأولى
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* منطقة المحتوى الرئيسية */}
            <div className={styles.mainContent}>
                {selectedSlide ? (
                    <div className={styles.slideViewer}>
                        <div className={styles.viewerHeader}>
                            <div className={styles.slideInfo}>
                                <h1>{selectedSlide.title || "شريحة بدون عنوان"}</h1>
                                <div className={styles.slideMeta}>
                                    <span className={styles.metaItem}>
                                        <FaLayerGroup size={14} />
                                        {blocks.length} عنصر
                                    </span>
                                    <span className={styles.metaItem}>
                                        <FaPalette size={14} />
                                        {selectedSlide.layout_style || 'تصميم افتراضي'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.viewerActions}>
                                <button
                                    className={styles.secondaryButton}
                                    onClick={() => window.print()}
                                >
                                    <FaEye className={styles.buttonIcon} />
                                    معاينة
                                </button>
                                <button
                                    className={styles.primaryButton}
                                    onClick={() => setDesignMode(true)}
                                >
                                    <FaEdit className={styles.buttonIcon} />
                                    فتح المصمم
                                </button>
                            </div>
                        </div>

                        <div className={styles.slidePreview}>
                            <div
                                className={styles.previewContainer}
                                style={{
                                    backgroundColor: selectedSlide.background_color || '#FFFFFF',
                                    backgroundImage: selectedSlide.background_image ? `url(${selectedSlide.background_image})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {blocks.map((block, index) => {
                                    const extra = typeof block.extra === 'string' ? JSON.parse(block.extra) : (block.extra || {});
                                    const position = extra.position || { x: 50, y: 50 };
                                    const size = extra.size || { width: 200, height: 100 };
                                    const style = extra.style || {};

                                    return (
                                        <div
                                            key={block.id}
                                            className={styles.previewBlock}
                                            style={{
                                                left: `${position.x}px`,
                                                top: `${position.y}px`,
                                                width: `${size.width}px`,
                                                height: `${size.height}px`,
                                                fontFamily: style.fontFamily,
                                                fontSize: style.fontSize,
                                                color: style.color,
                                                fontWeight: style.fontWeight,
                                                textAlign: style.textAlign,
                                                backgroundColor: style.backgroundColor
                                            }}
                                        >
                                            {block.type === 'image' && block.media ? (
                                                <img src={block.media} alt="Block" />
                                            ) : block.type === 'title' ? (
                                                <h3>{block.content}</h3>
                                            ) : block.type === 'text' ? (
                                                <p>{block.content}</p>
                                            ) : block.type === 'bullet_points' ? (
                                                <ul>
                                                    {block.content?.split('\n').map((point, i) => (
                                                        <li key={i}>{point.replace('•', '').trim()}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div>{block.content}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.slideStats}>
                            <div className={styles.statCard}>
                                <h4>العناصر</h4>
                                <span className={styles.statNumber}>{blocks.length}</span>
                            </div>
                            <div className={styles.statCard}>
                                <h4>الخلفية</h4>
                                <span className={styles.statValue}>
                                    {selectedSlide.background_image ? 'صورة' : 'لون'}
                                </span>
                            </div>
                            <div className={styles.statCard}>
                                <h4>التصميم</h4>
                                <span className={styles.statValue}>
                                    {selectedSlide.layout_style || 'قياسي'}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.welcomeScreen}>
                        <div className={styles.welcomeContent}>
                            <FaPalette className={styles.welcomeIcon} />
                            <h1>مرحباً في مصمم الشرائح</h1>
                            <p>اختر شريحة من القائمة الجانبية لبدء التصميم، أو أنشئ شريحة جديدة</p>
                            <div className={styles.welcomeActions}>
                                <button
                                    className={styles.primaryButton}
                                    onClick={handleCreateSlide}
                                >
                                    <FaPlus className={styles.buttonIcon} />
                                    إنشاء شريحة جديدة
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


// # في القوائم أو المعاينات
// {% for slide in lesson.slides.all %}
//     {% if slide.slide_preview_url %}
//     <img src="{{ slide.slide_preview_url }}" alt="{{ slide.title }}" class="slide-preview">
//     {% endif %}
// {% endfor %}