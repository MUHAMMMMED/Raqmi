import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../../api/books";
import styles from "./BookList.module.css";
import BookManager from "./components/BookManager/BookManager";
import HeaderSection from "./components/HeaderSection/HeaderSection";
import LessonManager from "./components/LessonManager/LessonManager";
import PartManager from "./components/PartManager/PartManager";

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
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
            console.error("Error loading books:", error);
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
        window.open(pdfUrl, "_blank", "width=1200,height=800,scrollbars=yes");
    };

    const handleLessonClick = (lessonId) => {
        navigate(`/books/lesson/${lessonId}`);
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



            {showLessons ? (
                <LessonManager
                    selectedPart={selectedPart}
                    selectedBook={selectedBook}
                    handleLessonClick={handleLessonClick}
                    handleBackToParts={handleBackToParts}
                />
            ) : showParts ? (
                <div className={styles.partsContainer}>
                    <PartManager
                        selectedBook={selectedBook}
                        handleViewLessons={handleViewLessons}
                        handleBackToBooks={handleBackToBooks}
                    />
                </div>
            ) : (
                <BookManager
                    books={books}
                    handleViewParts={handleViewParts}
                    handleOpenPdf={handleOpenPdf}
                    setShowUpload={setShowUpload}
                    showUpload={showUpload}
                    loadBooks={loadBooks}
                />
            )}
        </div>
    );
};

export default BookList;