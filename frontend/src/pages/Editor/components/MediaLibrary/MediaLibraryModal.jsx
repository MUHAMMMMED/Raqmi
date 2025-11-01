
import React, { useEffect, useState } from "react";
import {
    FaCheck,
    FaFile,
    FaFilter,
    FaImage,
    FaMusic,
    FaSearch,
    FaTimes,
    FaUpload,
    FaVideo,
} from "react-icons/fa";

import { getMedia, uploadMedia } from "../../../../api/mediaLibrary";
import styles from "./MediaLibraryModal.module.css";

const MediaLibraryModal = ({ isOpen, onClose, onSelect, mediaType = "" }) => {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState(mediaType);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [uploadForm, setUploadForm] = useState({
        file: null,
        name: "",
        title: "",
        description: "",
        tags: [],
    });

    const MEDIA_TYPES = [
        { value: "", label: "All Media", icon: FaFilter },
        { value: "image", label: "Images", icon: FaImage },
        { value: "video", label: "Videos", icon: FaVideo },
        { value: "audio", label: "Audio", icon: FaMusic },
        { value: "document", label: "Documents", icon: FaFile },
    ];

    useEffect(() => {
        if (isOpen) loadMedia();
    }, [isOpen, selectedType, searchQuery, currentPage]);

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
        if (!uploadForm.file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", uploadForm.file);
            formData.append("name", uploadForm.name || uploadForm.file.name);
            formData.append("media_type", selectedType || "");
            formData.append("title", uploadForm.title);
            formData.append("description", uploadForm.description);
            formData.append("tags", JSON.stringify(uploadForm.tags));

            await uploadMedia(formData);
            setUploadForm({
                file: null,
                name: "",
                title: "",
                description: "",
                tags: [],
            });
            loadMedia();
        } catch (error) {
            console.error("Error uploading media:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadForm((prev) => ({
                ...prev,
                file,
                name: file.name,
            }));
        }
    };

    const handleSelectMedia = (mediaItem) => {
        onSelect(mediaItem);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <h2>Media Library</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {/* 🔍 Filters */}
                    <div className={styles.filtersSection}>
                        <div className={styles.searchBox}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search media..."
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

                    {/* 📤 Upload */}
                    <div className={styles.uploadSection}>
                        <h3>Upload New Media</h3>
                        <form onSubmit={handleUpload} className={styles.uploadForm}>
                            <div className={styles.uploadRow}>
                                <input type="file" onChange={handleFileSelect} className={styles.fileInput} />
                                <input
                                    type="text"
                                    placeholder="Name"
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

                            <div className={styles.uploadRow}>
                                <input
                                    type="text"
                                    placeholder="Title (optional)"
                                    value={uploadForm.title}
                                    onChange={(e) =>
                                        setUploadForm((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    className={styles.textInput}
                                />
                                <input
                                    type="text"
                                    placeholder="Description (optional)"
                                    value={uploadForm.description}
                                    onChange={(e) =>
                                        setUploadForm((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className={styles.textInput}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!uploadForm.file || uploading}
                                className={styles.uploadButton}
                            >
                                <FaUpload />
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </form>
                    </div>

                    {/* 🖼️ Media Grid */}
                    <div className={styles.mediaGridSection}>
                        <h3>Available Media</h3>
                        {loading ? (
                            <div className={styles.loading}>Loading...</div>
                        ) : mediaItems.length === 0 ? (
                            <p>No media found.</p>
                        ) : (
                            <div className={styles.mediaGrid}>
                                {mediaItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={styles.mediaItem}
                                        onClick={() => handleSelectMedia(item)}
                                    >
                                        <div className={styles.mediaPreview}>
                                            {item.media_type === "image" ? (
                                                <img
                                                    src={item.file_url}
                                                    alt={item.title || item.name}
                                                />
                                            ) : item.media_type === "video" ? (
                                                <div className={styles.videoPlaceholder}>
                                                    <FaVideo size={32} />
                                                    <span>Video</span>
                                                </div>
                                            ) : item.media_type === "audio" ? (
                                                <div className={styles.audioPlaceholder}>
                                                    <FaMusic size={32} />
                                                    <span>Audio</span>
                                                </div>
                                            ) : (
                                                <div className={styles.documentPlaceholder}>
                                                    <FaFile size={32} />
                                                    <span>Document</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.mediaInfo}>
                                            <div className={styles.mediaName}>{item.name}</div>
                                            <div className={styles.mediaMeta}>
                                                <span className={styles.mediaType}>{item.media_type}</span>
                                                <span className={styles.usageCount}>
                                                    Used {item.usage_count} times
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.selectOverlay}>
                                            <FaCheck />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 📄 Pagination */}
                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    className={styles.pageButton}
                                >
                                    Previous
                                </button>
                                <span className={styles.pageInfo}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    className={styles.pageButton}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaLibraryModal;