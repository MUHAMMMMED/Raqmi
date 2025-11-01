
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../../api/books";
import styles from './BookList.module.css';
import BookCard from "./components/BookCard/BookCard";
import BookUploadModal from "./components/BookUploadModal/BookUploadModal";
import EmptyState from "./components/EmptyState/EmptyState";
import HeaderSection from "./components/HeaderSection/HeaderSection";
import LessonCard from "./components/LessonCard/LessonCard";
import PartCard from "./components/PartCard/PartCard";
import PartManagerModal from "./components/PartManager/PartManagerModal";



const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [showPartManager, setShowPartManager] = useState(false);
    const [managedBook, setManagedBook] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);
    const [showParts, setShowParts] = useState(false);
    const [showLessons, setShowLessons] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const booksData = await getBooks();
            setBooks(booksData);
        } catch (error) {
            console.error('Error loading books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewParts = (book) => {
        setSelectedBook(book);
        setShowParts(true);
        setShowLessons(false);
        setSelectedPart(null);
    };

    const handleViewLessons = (part) => {
        setSelectedPart(part);
        setShowLessons(true);
        setShowParts(false);
    };

    const handleBackToParts = () => {
        setShowLessons(false);
        setShowParts(true);
        setSelectedPart(null);
    };

    const handleBackToBooks = () => {
        setShowParts(false);
        setShowLessons(false);
        setSelectedBook(null);
        setSelectedPart(null);
    };

    const handleOpenPdf = (pdfUrl) => {
        window.open(pdfUrl, '_blank', 'width=1200,height=800,scrollbars=yes');
    };

    const handleLessonClick = (lessonId) => {
        navigate(`/books/lesson/${lessonId}`);
    };

    const handleManageParts = (book) => {
        setManagedBook(book);
        setShowPartManager(true);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل الكتب...</p>
            </div>
        );
    }

    return (
        <div className={styles.bookListContainer}>
            {/* Header */}
            <HeaderSection
                showLessons={showLessons}
                showParts={showParts}
                selectedBook={selectedBook}
                selectedPart={selectedPart}
                booksCount={books.length}
                onAddBook={() => setShowUpload(true)}
                onBackToParts={handleBackToParts}
                onBackToBooks={handleBackToBooks}
            />

            {/* Book Upload Modal */}
            <BookUploadModal
                isOpen={showUpload}
                onClose={() => setShowUpload(false)}
                onSuccess={() => {
                    setShowUpload(false);
                    loadBooks();
                }}
            />

            {/* Part Manager Modal */}
            <PartManagerModal
                book={managedBook}
                isOpen={showPartManager}
                onClose={() => {
                    setShowPartManager(false);
                    setManagedBook(null);
                }}
                onUpdate={loadBooks}
            />

            {/* Lessons View */}
            {showLessons ? (
                <div className={styles.lessonsContainer}>
                    {selectedPart?.lessons?.length > 0 ? (
                        <div className={styles.lessonsList}>
                            {selectedPart.lessons
                                .sort((a, b) => a.order - b.order)
                                .map((lesson) => (
                                    <LessonCard
                                        key={lesson.id}
                                        lesson={lesson}
                                        bookId={selectedBook.id}
                                        partId={selectedPart.id}
                                        onClick={handleLessonClick}
                                    />
                                ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon="graduation-cap"
                            title="لا توجد دروس لهذا الجزء"
                            description="يمكنك إضافة دروس من خلال تحرير الجزء"
                            buttonText="العودة للأجزاء"
                            onButtonClick={handleBackToParts}
                        />
                    )}
                </div>
            ) : showParts ? (
                /* Parts View */
                <div className={styles.partsContainer}>
                    {selectedBook?.parts?.length > 0 ? (
                        <div className={styles.partsList}>
                            {selectedBook.parts
                                .sort((a, b) => a.order - b.order)
                                .map((part) => (
                                    <PartCard
                                        key={part.id}
                                        part={part}
                                        bookId={selectedBook.id}
                                        onViewLessons={handleViewLessons}
                                    />
                                ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon="book"
                            title="لا توجد أجزاء لهذا الكتاب"
                            description="يمكنك إضافة أجزاء من خلال تحرير الكتاب"
                            buttonText="العودة للكتب"
                            onButtonClick={handleBackToBooks}
                        />
                    )}
                </div>
            ) : (
                /* Books View */
                <>
                    {books.length > 0 ? (
                        <div className={styles.booksGrid}>
                            {books.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onViewParts={handleViewParts}
                                    onOpenPdf={handleOpenPdf}
                                    onManageParts={handleManageParts}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon="book"
                            title="لا توجد كتب متاحة"
                            description="ابدأ بإضافة كتاب جديد إلى المكتبة"
                            buttonText="إضافة الكتاب الأول"
                            buttonIcon="upload"
                            onButtonClick={() => setShowUpload(true)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default BookList;