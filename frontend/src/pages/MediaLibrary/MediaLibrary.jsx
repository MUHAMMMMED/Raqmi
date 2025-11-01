import React, { useEffect, useState } from "react";
import {
    FaCheck,
    FaFile,
    FaFilter,
    FaImage,
    FaMusic,
    FaPlay,
    FaPlus,
    FaSearch,
    FaTimes,
    FaUpload,
    FaVideo
} from "react-icons/fa";
import { getMedia, uploadMedia } from "../../api/mediaLibrary";
import styles from "./MediaLibrary.module.css";

const MediaLibrary = () => {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [previewMedia, setPreviewMedia] = useState(null);
    const [uploadForm, setUploadForm] = useState({
        file: null,
        name: "",
        title: "",
        description: "",
        tags: "",
        media_type: ""
    });

    const MEDIA_TYPES = [
        { value: "", label: "جميع الملفات", icon: FaFilter },
        { value: "image", label: "الصور", icon: FaImage },
        { value: "video", label: "الفيديوهات", icon: FaVideo },
        { value: "audio", label: "الصوتيات", icon: FaMusic },
        { value: "document", label: "المستندات", icon: FaFile },
    ];

    const UPLOAD_TYPES = [
        { value: "image", label: "صورة", icon: FaImage, accept: "image/*" },
        { value: "video", label: "فيديو", icon: FaVideo, accept: "video/*" },
        { value: "audio", label: "صوت", icon: FaMusic, accept: "audio/*" },
        { value: "document", label: "مستند", icon: FaFile, accept: ".pdf,.doc,.docx,.txt" },
    ];

    useEffect(() => {
        loadMedia();
    }, [selectedType, searchQuery, currentPage]);

    const loadMedia = async () => {
        setLoading(true);
        try {
            const params = {
                type: selectedType,
                search: searchQuery,
                page: currentPage,
                per_page: 20,
            };

            const { data } = await getMedia(params);

            if (Array.isArray(data)) {
                setMediaItems(data);
                setTotalPages(1);
            } else if (data.results) {
                setMediaItems(data.results);
                setTotalPages(data.total_pages || 1);
            } else if (data.media) {
                setMediaItems(data.media);
                setTotalPages(data.total_pages || 1);
            } else {
                setMediaItems([]);
            }
        } catch (error) {
            console.error("Error loading media:", error);
            setMediaItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadForm.file || !uploadForm.media_type) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", uploadForm.file);
            formData.append("name", uploadForm.name || uploadForm.file.name);
            formData.append("media_type", uploadForm.media_type);
            formData.append("title", uploadForm.title);
            formData.append("description", uploadForm.description);
            formData.append("tags", uploadForm.tags);

            await uploadMedia(formData);
            setUploadForm({
                file: null,
                name: "",
                title: "",
                description: "",
                tags: "",
                media_type: ""
            });
            setShowUploadForm(false);
            loadMedia();
        } catch (error) {
            console.error("Error uploading media:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e, mediaType = "") => {
        const file = e.target.files[0];
        if (file) {
            // التحقق من نوع الملف
            const fileType = mediaType || getFileType(file);
            if (!validateFileType(file, fileType)) {
                alert(`الملف غير مدعوم. الرجاء اختيار ملف من النوع: ${fileType}`);
                return;
            }

            setUploadForm((prev) => ({
                ...prev,
                file,
                name: file.name,
                media_type: fileType
            }));
        }
    };

    const getFileType = (file) => {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        if (file.type.startsWith('audio/')) return 'audio';
        return 'document';
    };

    const validateFileType = (file, expectedType) => {
        const fileName = file.name.toLowerCase();

        switch (expectedType) {
            case 'image':
                return file.type.startsWith('image/') ||
                    fileName.endsWith('.jpg') ||
                    fileName.endsWith('.jpeg') ||
                    fileName.endsWith('.png') ||
                    fileName.endsWith('.gif') ||
                    fileName.endsWith('.webp');

            case 'video':
                return file.type.startsWith('video/') ||
                    fileName.endsWith('.mp4') ||
                    fileName.endsWith('.avi') ||
                    fileName.endsWith('.mov') ||
                    fileName.endsWith('.webm');

            case 'audio':
                return file.type.startsWith('audio/') ||
                    fileName.endsWith('.mp3') ||
                    fileName.endsWith('.wav') ||
                    fileName.endsWith('.ogg') ||
                    fileName.endsWith('.m4a') ||
                    fileName.endsWith('.aac');

            case 'document':
                return fileName.endsWith('.pdf') ||
                    fileName.endsWith('.doc') ||
                    fileName.endsWith('.docx') ||
                    fileName.endsWith('.txt');

            default:
                return true;
        }
    };

    const handleSelectMedia = (mediaItem, e) => {
        e.stopPropagation();
        setSelectedMedia(prev => {
            const isSelected = prev.some(item => item.id === mediaItem.id);
            if (isSelected) {
                return prev.filter(item => item.id !== mediaItem.id);
            } else {
                return [...prev, mediaItem];
            }
        });
    };

    const handlePreviewMedia = (mediaItem, e) => {
        e.stopPropagation();
        setPreviewMedia(mediaItem);
    };

    const isMediaSelected = (mediaItem) => {
        return selectedMedia.some(item => item.id === mediaItem.id);
    };

    const getSelectedCount = () => {
        return selectedMedia.length;
    };

    const handleBulkAction = (action) => {
        if (action === 'delete') {
            if (window.confirm(`هل تريد حذف ${getSelectedCount()} ملف؟`)) {
                console.log('Deleting selected media:', selectedMedia);
                // إضافة منطق الحذف هنا
            }
        } else if (action === 'download') {
            console.log('Downloading selected media:', selectedMedia);
            // إضافة منطق التحميل هنا
        }
    };

    const renderMediaPreview = (item) => {
        switch (item.media_type) {
            case "image":
                return (
                    <div className={styles.mediaPreviewContent}>
                        <img
                            src={item.file_url}
                            alt={item.title || item.name}
                            loading="lazy"
                        />
                        <div className={styles.previewOverlay} onClick={(e) => handlePreviewMedia(item, e)}>
                            <FaPlay className={styles.previewIcon} />
                            <span>معاينة الصورة</span>
                        </div>
                    </div>
                );
            case "video":
                return (
                    <div className={styles.mediaPreviewContent}>
                        <div className={styles.videoPlaceholder}>
                            <FaVideo size={32} />
                            <span>فيديو</span>
                        </div>
                        <div className={styles.previewOverlay} onClick={(e) => handlePreviewMedia(item, e)}>
                            <FaPlay className={styles.previewIcon} />
                            <span>تشغيل الفيديو</span>
                        </div>
                    </div>
                );
            case "audio":
                return (
                    <div className={styles.mediaPreviewContent}>
                        <div className={styles.audioPlaceholder}>
                            <FaMusic size={32} />
                            <span>صوت</span>
                        </div>
                        <div className={styles.previewOverlay} onClick={(e) => handlePreviewMedia(item, e)}>
                            <FaPlay className={styles.previewIcon} />
                            <span>تشغيل الصوت</span>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className={styles.mediaPreviewContent}>
                        <div className={styles.documentPlaceholder}>
                            <FaFile size={32} />
                            <span>مستند</span>
                        </div>
                        <div className={styles.previewOverlay} onClick={(e) => handlePreviewMedia(item, e)}>
                            <span>فتح المستند</span>
                        </div>
                    </div>
                );
        }
    };

    // تصفية الوسائط حسب النوع المحدد
    const filteredMediaItems = selectedType
        ? mediaItems.filter(item => item.media_type === selectedType)
        : mediaItems;

    return (
        <div className={styles.mediaLibrary}>
            {/* رأس الصفحة */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.titleSection}>
                        <FaImage className={styles.headerIcon} />
                        <div>
                            <h1>مكتبة الوسائط</h1>
                            <p>إدارة جميع ملفات الوسائط الخاصة بك في مكان واحد</p>
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            className={styles.uploadToggleButton}
                            onClick={() => setShowUploadForm(!showUploadForm)}
                        >
                            <FaPlus />
                            رفع ملف جديد
                        </button>
                    </div>
                </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className={styles.statsOverview}>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>{mediaItems.length}</span>
                    <span className={styles.statLabel}>إجمالي الملفات</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {mediaItems.filter(item => item.media_type === 'image').length}
                    </span>
                    <span className={styles.statLabel}>صور</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {mediaItems.filter(item => item.media_type === 'video').length}
                    </span>
                    <span className={styles.statLabel}>فيديوهات</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>
                        {mediaItems.filter(item => item.media_type === 'audio').length}
                    </span>
                    <span className={styles.statLabel}>ملفات صوتية</span>
                </div>
            </div>

            {/* 🔍 الفلاتر والبحث */}
            <div className={styles.filtersSection}>
                <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="ابحث في الوسائط..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.typeFilters}>
                    {MEDIA_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.value}
                                className={`${styles.typeButton} ${selectedType === type.value ? styles.active : ""}`}
                                onClick={() => setSelectedType(type.value)}
                            >
                                <Icon />
                                {type.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 📤 نموذج الرفع */}
            {showUploadForm && (
                <div className={styles.uploadSection}>
                    <div className={styles.uploadHeader}>
                        <h3>رفع ملف جديد</h3>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowUploadForm(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>
                    <form onSubmit={handleUpload} className={styles.uploadForm}>
                        {/* اختيار نوع الملف أولاً */}
                        <div className={styles.uploadTypeSelection}>
                            <h4>اختر نوع الملف:</h4>
                            <div className={styles.uploadTypeGrid}>
                                {UPLOAD_TYPES.map((type) => (
                                    <label key={type.value} className={styles.uploadTypeOption}>
                                        <input
                                            type="radio"
                                            name="media_type"
                                            value={type.value}
                                            checked={uploadForm.media_type === type.value}
                                            onChange={(e) => setUploadForm(prev => ({
                                                ...prev,
                                                media_type: e.target.value,
                                                file: null
                                            }))}
                                            className={styles.radioInput}
                                        />
                                        <div className={styles.uploadTypeContent}>
                                            <type.icon className={styles.uploadTypeIcon} />
                                            <span>{type.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {uploadForm.media_type && (
                            <div className={styles.uploadGrid}>
                                <div className={styles.formGroup}>
                                    <label>رفع ملف {UPLOAD_TYPES.find(t => t.value === uploadForm.media_type)?.label} *</label>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileSelect(e, uploadForm.media_type)}
                                        className={styles.fileInput}
                                        accept={UPLOAD_TYPES.find(t => t.value === uploadForm.media_type)?.accept}
                                        required
                                    />
                                    <small className={styles.fileHint}>
                                        {uploadForm.media_type === 'image' && 'الامتدادات المدعومة: JPG, PNG, GIF, WEBP'}
                                        {uploadForm.media_type === 'video' && 'الامتدادات المدعومة: MP4, AVI, MOV, WEBM'}
                                        {uploadForm.media_type === 'audio' && 'الامتدادات المدعومة: MP3, WAV, OGG, M4A, AAC'}
                                        {uploadForm.media_type === 'document' && 'الامتدادات المدعومة: PDF, DOC, DOCX, TXT'}
                                    </small>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>اسم الملف</label>
                                    <input
                                        type="text"
                                        placeholder="اسم الملف..."
                                        value={uploadForm.name}
                                        onChange={(e) =>
                                            setUploadForm((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        className={styles.textInput}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>عنوان (اختياري)</label>
                                    <input
                                        type="text"
                                        placeholder="عنوان الملف..."
                                        value={uploadForm.title}
                                        onChange={(e) =>
                                            setUploadForm((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                        className={styles.textInput}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>وصف (اختياري)</label>
                                    <textarea
                                        placeholder="وصف الملف..."
                                        value={uploadForm.description}
                                        onChange={(e) =>
                                            setUploadForm((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        className={styles.textareaInput}
                                        rows="3"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>كلمات دلالية (اختياري)</label>
                                    <input
                                        type="text"
                                        placeholder="كلمات دلالية مفصولة بفواصل..."
                                        value={uploadForm.tags}
                                        onChange={(e) =>
                                            setUploadForm((prev) => ({
                                                ...prev,
                                                tags: e.target.value,
                                            }))
                                        }
                                        className={styles.textInput}
                                    />
                                </div>
                            </div>
                        )}

                        <div className={styles.uploadActions}>
                            <button
                                type="button"
                                onClick={() => setShowUploadForm(false)}
                                className={styles.cancelButton}
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={!uploadForm.file || !uploadForm.media_type || uploading}
                                className={styles.uploadButton}
                            >
                                <FaUpload />
                                {uploading ? "جاري الرفع..." : "رفع الملف"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 🖼️ شبكة الوسائط */}
            <div className={styles.mediaGridSection}>
                <div className={styles.sectionHeader}>
                    <h3>
                        {selectedType
                            ? `${MEDIA_TYPES.find(t => t.value === selectedType)?.label} (${filteredMediaItems.length})`
                            : `جميع الوسائط (${filteredMediaItems.length})`
                        }
                    </h3>
                    {getSelectedCount() > 0 && (
                        <div className={styles.bulkActions}>
                            <span>{getSelectedCount()} ملف محدد</span>
                            <button
                                className={styles.bulkButton}
                                onClick={() => handleBulkAction('delete')}
                            >
                                حذف المحدد
                            </button>
                            <button
                                className={styles.bulkButton}
                                onClick={() => handleBulkAction('download')}
                            >
                                تحميل المحدد
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.loadingSpinner}></div>
                        <p>جاري تحميل الوسائط...</p>
                    </div>
                ) : filteredMediaItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FaImage className={styles.emptyIcon} />
                        <h4>لا توجد وسائط</h4>
                        <p>
                            {selectedType
                                ? `لا توجد ${MEDIA_TYPES.find(t => t.value === selectedType)?.label} في المكتبة`
                                : "ابدأ برفع أول ملف إلى المكتبة"
                            }
                        </p>
                        <button
                            className={styles.uploadToggleButton}
                            onClick={() => setShowUploadForm(true)}
                        >
                            <FaUpload />
                            {selectedType ? `رفع ${MEDIA_TYPES.find(t => t.value === selectedType)?.label}` : "رفع أول ملف"}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.mediaGrid}>
                            {filteredMediaItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`${styles.mediaItem} ${isMediaSelected(item) ? styles.selected : ''
                                        }`}
                                >
                                    <div className={styles.mediaPreview}>
                                        {renderMediaPreview(item)}

                                        {isMediaSelected(item) && (
                                            <div className={styles.selectOverlay} onClick={(e) => handleSelectMedia(item, e)}>
                                                <FaCheck />
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.mediaInfo}>
                                        <div className={styles.mediaName} title={item.name}>
                                            {item.name}
                                        </div>
                                        <div className={styles.mediaMeta}>
                                            <span className={styles.mediaType}>
                                                {item.media_type}
                                            </span>
                                            <span className={styles.fileSize}>
                                                {item.file_size ? `${(item.file_size / 1024 / 1024).toFixed(1)} MB` : 'N/A'}
                                            </span>
                                        </div>
                                        {item.usage_count !== undefined && (
                                            <div className={styles.usageCount}>
                                                مستخدم {item.usage_count} مرات
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 📄 الترقيم */}
                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    className={styles.pageButton}
                                >
                                    السابق
                                </button>
                                <span className={styles.pageInfo}>
                                    صفحة {currentPage} من {totalPages}
                                </span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    className={styles.pageButton}
                                >
                                    التالي
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* نافذة معاينة الوسائط */}
            {previewMedia && (
                <div className={styles.previewModal} onClick={() => setPreviewMedia(null)}>
                    <div className={styles.previewContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.previewHeader}>
                            <h3>{previewMedia.name}</h3>
                            <button
                                className={styles.closeButton}
                                onClick={() => setPreviewMedia(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className={styles.previewBody}>
                            {previewMedia.media_type === "image" && (
                                <img
                                    src={previewMedia.file_url}
                                    alt={previewMedia.title || previewMedia.name}
                                    className={styles.previewImage}
                                />
                            )}
                            {previewMedia.media_type === "video" && (
                                <video
                                    controls
                                    className={styles.previewVideo}
                                >
                                    <source src={previewMedia.file_url} type="video/mp4" />
                                    متصفحك لا يدعم تشغيل الفيديو.
                                </video>
                            )}
                            {previewMedia.media_type === "audio" && (
                                <div className={styles.previewAudio}>
                                    <div className={styles.audioInfo}>
                                        <FaMusic size={48} className={styles.audioIcon} />
                                        <h4>{previewMedia.name}</h4>
                                    </div>
                                    <audio controls className={styles.audioPlayer}>
                                        <source src={previewMedia.file_url} type="audio/mpeg" />
                                        <source src={previewMedia.file_url} type="audio/wav" />
                                        <source src={previewMedia.file_url} type="audio/ogg" />
                                        متصفحك لا يدعم تشغيل الصوت.
                                    </audio>
                                </div>
                            )}
                            {previewMedia.media_type === "document" && (
                                <div className={styles.previewDocument}>
                                    <FaFile size={64} />
                                    <p>مستند: {previewMedia.name}</p>
                                    <a
                                        href={previewMedia.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.downloadLink}
                                    >
                                        فتح المستند
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className={styles.previewFooter}>
                            <div className={styles.previewInfo}>
                                <span>النوع: {previewMedia.media_type}</span>
                                {previewMedia.file_size && (
                                    <span>الحجم: {(previewMedia.file_size / 1024 / 1024).toFixed(1)} MB</span>
                                )}
                                {previewMedia.created_at && (
                                    <span>تاريخ الرفع: {new Date(previewMedia.created_at).toLocaleDateString('ar-EG')}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaLibrary;