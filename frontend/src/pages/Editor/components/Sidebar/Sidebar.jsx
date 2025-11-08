import React from "react";
import { FaArrowLeft, FaLayerGroup, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
    loadSlides,
}) {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // العودة للصفحة السابقة
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <button
                        className={styles.backButton}
                        onClick={handleGoBack}
                        title="العودة للصفحة السابقة"
                    >
                        <FaArrowLeft className={styles.backIcon} />
                    </button>
                    <div className={styles.headerInfo}>
                        <FaLayerGroup className={styles.icon} />
                        <div>
                            <h2>شرائح الدرس</h2>
                            <span className={styles.count}>{slides.length} شريحة</span>
                        </div>
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
                        loadSlides={loadSlides}
                    />
                ))}
                {slides.length === 0 && <EmptySlides onCreateSlide={onCreateSlide} />}
            </div>
        </div>
    );
}