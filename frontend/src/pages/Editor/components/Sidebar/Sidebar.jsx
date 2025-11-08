import React from "react";
import { FaLayerGroup, FaPlus } from "react-icons/fa";
import EmptySlides from "../EmptySlides/EmptySlides";
import SlideThumbnail from "../SlideThumbnail/SlideThumbnail";
import styles from "./Sidebar.module.css";

export default function Sidebar({
    slides,
    selectedSlide,
    onSelectSlide,
    onCreateSlide,
    onDeleteSlide,
    onDuplicateSlide,
    onEditSlide,
    dragHandlers,
}) {
    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <FaLayerGroup className={styles.icon} />
                    <div>
                        <h2>شرائح الدرس</h2>
                        <span className={styles.count}>{slides.length} شريحة</span>
                    </div>
                </div>
                <button className={styles.createBtn} onClick={onCreateSlide}>
                    <FaPlus className={styles.btnIcon} />
                    شريحة جديدة
                </button>
            </div>

            <div className={styles.slidesList}>
                {slides.map((slide, index) => (
                    <SlideThumbnail
                        key={slide.id}
                        slide={slide}
                        index={index}
                        isSelected={selectedSlide?.id === slide.id}
                        onSelect={onSelectSlide}
                        onDelete={onDeleteSlide}
                        onDuplicate={onDuplicateSlide}
                        onEdit={onEditSlide}
                        dragHandlers={dragHandlers}
                    />
                ))}
                {slides.length === 0 && <EmptySlides onCreateSlide={onCreateSlide} />}
            </div>
        </div>
    );
}