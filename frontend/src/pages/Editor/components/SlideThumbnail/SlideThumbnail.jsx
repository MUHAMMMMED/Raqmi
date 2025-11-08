
import React, { useState } from "react";
import { FaCopy, FaEdit, FaTrash } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import styles from "./SlideThumbnail.module.css";
import SlideEditModal from "./components/SlideEditModal/SlideEditModal";

export default function SlideThumbnail({
    slide,
    index,
    isSelected,
    onSelect,
    onDelete,
    onDuplicate,
    onUpdate,
    dragHandlers,
    loadSlides,
}) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd, dragOverIndex } = dragHandlers;
    const slideBlocks = slide.blocks || [];

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleSave = async (updatedData) => {
        if (onUpdate) {
            await onUpdate(slide.id, updatedData);

        }

        setIsEditModalOpen(false);
    };

    return (
        <>
            <div
                className={`${styles.thumbnail} ${isSelected ? styles.selected : ""} ${dragOverIndex === index ? styles.dragOver : ""
                    }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelect(slide)}
            >
                <div className={styles.header}>
                    <div className={styles.dragHandle}>
                        <MdDragIndicator />
                    </div>
                    <span className={styles.title}>{slide.title || `شريحة ${index + 1}`}</span>
                    <div className={styles.actions}>
                        <button
                            className={styles.btn}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit();
                            }}
                            title="تحرير"
                        >
                            <FaEdit size={12} />
                        </button>
                        <button
                            className={styles.btn}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDuplicate(slide);
                            }}
                            title="نسخ"
                        >
                            <FaCopy size={12} />
                        </button>
                        <button
                            className={`${styles.btn} ${styles.danger}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(slide.id);
                            }}
                            title="حذف"
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                </div>

                <div className={styles.preview}>
                    {slide.slide_viewer ? (
                        <img
                            src={slide.slide_viewer}
                            alt={`معاينة ${slide.title || `شريحة ${index + 1}`}`}
                            className={styles.previewImage}
                        />
                    ) : (
                        <div className={styles.previewPlaceholder}>
                            <span>لا توجد معاينة</span>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>

                    <span className={styles.layoutBadge}>{getLayoutLabel(slide.layout_style)}</span>
                    <span className={styles.count}>{slideBlocks.length} عناصر</span>
                </div>
            </div>

            <SlideEditModal
                slide={slide}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
                loadSlides={loadSlides}
            />
        </>
    );
}

// دالة مساعدة للحصول على تسمية نمط التخطيط
function getLayoutLabel(layoutStyle) {
    const layoutLabels = {
        'default': 'افتراضي',
        'title_content': 'عنوان ومحتوى',
        'image_left': 'صورة يسار',
        'image_right': 'صورة يمين',
        'split_screen': 'شاشة مقسمة',
        'full_image': 'صورة كاملة'
    };
    return layoutLabels[layoutStyle] || layoutStyle;
}