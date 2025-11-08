import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaLayerGroup, FaPalette } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getSlideBlocks } from "../../api/slideBlocks";
import { createSlide, deleteSlide, duplicateSlide, getSlides, updateSlideOrder } from "../../api/slides";
import Sidebar from "./components/Sidebar/Sidebar";
import SlideViewer from "./components/SlideViewer/SlideViewer";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import styles from "./EditorPage.module.css";

export default function EditorPage() {
    const { Id } = useParams();
    const navigate = useNavigate();
    const [slides, setSlides] = useState([]);
    const [selectedSlide, setSelectedSlide] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    useEffect(() => {
        if (!Id) return;
        loadSlides();
    }, [Id]);

    const loadSlides = () => {
        getSlides(Id).then((res) => {
            const sortedSlides = Array.isArray(res.data)
                ? res.data.sort((a, b) => a.order - b.order)
                : [];
            setSlides(sortedSlides);
        });
    };

    // تحميل الكتل عند اختيار شريحة
    useEffect(() => {
        if (selectedSlide) {
            getSlideBlocks(selectedSlide.id).then((res) =>
                setBlocks(Array.isArray(res.data) ? res.data : [])
            );
        }
    }, [selectedSlide]);

    // إنشاء شريحة جديدة
    const handleCreateSlide = async () => {
        try {
            const newSlide = {
                content: Id,
                title: `شريحة جديدة ${slides.length + 1}`,
                order: slides.length,
                background_color: "#FFFFFF",
                layout_style: "default",
            };
            const response = await createSlide(newSlide);
            if (response.data) {
                loadSlides();
                setSelectedSlide(response.data);
                navigate(`/slide/${response.data.id}/editor/`);

            }
        } catch (error) {
            console.error("Error creating slide:", error);
        }
    };

    // حذف شريحة
    const handleDeleteSlide = async (slideId) => {
        if (!window.confirm("هل أنت متأكد من حذف هذه الشريحة؟")) return;
        try {
            await deleteSlide(slideId);
            if (selectedSlide?.id === slideId) setSelectedSlide(null);
            loadSlides();
        } catch (error) {
            console.error("Error deleting slide:", error);
        }
    };




    const handleDuplicateSlide = async (slide) => {
        try {
            const response = await duplicateSlide(slide.id);
            if (response.data) {
                loadSlides();
                setSelectedSlide(response.data);
                navigate(`/slide/${response.data.id}/editor/`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // فتح المصمم (الانتقال إلى صفحة منفصلة)
    const openDesigner = (slide) => {
        navigate(`/slide/${slide.id}/editor/`);
    };


    // Drag & Drop
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("text/plain", index);
        setIsDragging(true);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = () => setDragOverIndex(null);

    const handleDrop = async (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
        if (sourceIndex === targetIndex) {
            setDragOverIndex(null);
            setIsDragging(false);
            return;
        }

        const reorderedSlides = [...slides];
        const [movedSlide] = reorderedSlides.splice(sourceIndex, 1);
        reorderedSlides.splice(targetIndex, 0, movedSlide);
        const updatedSlides = reorderedSlides.map((slide, index) => ({ ...slide, order: index }));

        setSlides(updatedSlides);
        setDragOverIndex(null);
        setIsDragging(false);

        try {
            await updateSlideOrder(updatedSlides);
        } catch (error) {
            console.error("Error updating slide order:", error);
            loadSlides();
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setDragOverIndex(null);
    };

    return (
        <div className={styles.editorContainer}>
            {/* الشريط الجانبي */}
            <Sidebar
                slides={slides}
                selectedSlide={selectedSlide}
                onSelectSlide={setSelectedSlide}
                onCreateSlide={handleCreateSlide}
                onDeleteSlide={handleDeleteSlide}
                onDuplicateSlide={handleDuplicateSlide}
                onEditSlide={openDesigner}
                loadSlides={loadSlides}
                dragHandlers={{
                    handleDragStart,
                    handleDragOver,
                    handleDragLeave,
                    handleDrop,
                    handleDragEnd,
                    dragOverIndex,
                    isDragging,
                }}

            />

            {/* المحتوى الرئيسي */}
            <div className={styles.mainContent}>
                {selectedSlide ? (
                    <div className={styles.viewer}>
                        {/* HEADER */}
                        <div className={styles.header}>
                            <div className={styles.info}>
                                <h1>{selectedSlide.title || "شريحة بدون عنوان"}</h1>
                                <div className={styles.meta}>
                                    <span className={styles.metaItem}>
                                        <FaLayerGroup size={14} /> {blocks.length} عنصر
                                    </span>
                                    <span className={styles.metaItem}>
                                        <FaPalette size={14} /> {selectedSlide.layout_style || "تصميم افتراضي"}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.secondaryBtn} onClick={() => window.print()}>
                                    <FaEye className={styles.btnIcon} /> معاينة
                                </button>
                                <button
                                    className={styles.primaryBtn}
                                    onClick={() => openDesigner(selectedSlide)}
                                >
                                    <FaEdit className={styles.btnIcon} /> فتح المصمم
                                </button>
                            </div>
                        </div>

                        {/* SLIDE VIEWER */}
                        <div className={styles.preview}>
                            <SlideViewer
                                slide={selectedSlide}
                                blocks={blocks}
                                onEdit={() => openDesigner(selectedSlide)}
                            />
                        </div>

                        {/* STATS */}
                        <div className={styles.stats}>
                            <div className={styles.card}>
                                <h4>العناصر</h4>
                                <span className={styles.number}>{blocks.length}</span>
                            </div>
                            <div className={styles.card}>
                                <h4>الخلفية</h4>
                                <span className={styles.value}>
                                    {selectedSlide.background_image ? "صورة" : "لون"}
                                </span>
                            </div>
                            <div className={styles.card}>
                                <h4>التصميم</h4>
                                <span className={styles.value}>
                                    {selectedSlide.layout_style || "قياسي"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <WelcomeScreen onCreateSlide={handleCreateSlide} />
                )}
            </div>
        </div>
    );
}