
import React, { useEffect, useState } from 'react';
import { FaFilter, FaLayerGroup, FaSearch, FaTimes } from 'react-icons/fa';
import styles from './FilterSection.module.css';

const FilterSection = ({ books, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // حالات التصفية - سنستخدم القيم النصية مباشرة من البيانات
    const [selectedStage, setSelectedStage] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    // استخراج القيم الفريدة من الكتب مباشرة
    const uniqueStages = [...new Set(books.map(book => book.stage_title).filter(Boolean))];
    const uniqueGrades = [...new Set(books.map(book => book.grade_title).filter(Boolean))];
    const uniquePrograms = [...new Set(books.map(book => book.program_title).filter(Boolean))];
    const uniqueSubjects = [...new Set(books.map(book => book.subject_title).filter(Boolean))];

    // تطبيق الفلاتر
    useEffect(() => {
        const filteredBooks = books.filter(book => {
            // البحث بالنص
            const matchesSearch = !searchTerm ||
                book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.subject_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.stage_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.grade_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.program_title?.toLowerCase().includes(searchTerm.toLowerCase());

            // التصفية بالمرحلة (باستخدام النص مباشرة)
            const matchesStage = !selectedStage || book.stage_title === selectedStage;

            // التصفية بالصف (باستخدام النص مباشرة)
            const matchesGrade = !selectedGrade || book.grade_title === selectedGrade;

            // التصفية بالبرنامج (باستخدام النص مباشرة)
            const matchesProgram = !selectedProgram || book.program_title === selectedProgram;

            // التصفية بالمادة (باستخدام النص مباشرة)
            const matchesSubject = !selectedSubject || book.subject_title === selectedSubject;

            return matchesSearch && matchesStage && matchesGrade && matchesProgram && matchesSubject;
        });

        onFilterChange(filteredBooks);
    }, [searchTerm, selectedStage, selectedGrade, selectedProgram, selectedSubject, books, onFilterChange]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStage('');
        setSelectedGrade('');
        setSelectedProgram('');
        setSelectedSubject('');
    };

    const hasActiveFilters = searchTerm || selectedStage || selectedGrade || selectedProgram || selectedSubject;

    return (
        <div className={styles.filterSection}>
            {/* شريط البحث */}
            <div className={styles.searchBar}>
                <div className={styles.searchInputContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="ابحث باسم الكتاب، المادة، المرحلة، الصف، أو البرنامج..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className={styles.clearSearch}
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>

                <button
                    className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <FaFilter />
                    <span>الفلاتر المتقدمة</span>
                    {hasActiveFilters && <span className={styles.filterBadge}></span>}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className={styles.clearFilters}
                    >
                        <FaTimes />
                        <span>مسح الكل</span>
                    </button>
                )}
            </div>

            {/* الفلاتر المتقدمة */}
            {showFilters && (
                <div className={styles.advancedFilters}>
                    <div className={styles.filterHeader}>
                        <FaLayerGroup className={styles.filterIcon} />
                        <h4>التصنيف الأكاديمي</h4>
                    </div>

                    <div className={styles.filterGrid}>
                        <div className={styles.filterGroup}>
                            <label>المرحلة</label>
                            <select
                                value={selectedStage}
                                onChange={(e) => {
                                    setSelectedStage(e.target.value);
                                    setSelectedGrade('');
                                    setSelectedProgram('');
                                    setSelectedSubject('');
                                }}
                                className={styles.filterSelect}
                            >
                                <option value="">جميع المراحل</option>
                                {uniqueStages.map(stage => (
                                    <option key={stage} value={stage}>
                                        {stage}
                                    </option>
                                ))}
                            </select>
                            {uniqueStages.length > 0 && (
                                <div className={styles.quickFilters}>
                                    {uniqueStages.map(stage => (
                                        <button
                                            key={stage}
                                            className={`${styles.quickFilter} ${selectedStage === stage ? styles.active : ''}`}
                                            onClick={() => {
                                                setSelectedStage(stage);
                                                setSelectedGrade('');
                                                setSelectedProgram('');
                                                setSelectedSubject('');
                                            }}
                                        >
                                            {stage}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.filterGroup}>
                            <label>الصف</label>
                            <select
                                value={selectedGrade}
                                onChange={(e) => {
                                    setSelectedGrade(e.target.value);
                                    setSelectedProgram('');
                                    setSelectedSubject('');
                                }}
                                className={styles.filterSelect}
                            >
                                <option value="">جميع الصفوف</option>
                                {uniqueGrades.map(grade => (
                                    <option key={grade} value={grade}>
                                        {grade}
                                    </option>
                                ))}
                            </select>
                            {uniqueGrades.length > 0 && (
                                <div className={styles.quickFilters}>
                                    {uniqueGrades.map(grade => (
                                        <button
                                            key={grade}
                                            className={`${styles.quickFilter} ${selectedGrade === grade ? styles.active : ''}`}
                                            onClick={() => {
                                                setSelectedGrade(grade);
                                                setSelectedProgram('');
                                                setSelectedSubject('');
                                            }}
                                        >
                                            {grade}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.filterGroup}>
                            <label>البرنامج</label>
                            <select
                                value={selectedProgram}
                                onChange={(e) => {
                                    setSelectedProgram(e.target.value);
                                    setSelectedSubject('');
                                }}
                                className={styles.filterSelect}
                            >
                                <option value="">جميع البرامج</option>
                                {uniquePrograms.map(program => (
                                    <option key={program} value={program}>
                                        {program}
                                    </option>
                                ))}
                            </select>
                            {uniquePrograms.length > 0 && (
                                <div className={styles.quickFilters}>
                                    {uniquePrograms.map(program => (
                                        <button
                                            key={program}
                                            className={`${styles.quickFilter} ${selectedProgram === program ? styles.active : ''}`}
                                            onClick={() => {
                                                setSelectedProgram(program);
                                                setSelectedSubject('');
                                            }}
                                        >
                                            {program}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.filterGroup}>
                            <label>المادة</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">جميع المواد</option>
                                {uniqueSubjects.map(subject => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                            {uniqueSubjects.length > 0 && (
                                <div className={styles.quickFilters}>
                                    {uniqueSubjects.map(subject => (
                                        <button
                                            key={subject}
                                            className={`${styles.quickFilter} ${selectedSubject === subject ? styles.active : ''}`}
                                            onClick={() => setSelectedSubject(subject)}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* عرض الفلاتر النشطة */}
                    {hasActiveFilters && (
                        <div className={styles.activeFilters}>
                            <span className={styles.activeFiltersLabel}>الفلاتر المطبقة:</span>
                            <div className={styles.activeFilterTags}>
                                {searchTerm && (
                                    <span className={styles.filterTag}>
                                        بحث: "{searchTerm}"
                                        <button onClick={() => setSearchTerm('')}>×</button>
                                    </span>
                                )}
                                {selectedStage && (
                                    <span className={styles.filterTag}>
                                        مرحلة: {selectedStage}
                                        <button onClick={() => setSelectedStage('')}>×</button>
                                    </span>
                                )}
                                {selectedGrade && (
                                    <span className={styles.filterTag}>
                                        صف: {selectedGrade}
                                        <button onClick={() => setSelectedGrade('')}>×</button>
                                    </span>
                                )}
                                {selectedProgram && (
                                    <span className={styles.filterTag}>
                                        برنامج: {selectedProgram}
                                        <button onClick={() => setSelectedProgram('')}>×</button>
                                    </span>
                                )}
                                {selectedSubject && (
                                    <span className={styles.filterTag}>
                                        مادة: {selectedSubject}
                                        <button onClick={() => setSelectedSubject('')}>×</button>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterSection;