import React from "react";
import { FaCopy, FaEdit, FaTrash } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import styles from "./SlideThumbnail.module.css";

export default function SlideThumbnail({
    slide,
    index,
    isSelected,
    onSelect,
    onDelete,
    onDuplicate,
    onEdit,
    dragHandlers,
}) {
    const { handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd, dragOverIndex } = dragHandlers;
    const slideBlocks = slide.blocks || [];

    return (
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
                <span className={styles.number}>{index + 1}</span>
                <div className={styles.actions}>
                    <button className={styles.btn} onClick={(e) => { e.stopPropagation(); onEdit(slide); }} title="تحرير">
                        <FaEdit size={12} />
                    </button>
                    <button className={styles.btn} onClick={(e) => { e.stopPropagation(); onDuplicate(slide); }} title="نسخ">
                        <FaCopy size={12} />
                    </button>
                    <button className={`${styles.btn} ${styles.danger}`} onClick={(e) => { e.stopPropagation(); onDelete(slide.id); }} title="حذف">
                        <FaTrash size={12} />
                    </button>
                </div>
            </div>

            {/* معاينة الشريحة باستخدام صورة slide_viewer */}
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
                <span className={styles.title}>{slide.title || `شريحة ${index + 1}`}</span>
                <span className={styles.count}>{slideBlocks.length} عناصر</span>
            </div>
        </div>
    );
}