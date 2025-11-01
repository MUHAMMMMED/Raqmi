
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from './SlideDetails.module.css';

import {
    FaArrowLeft,
    FaImage,
    FaLayerGroup,
    FaPalette,
    FaPlus,
    FaSlidersH
} from 'react-icons/fa';
import { getLesson } from "../../../../api/lessons";

const SlideDetails = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlide, setSelectedSlide] = useState(null);

    useEffect(() => {
        loadData();
    }, [lessonId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [lessonData, slidesData] = await Promise.all([
                getLesson(lessonId),
                // getSlidesByLesson(lessonId)
            ]);
            setLesson(lessonData);
            setSlides(slidesData.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLayoutIcon = (layout) => {
        switch (layout) {
            case 'image_left':
                return <FaLayerGroup />;
            case 'image_right':
                return <FaLayerGroup />;
            case 'split_screen':
                return <FaSlidersH />;
            case 'full_image':
                return <FaImage />;
            default:
                return <FaLayerGroup />;
        }
    };

    const getLayoutText = (layout) => {
        const layoutNames = {
            'default': 'افتراضي',
            'title_content': 'عنوان ومحتوى',
            'image_left': 'صورة على اليسار',
            'image_right': 'صورة على اليمين',
            'split_screen': 'شاشة مقسمة',
            'full_image': 'صورة كاملة'
        };
        return layoutNames[layout] || layout;
    };

    const SlideItem = ({ slide, index }) => {
        return (
            <div
                className={styles.slideItem}
                onClick={() => setSelectedSlide(slide)}
            >
                <div className={styles.slideHeader}>
                    <div className={styles.slideNumber}>
                        <span>الشريحة {index + 1}</span>
                    </div>
                    <div className={styles.slideLayout}>
                        {getLayoutIcon(slide.layout_style)}
                        <span>{getLayoutText(slide.layout_style)}</span>
                    </div>
                </div>

                <div className={styles.slideContent}>
                    {slide.title && (
                        <h4 className={styles.slideTitle}>{slide.title}</h4>
                    )}

                    <div className={styles.slideProperties}>
                        <div className={styles.property}>
                            <FaPalette className={styles.propertyIcon} />
                            <span
                                className={styles.colorSample}
                                style={{ backgroundColor: slide.background_color }}
                            />
                            {slide.background_color}
                        </div>

                        {slide.background_image && (
                            <div className={styles.property}>
                                <FaImage className={styles.propertyIcon} />
                                <span>صورة خلفية</span>
                            </div>
                        )}

                        {slide.background_opacity < 1 && (
                            <div className={styles.property}>
                                <span>شفافية: {Math.round(slide.background_opacity * 100)}%</span>
                            </div>
                        )}
                    </div>
                </div>

                {slide.slide_viewer && (
                    <div className={styles.slidePreview}>
                        <img
                            src={slide.slide_viewer}
                            alt={`Preview of ${slide.title}`}
                            className={styles.previewImage}
                        />
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل الشرائح...</p>
            </div>
        );
    }

    return (
        <div className={styles.slideDetailsContainer}>
            {/* رأس الصفحة */}
            <div className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft />
                    رجوع
                </button>
                <div className={styles.headerContent}>
                    <FaLayerGroup className={styles.headerIcon} />
                    <div>
                        <h1>إدارة الشرائح</h1>
                        <p>{lesson?.title} - {slides.length} شريحة</p>
                    </div>
                </div>
                <button className={styles.addButton}>
                    <FaPlus />
                    إضافة شريحة
                </button>
            </div>

            {/* إحصائيات عامة */}
            <div className={styles.statsOverview}>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>{slides.length}</span>
                    <span className={styles.statLabel}>إجمالي الشرائح</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {slides.filter(slide => slide.background_image).length}
                    </span>
                    <span className={styles.statLabel}>شرائح بخلفيات</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {new Set(slides.map(slide => slide.layout_style)).size}
                    </span>
                    <span className={styles.statLabel}>نمط مختلف</span>
                </div>
            </div>

            {/* قائمة الشرائح */}
            <div className={styles.slidesGrid}>
                {slides.length > 0 ? (
                    slides.map((slide, index) => (
                        <SlideItem key={slide.id} slide={slide} index={index} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <FaLayerGroup className={styles.emptyIcon} />
                        <h3>لا توجد شرائح بعد</h3>
                        <p>ابدأ بإضافة أول شريحة عرض</p>
                        <button className={styles.addButton}>
                            <FaPlus />
                            إضافة شريحة جديدة
                        </button>
                    </div>
                )}
            </div>

            {/* نافذة عرض تفاصيل الشريحة */}
            {selectedSlide && (
                <div className={styles.slideModal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>تفاصيل الشريحة</h2>
                            <button
                                className={styles.closeButton}
                                onClick={() => setSelectedSlide(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.detailGrid}>
                                <div className={styles.detailItem}>
                                    <label>العنوان:</label>
                                    <span>{selectedSlide.title || "لا يوجد عنوان"}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>الترتيب:</label>
                                    <span>{selectedSlide.order + 1}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>نمط التخطيط:</label>
                                    <span>{getLayoutText(selectedSlide.layout_style)}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>لون الخلفية:</label>
                                    <div className={styles.colorDetail}>
                                        <span
                                            className={styles.colorBox}
                                            style={{ backgroundColor: selectedSlide.background_color }}
                                        />
                                        {selectedSlide.background_color}
                                    </div>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>شفافية الخلفية:</label>
                                    <span>{Math.round(selectedSlide.background_opacity * 100)}%</span>
                                </div>
                            </div>

                            {selectedSlide.slide_viewer && (
                                <div className={styles.previewSection}>
                                    <h3>معاينة الشريحة:</h3>
                                    <img
                                        src={selectedSlide.slide_viewer}
                                        alt="Slide preview"
                                        className={styles.fullPreview}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className={styles.modalOverlay}
                        onClick={() => setSelectedSlide(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default SlideDetails;