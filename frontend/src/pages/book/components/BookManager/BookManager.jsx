
import React, { useEffect, useState } from 'react';
import styles from './BookManager.module.css';
import BookCard from './components/BookCard/BookCard';
import BookUpload from './components/BookUpload/BookUpload';
import FilterSection from './components/FilterSection/FilterSection';

const BookManager = ({ books, handleViewParts, handleOpenPdf, setShowUpload, showUpload, loadBooks }) => {
    const [filteredBooks, setFilteredBooks] = useState(books);

    // تحديث الكتب المصفاة عند تغيير الكتب الأصلية
    useEffect(() => {
        setFilteredBooks(books);
    }, [books]);

    return (
        <div className={styles.bookManager}>
            {/* قسم البحث والتصفية */}
            <FilterSection
                books={books}
                onFilterChange={setFilteredBooks}
            />

            {/* إحصائيات النتائج */}
            <div className={styles.resultsInfo}>
                <span className={styles.resultsCount}>
                    عرض {filteredBooks.length} من أصل {books.length} كتاب
                </span>
                <div className={styles.resultsStats}>
                    <span className={styles.statItem}>
                        <strong>المراحل:</strong> {[...new Set(books.map(book => book.stage_title).filter(Boolean))].length}
                    </span>
                    <span className={styles.statItem}>
                        <strong>المواد:</strong> {[...new Set(books.map(book => book.subject_title).filter(Boolean))].length}
                    </span>
                    <span className={styles.statItem}>
                        <strong>الأجزاء:</strong> {books.reduce((total, book) => total + (book.parts?.length || 0), 0)}
                    </span>
                </div>
            </div>

            {/* شبكة الكتب */}
            {filteredBooks.length > 0 ? (
                <div className={styles.booksGrid}>
                    {filteredBooks.map(book => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onViewParts={handleViewParts}
                            onOpenPdf={handleOpenPdf}
                            onBookUpdated={loadBooks}
                            onBookDeleted={loadBooks}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>📚</div>
                    <h3>لا توجد كتب مطابقة للبحث</h3>
                    <p>جرب تعديل كلمات البحث أو إزالة بعض الفلاتر</p>
                    <button
                        onClick={() => setShowUpload(true)}
                        className={styles.addBookBtn}
                    >
                        إضافة كتاب جديد
                    </button>
                </div>
            )}

            {/* نافذة رفع الكتاب */}
            {showUpload && (
                <BookUpload
                    onClose={() => setShowUpload(false)}
                    onSuccess={() => {
                        setShowUpload(false);
                        loadBooks();
                    }}
                />
            )}
        </div>
    );
};

export default BookManager;