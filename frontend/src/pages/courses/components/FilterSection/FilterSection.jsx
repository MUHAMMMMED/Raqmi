
import React, { useEffect, useState } from 'react';
import { FaFilter, FaLayerGroup, FaSearch, FaTimes } from 'react-icons/fa';
import { getGradePrograms, getProgramSubjects, getStageGrades, getStages } from '../../../../api/categories';
import styles from './FilterSection.module.css';

const FilterSection = ({ courses, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // حالات التصفية
    const [stages, setStages] = useState([]);
    const [grades, setGrades] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [selectedStage, setSelectedStage] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    // جلب البيانات الأولية
    useEffect(() => {
        const loadStages = async () => {
            try {
                const stagesData = await getStages();
                setStages(stagesData);
            } catch (error) {
                console.error('Error loading stages:', error);
            }
        };
        loadStages();
    }, []);

    // جلب البيانات المتسلسلة
    useEffect(() => {
        const loadGrades = async () => {
            if (selectedStage) {
                try {
                    const gradesData = await getStageGrades(selectedStage);
                    setGrades(gradesData);
                } catch (error) {
                    console.error('Error loading grades:', error);
                }
            } else {
                setGrades([]);
            }
        };
        loadGrades();
    }, [selectedStage]);

    useEffect(() => {
        const loadPrograms = async () => {
            if (selectedGrade) {
                try {
                    const programsData = await getGradePrograms(selectedGrade);
                    setPrograms(programsData);
                } catch (error) {
                    console.error('Error loading programs:', error);
                }
            } else {
                setPrograms([]);
            }
        };
        loadPrograms();
    }, [selectedGrade]);

    useEffect(() => {
        const loadSubjects = async () => {
            if (selectedProgram) {
                try {
                    const subjectsData = await getProgramSubjects(selectedProgram);
                    setSubjects(subjectsData);
                } catch (error) {
                    console.error('Error loading subjects:', error);
                }
            } else {
                setSubjects([]);
            }
        };
        loadSubjects();
    }, [selectedProgram]);

    // تطبيق الفلاتر
    useEffect(() => {
        const filteredCourses = courses.filter(course => {
            // البحث بالنص
            const matchesSearch = !searchTerm ||
                course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.subject_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.stage_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.grade_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.program_name?.toLowerCase().includes(searchTerm.toLowerCase());

            // التصفية بالمرحلة
            const matchesStage = !selectedStage || course.stage?.toString() === selectedStage;

            // التصفية بالصف
            const matchesGrade = !selectedGrade || course.grade?.toString() === selectedGrade;

            // التصفية بالبرنامج
            const matchesProgram = !selectedProgram || course.program?.toString() === selectedProgram;

            // التصفية بالمادة
            const matchesSubject = !selectedSubject || course.subject?.toString() === selectedSubject;

            return matchesSearch && matchesStage && matchesGrade && matchesProgram && matchesSubject;
        });

        onFilterChange(filteredCourses);
    }, [searchTerm, selectedStage, selectedGrade, selectedProgram, selectedSubject, courses, onFilterChange]);

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
                        placeholder="ابحث باسم الكورس، المادة، المرحلة، الصف، أو البرنامج..."
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
                                {stages.map(stage => (
                                    <option key={stage.id} value={stage.id}>
                                        {stage.name}
                                    </option>
                                ))}
                            </select>
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
                                disabled={!selectedStage}
                            >
                                <option value="">جميع الصفوف</option>
                                {grades.map(grade => (
                                    <option key={grade.id} value={grade.id}>
                                        {grade.name}
                                    </option>
                                ))}
                            </select>
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
                                disabled={!selectedGrade}
                            >
                                <option value="">جميع البرامج</option>
                                {programs.map(program => (
                                    <option key={program.id} value={program.id}>
                                        {program.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>المادة</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className={styles.filterSelect}
                                disabled={!selectedProgram}
                            >
                                <option value="">جميع المواد</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
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
                                        مرحلة: {stages.find(s => s.id.toString() === selectedStage)?.name}
                                        <button onClick={() => setSelectedStage('')}>×</button>
                                    </span>
                                )}
                                {selectedGrade && (
                                    <span className={styles.filterTag}>
                                        صف: {grades.find(g => g.id.toString() === selectedGrade)?.name}
                                        <button onClick={() => setSelectedGrade('')}>×</button>
                                    </span>
                                )}
                                {selectedProgram && (
                                    <span className={styles.filterTag}>
                                        برنامج: {programs.find(p => p.id.toString() === selectedProgram)?.name}
                                        <button onClick={() => setSelectedProgram('')}>×</button>
                                    </span>
                                )}
                                {selectedSubject && (
                                    <span className={styles.filterTag}>
                                        مادة: {subjects.find(s => s.id.toString() === selectedSubject)?.name}
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