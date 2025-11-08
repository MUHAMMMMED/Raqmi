import React, { useEffect, useState } from "react";
import {
    FaArrowDown,
    FaArrowRight,
    FaArrowUp,
    FaClock,
    FaEdit,
    FaExternalLinkAlt,
    FaFile,
    FaPlus,
    FaSearch,
    FaTrash
} from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";

import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import ContentModal from "./components/ContentModal/ContentModal";
import styles from './ContentList.module.css';

import { createContent, deleteContent, getContentsByLesson, updateContent } from "../../../../api/contents";

const ContentList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [modalMode, setModalMode] = useState('create');
    const [contentToDelete, setContentToDelete] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const contentsData = await getContentsByLesson(id);
            setContents(contentsData);
        } catch (error) {
            console.error('Error loading contents:', error);
        } finally {
            setLoading(false);
        }
    };

    // Create Content
    const handleCreateContent = () => {
        setSelectedContent(null);
        setModalMode('create');
        setIsContentModalOpen(true);
    };

    // Edit Content
    const handleEditContent = (content) => {
        setSelectedContent(content);
        setModalMode('edit');
        setIsContentModalOpen(true);
    };

    // Save Content (Create or Update)
    const handleSaveContent = async (contentData) => {
        try {
            const dataToSend = {
                ...contentData,
                lesson: parseInt(id)
            };

            if (modalMode === 'create') {
                await createContent(dataToSend);
            } else {
                await updateContent(selectedContent.id, dataToSend);
            }
            await loadData();
            setIsContentModalOpen(false);
        } catch (error) {
            console.error('Error saving content:', error);
            throw error;
        }
    };

    // Delete Content
    const handleDeleteContent = (content) => {
        setContentToDelete(content);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteContent = async () => {
        try {
            await deleteContent(contentToDelete.id);
            await loadData();
            setIsDeleteModalOpen(false);
            setContentToDelete(null);
        } catch (error) {
            console.error('Error deleting content:', error);
        }
    };

    // Reorder Content
    const moveContent = async (contentId, direction) => {
        try {
            const contentIndex = contents.findIndex(c => c.id === contentId);
            if (
                (direction === 'up' && contentIndex === 0) ||
                (direction === 'down' && contentIndex === contents.length - 1)
            ) {
                return;
            }

            const newIndex = direction === 'up' ? contentIndex - 1 : contentIndex + 1;
            const updatedContents = [...contents];
            const [movedContent] = updatedContents.splice(contentIndex, 1);
            updatedContents.splice(newIndex, 0, movedContent);

            // Update orders
            const updatedContentsWithOrder = updatedContents.map((content, index) => ({
                ...content,
                order: index
            }));

            setContents(updatedContentsWithOrder);

            // Update in backend
            await updateContent(contentId, { order: newIndex });

            // Reload to sync with backend
            await loadData();
        } catch (error) {
            console.error('Error reordering content:', error);
        }
    };

    // Open Content Editor
    const handleOpenEditor = (contentId) => {
        navigate(`/content/${contentId}/editor`);
    };

    // Go Back to Previous Page
    const handleGoBack = () => {
        navigate(-1); // العودة للصفحة السابقة
    };

    const filteredContents = contents.filter(content =>
        content.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const ContentItem = ({ content, index }) => {
        return (
            <div className={styles.contentItem}>
                <div className={styles.contentHeader}>
                    <div className={styles.contentOrder}>
                        <span className={styles.orderNumber}>{index + 1}</span>
                    </div>

                    <div className={styles.contentInfo}>
                        <h3 className={styles.contentTitle}>{content.title}</h3>

                        <div className={styles.contentMeta}>
                            <span className={styles.metaItem}>
                                <FaClock className={styles.metaIcon} />
                                تم الإنشاء: {formatDate(content.created_at)}
                            </span>
                            <span className={styles.metaItem}>
                                <FaClock className={styles.metaIcon} />
                                آخر تحديث: {formatDate(content.updated_at)}
                            </span>
                        </div>
                    </div>

                    <div className={styles.contentActions}>
                        <div className={styles.reorderButtons}>
                            <button
                                className={styles.reorderBtn}
                                onClick={() => moveContent(content.id, 'up')}
                                disabled={index === 0}
                                title="نقل لأعلى"
                            >
                                <FaArrowUp />
                            </button>
                            <button
                                className={styles.reorderBtn}
                                onClick={() => moveContent(content.id, 'down')}
                                disabled={index === contents.length - 1}
                                title="نقل لأسفل"
                            >
                                <FaArrowDown />
                            </button>
                        </div>

                        <button
                            className={styles.actionBtn}
                            onClick={() => handleOpenEditor(content.id)}
                            title="فتح المحرر"
                        >
                            <FaExternalLinkAlt />
                            محرر
                        </button>

                        <button
                            className={styles.actionBtn}
                            onClick={() => handleEditContent(content)}
                            title="تعديل المحتوى"
                        >
                            <FaEdit />
                            تعديل
                        </button>

                        <button
                            className={`${styles.actionBtn} ${styles.danger}`}
                            onClick={() => handleDeleteContent(content)}
                            title="حذف المحتوى"
                        >
                            <FaTrash />
                            حذف
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const CreateContentButton = () => {
        return (
            <button
                className={styles.createContentBtn}
                onClick={handleCreateContent}
            >
                <FaPlus />
                إضافة محتوى جديد
            </button>
        );
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل المحتويات...</p>
            </div>
        );
    }

    return (
        <div className={styles.contentListContainer}>
            {/* رأس الصفحة */}
            <div className={styles.headerSection}>
                <div className={styles.headerContent}>
                    <div className={styles.titleSection}>
                        <button
                            className={styles.backButton}
                            onClick={handleGoBack}
                            title="العودة للصفحة السابقة"
                        >
                            <FaArrowRight />
                        </button>
                        <FaFile className={styles.headerIcon} />
                        <div>
                            <h1 className={styles.mainTitle}>المحتويات التعليمية</h1>
                            <p className={styles.subtitle}>
                                إدارة المحتويات والمواد التعليمية للدرس
                            </p>
                        </div>
                    </div>
                    <div className={styles.statsSection}>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{contents.length}</span>
                            <span className={styles.statLabel}>محتوى</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>
                                {contents.filter(content => content.created_at).length}
                            </span>
                            <span className={styles.statLabel}>محتوى نشط</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* شريط البحث والإجراءات */}
            <div className={styles.actionsSection}>
                <div className={styles.searchContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="ابحث في المحتويات حسب العنوان..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <CreateContentButton />
            </div>

            {/* قائمة المحتويات */}
            <div className={styles.contentsList}>
                {filteredContents.length > 0 ? (
                    filteredContents.map((content, index) => (
                        <ContentItem key={content.id} content={content} index={index} />
                    ))
                ) : searchTerm ? (
                    <div className={styles.noResults}>
                        <FaSearch className={styles.noResultsIcon} />
                        <h3>لا توجد نتائج</h3>
                        <p>لم نتمكن من العثور على محتويات تطابق "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <FaFile className={styles.emptyIcon} />
                        <h2>لا توجد محتويات بعد</h2>
                        <p>ابدأ بإضافة أول محتوى تعليمي</p>
                        <CreateContentButton />
                    </div>
                )}
            </div>

            {/* مودال إنشاء/تعديل المحتوى */}
            <ContentModal
                isOpen={isContentModalOpen}
                onClose={() => setIsContentModalOpen(false)}
                onSave={handleSaveContent}
                content={selectedContent}
                mode={modalMode}
                lessonId={id}
            />

            {/* مودال تأكيد الحذف */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setContentToDelete(null);
                }}
                onConfirm={confirmDeleteContent}
                title="تأكيد الحذف"
                message={`هل أنت متأكد من رغبتك في حذف المحتوى "${contentToDelete?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
                confirmText="حذف"
                cancelText="إلغاء"
                type="danger"
            />
        </div>
    );
};

export default ContentList;