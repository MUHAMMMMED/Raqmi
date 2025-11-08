import React, { useEffect, useState } from "react";
import { updateSlide } from "../../../../../../api/slides";
import styles from "./SlideEditModal.module.css";

export default function SlideEditModal({ slide, isOpen, onClose, onSave, loadSlides }) {
    const [formData, setFormData] = useState({
        title: "",
        layout_style: "default",
    });

    const LAYOUT_CHOICES = [
        { value: "default", label: "Default" },
        { value: "title_content", label: "Title and Content" },
        { value: "image_left", label: "Image Left" },
        { value: "image_right", label: "Image Right" },
        { value: "split_screen", label: "Split Screen" },
        { value: "full_image", label: "Full Image" },
    ];

    useEffect(() => {
        if (slide) {
            setFormData({
                title: slide.title || "",
                layout_style: slide.layout_style || "default",
            });
        }
    }, [slide]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (slide) {
                await updateSlide(slide.id, formData);
            }
            if (onSave) onSave(formData);
            loadSlides();
            onClose();

        } catch (error) {
            console.error("Error updating slide:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>تحرير الشريحة</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.label}>عنوان الشريحة</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="أدخل عنوان الشريحة"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="layout_style" className={styles.label}>نمط التخطيط</label>
                        <select
                            id="layout_style"
                            name="layout_style"
                            value={formData.layout_style}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            {LAYOUT_CHOICES.map((choice) => (
                                <option key={choice.value} value={choice.value}>
                                    {choice.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.previewSection}>
                        <h3>معاينة النمط المختار</h3>
                        <div className={`${styles.layoutPreview} ${styles[formData.layout_style]}`}>
                            <div className={styles.previewTitle}>
                                {formData.title || "عنوان الشريحة"}
                            </div>
                            <div className={styles.previewContent}>
                                {renderLayoutPreview(formData.layout_style)}
                            </div>
                        </div>
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            إلغاء
                        </button>
                        <button type="submit" className={styles.saveButton}>
                            حفظ التغييرات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// دالة مساعدة لعرض معاينة التخطيط
function renderLayoutPreview(layoutStyle) {
    switch (layoutStyle) {
        case "title_content":
            return (
                <>
                    <div className={styles.previewTitleArea}>عنوان</div>
                    <div className={styles.previewContentArea}>محتوى</div>
                </>
            );
        case "image_left":
            return (
                <>
                    <div className={styles.previewImageArea}>صورة</div>
                    <div className={styles.previewTextArea}>نص</div>
                </>
            );
        case "image_right":
            return (
                <>
                    <div className={styles.previewTextArea}>نص</div>
                    <div className={styles.previewImageArea}>صورة</div>
                </>
            );
        case "split_screen":
            return (
                <>
                    <div className={styles.previewSplitLeft}>يسار</div>
                    <div className={styles.previewSplitRight}>يمين</div>
                </>
            );
        case "full_image":
            return <div className={styles.previewFullImage}>صورة كاملة</div>;
        default:
            return <div className={styles.previewDefault}>محتوى افتراضي</div>;
    }
}