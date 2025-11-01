import React, { useEffect, useState } from 'react';
import {
    createGrade,
    createProgram,
    createStage,
    createSubject,
    deleteGrade,
    deleteProgram,
    deleteStage,
    deleteSubject,
    getGradePrograms, getProgramSubjects,
    getStageGrades,
    getStages,
    updateGrade,
    updateProgram,
    updateStage,
    updateSubject
} from '../../../api/categories';
import styles from './Categories.module.css';

import {
    FaArrowRight,
    FaBook,
    FaChalkboardTeacher,
    FaEdit,
    FaGraduationCap,
    FaLayerGroup,
    FaPlus,
    FaSave,
    FaSchool,
    FaSearch,
    FaSpinner,
    FaTimes,
    FaTrash
} from 'react-icons/fa';

const Categories = () => {
    const [stages, setStages] = useState([]);
    const [grades, setGrades] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStage, setSelectedStage] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formType, setFormType] = useState(''); // 'stage', 'grade', 'program', 'subject'
    const [formData, setFormData] = useState({ name: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadStages();
    }, []);

    const loadStages = async () => {
        try {
            setLoading(true);
            const stagesData = await getStages();
            setStages(stagesData);
        } catch (error) {
            console.error('Error loading stages:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadGrades = async (stageId) => {
        try {
            const gradesData = await getStageGrades(stageId);
            setGrades(gradesData);
            setPrograms([]);
            setSubjects([]);
            setSelectedGrade(null);
            setSelectedProgram(null);
        } catch (error) {
            console.error('Error loading grades:', error);
        }
    };

    const loadPrograms = async (gradeId) => {
        try {
            const programsData = await getGradePrograms(gradeId);
            setPrograms(programsData);
            setSubjects([]);
            setSelectedProgram(null);
        } catch (error) {
            console.error('Error loading programs:', error);
        }
    };

    const loadSubjects = async (programId) => {
        try {
            const subjectsData = await getProgramSubjects(programId);
            setSubjects(subjectsData);
        } catch (error) {
            console.error('Error loading subjects:', error);
        }
    };

    const handleStageSelect = (stage) => {
        setSelectedStage(stage);
        loadGrades(stage.id);
    };

    const handleGradeSelect = (grade) => {
        setSelectedGrade(grade);
        loadPrograms(grade.id);
    };

    const handleProgramSelect = (program) => {
        setSelectedProgram(program);
        loadSubjects(program.id);
    };

    // عمليات CRUD
    const handleAddNew = (type) => {
        setFormType(type);
        setEditingItem(null);
        setFormData({ name: '' });
        setShowForm(true);
    };

    const handleEdit = (item, type) => {
        setFormType(type);
        setEditingItem(item);
        setFormData({ name: item.name });
        setShowForm(true);
    };

    const handleDelete = async (item, type) => {
        if (!window.confirm(`هل أنت متأكد من حذف ${item.name}؟`)) {
            return;
        }

        try {
            switch (type) {
                case 'stage':
                    await deleteStage(item.id);
                    await loadStages();
                    if (selectedStage?.id === item.id) {
                        setSelectedStage(null);
                        setGrades([]);
                        setPrograms([]);
                        setSubjects([]);
                    }
                    break;
                case 'grade':
                    await deleteGrade(item.id);
                    if (selectedStage) await loadGrades(selectedStage.id);
                    if (selectedGrade?.id === item.id) {
                        setSelectedGrade(null);
                        setPrograms([]);
                        setSubjects([]);
                    }
                    break;
                case 'program':
                    await deleteProgram(item.id);
                    if (selectedGrade) await loadPrograms(selectedGrade.id);
                    if (selectedProgram?.id === item.id) {
                        setSelectedProgram(null);
                        setSubjects([]);
                    }
                    break;
                case 'subject':
                    await deleteSubject(item.id);
                    if (selectedProgram) await loadSubjects(selectedProgram.id);
                    break;
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('حدث خطأ أثناء الحذف');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('الرجاء إدخال الاسم');
            return;
        }

        setSaving(true);

        try {
            switch (formType) {
                case 'stage':
                    if (editingItem) {
                        await updateStage(editingItem.id, formData);
                    } else {
                        await createStage(formData);
                    }
                    await loadStages();
                    break;

                case 'grade':
                    if (editingItem) {
                        await updateGrade(editingItem.id, formData);
                    } else {
                        await createGrade({ ...formData, stage: selectedStage.id });
                    }
                    if (selectedStage) await loadGrades(selectedStage.id);
                    break;

                case 'program':
                    if (editingItem) {
                        await updateProgram(editingItem.id, formData);
                    } else {
                        await createProgram({ ...formData, grade: selectedGrade.id });
                    }
                    if (selectedGrade) await loadPrograms(selectedGrade.id);
                    break;

                case 'subject':
                    if (editingItem) {
                        await updateSubject(editingItem.id, formData);
                    } else {
                        await createSubject({ ...formData, program: selectedProgram.id });
                    }
                    if (selectedProgram) await loadSubjects(selectedProgram.id);
                    break;
            }

            setShowForm(false);
            setEditingItem(null);
            setFormData({ name: '' });
        } catch (error) {
            console.error('Error saving item:', error);
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setSaving(false);
        }
    };

    const getFormTitle = () => {
        const types = {
            stage: 'مرحلة',
            grade: 'صف',
            program: 'برنامج',
            subject: 'مادة'
        };
        return `${editingItem ? 'تعديل' : 'إضافة'} ${types[formType]}`;
    };

    const filteredStages = stages.filter(stage =>
        stage.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredGrades = grades.filter(grade =>
        grade.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.stage?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPrograms = programs.filter(program =>
        program.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.grade?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSubjects = subjects.filter(subject =>
        subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.program?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StageCard = ({ stage }) => {
        return (
            <div
                className={`${styles.card} ${selectedStage?.id === stage.id ? styles.selected : ''}`}
                onClick={() => handleStageSelect(stage)}
            >
                <div className={styles.cardIcon}>
                    <FaSchool />
                </div>
                <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{stage.name}</h3>
                    <div className={styles.cardMeta}>
                        <span className={styles.metaItem}>
                            <FaGraduationCap className={styles.metaIcon} />
                            {stage.grades_count || 0} صف
                        </span>
                    </div>
                </div>
                <div className={styles.cardActions}>
                    <button
                        className={styles.editButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(stage, 'stage');
                        }}
                        title="تعديل المرحلة"
                    >
                        <FaEdit />
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(stage, 'stage');
                        }}
                        title="حذف المرحلة"
                    >
                        <FaTrash />
                    </button>
                </div>
                <div className={styles.cardArrow}>
                    <FaArrowRight />
                </div>
            </div>
        );
    };

    const GradeCard = ({ grade }) => {
        return (
            <div
                className={`${styles.card} ${selectedGrade?.id === grade.id ? styles.selected : ''}`}
                onClick={() => handleGradeSelect(grade)}
            >
                <div className={styles.cardIcon}>
                    <FaGraduationCap />
                </div>
                <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{grade.name}</h3>
                    <div className={styles.cardMeta}>
                        <span className={styles.metaItem}>
                            المرحلة: {grade.stage?.name}
                        </span>
                        <span className={styles.metaItem}>
                            <FaLayerGroup className={styles.metaIcon} />
                            {grade.programs_count || 0} برنامج
                        </span>
                    </div>
                </div>
                <div className={styles.cardActions}>
                    <button
                        className={styles.editButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(grade, 'grade');
                        }}
                        title="تعديل الصف"
                    >
                        <FaEdit />
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(grade, 'grade');
                        }}
                        title="حذف الصف"
                    >
                        <FaTrash />
                    </button>
                </div>
                <div className={styles.cardArrow}>
                    <FaArrowRight />
                </div>
            </div>
        );
    };

    const ProgramCard = ({ program }) => {
        return (
            <div
                className={`${styles.card} ${selectedProgram?.id === program.id ? styles.selected : ''}`}
                onClick={() => handleProgramSelect(program)}
            >
                <div className={styles.cardIcon}>
                    <FaLayerGroup />
                </div>
                <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{program.name}</h3>
                    <div className={styles.cardMeta}>
                        <span className={styles.metaItem}>
                            الصف: {program.grade?.name}
                        </span>
                        <span className={styles.metaItem}>
                            المرحلة: {program.grade?.stage?.name}
                        </span>
                        <span className={styles.metaItem}>
                            <FaBook className={styles.metaIcon} />
                            {program.subjects_count || 0} مادة
                        </span>
                    </div>
                </div>
                <div className={styles.cardActions}>
                    <button
                        className={styles.editButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(program, 'program');
                        }}
                        title="تعديل البرنامج"
                    >
                        <FaEdit />
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(program, 'program');
                        }}
                        title="حذف البرنامج"
                    >
                        <FaTrash />
                    </button>
                </div>
                <div className={styles.cardArrow}>
                    <FaArrowRight />
                </div>
            </div>
        );
    };

    const SubjectCard = ({ subject }) => {
        return (
            <div className={styles.card}>
                <div className={styles.cardIcon}>
                    <FaBook />
                </div>
                <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{subject.name}</h3>
                    <div className={styles.cardMeta}>
                        <span className={styles.metaItem}>
                            البرنامج: {subject.program?.name}
                        </span>
                        <span className={styles.metaItem}>
                            الصف: {subject.program?.grade?.name}
                        </span>
                        <span className={styles.metaItem}>
                            المرحلة: {subject.program?.grade?.stage?.name}
                        </span>
                    </div>
                </div>
                <div className={styles.cardActions}>
                    <button
                        className={styles.editButton}
                        onClick={() => handleEdit(subject, 'subject')}
                        title="تعديل المادة"
                    >
                        <FaEdit />
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(subject, 'subject')}
                        title="حذف المادة"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        );
    };

    const getAddButtonText = () => {
        if (!selectedStage) return 'إضافة مرحلة';
        if (!selectedGrade) return 'إضافة صف';
        if (!selectedProgram) return 'إضافة برنامج';
        return 'إضافة مادة';
    };

    const handleAddButtonClick = () => {
        if (!selectedStage) {
            handleAddNew('stage');
        } else if (!selectedGrade) {
            handleAddNew('grade');
        } else if (!selectedProgram) {
            handleAddNew('program');
        } else {
            handleAddNew('subject');
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل البيانات...</p>
            </div>
        );
    }

    return (
        <div className={styles.curriculumManager}>
            {/* رأس الصفحة */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <FaChalkboardTeacher className={styles.headerIcon} />
                    <div>
                        <h1>إدارة المناهج الدراسية</h1>
                        <p>تصفح وإدارة المراحل والصفوف والبرامج والمواد الدراسية</p>
                    </div>
                </div>

                <div className={styles.headerActions}>
                    <div className={styles.searchContainer}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="ابحث في المناهج الدراسية..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <button
                        className={styles.addButton}
                        onClick={handleAddButtonClick}
                    >
                        <FaPlus />
                        {getAddButtonText()}
                    </button>
                </div>
            </div>

            {/* مسار التنقل */}
            <div className={styles.breadcrumb}>
                <button
                    className={styles.breadcrumbItem}
                    onClick={() => {
                        setSelectedStage(null);
                        setSelectedGrade(null);
                        setSelectedProgram(null);
                        setGrades([]);
                        setPrograms([]);
                        setSubjects([]);
                    }}
                >
                    جميع المراحل
                </button>

                {selectedStage && (
                    <>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <button
                            className={styles.breadcrumbItem}
                            onClick={() => {
                                setSelectedGrade(null);
                                setSelectedProgram(null);
                                setPrograms([]);
                                setSubjects([]);
                            }}
                        >
                            {selectedStage.name}
                        </button>
                    </>
                )}

                {selectedGrade && (
                    <>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <button
                            className={styles.breadcrumbItem}
                            onClick={() => {
                                setSelectedProgram(null);
                                setSubjects([]);
                            }}
                        >
                            {selectedGrade.name}
                        </button>
                    </>
                )}

                {selectedProgram && (
                    <>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbItem}>
                            {selectedProgram.name}
                        </span>
                    </>
                )}
            </div>

            {/* إحصائيات سريعة */}
            <div className={styles.statsOverview}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FaSchool />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statNumber}>{stages.length}</span>
                        <span className={styles.statLabel}>مرحلة</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FaGraduationCap />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statNumber}>{grades.length}</span>
                        <span className={styles.statLabel}>صف</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FaLayerGroup />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statNumber}>{programs.length}</span>
                        <span className={styles.statLabel}>برنامج</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FaBook />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statNumber}>{subjects.length}</span>
                        <span className={styles.statLabel}>مادة</span>
                    </div>
                </div>
            </div>

            {/* عرض البيانات */}
            <div className={styles.content}>
                {/* عرض المراحل */}
                {!selectedStage && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>المراحل الدراسية</h2>
                        <div className={styles.cardsGrid}>
                            {filteredStages.length > 0 ? (
                                filteredStages.map(stage => (
                                    <StageCard key={stage.id} stage={stage} />
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <FaSchool className={styles.emptyIcon} />
                                    <h3>لا توجد مراحل دراسية</h3>
                                    <p>ابدأ بإضافة أول مرحلة دراسية</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* عرض الصفوف */}
                {selectedStage && !selectedGrade && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            الصفوف - {selectedStage.name}
                        </h2>
                        <div className={styles.cardsGrid}>
                            {filteredGrades.length > 0 ? (
                                filteredGrades.map(grade => (
                                    <GradeCard key={grade.id} grade={grade} />
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <FaGraduationCap className={styles.emptyIcon} />
                                    <h3>لا توجد صفوف في هذه المرحلة</h3>
                                    <p>ابدأ بإضافة أول صف في المرحلة {selectedStage.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* عرض البرامج */}
                {selectedGrade && !selectedProgram && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            البرامج - {selectedGrade.name}
                        </h2>
                        <div className={styles.cardsGrid}>
                            {filteredPrograms.length > 0 ? (
                                filteredPrograms.map(program => (
                                    <ProgramCard key={program.id} program={program} />
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <FaLayerGroup className={styles.emptyIcon} />
                                    <h3>لا توجد برامج في هذا الصف</h3>
                                    <p>ابدأ بإضافة أول برنامج في الصف {selectedGrade.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* عرض المواد */}
                {selectedProgram && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            المواد - {selectedProgram.name}
                        </h2>
                        <div className={styles.cardsGrid}>
                            {filteredSubjects.length > 0 ? (
                                filteredSubjects.map(subject => (
                                    <SubjectCard key={subject.id} subject={subject} />
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <FaBook className={styles.emptyIcon} />
                                    <h3>لا توجد مواد في هذا البرنامج</h3>
                                    <p>ابدأ بإضافة أول مادة في البرنامج {selectedProgram.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* نافذة الإضافة/التعديل */}
            {showForm && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{getFormTitle()}</h3>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowForm(false)}
                                disabled={saving}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    الاسم *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ name: e.target.value })}
                                    className={styles.formInput}
                                    placeholder={`أدخل اسم ${formType === 'stage' ? 'المرحلة' : formType === 'grade' ? 'الصف' : formType === 'program' ? 'البرنامج' : 'المادة'}`}
                                    required
                                    disabled={saving}
                                />
                            </div>

                            {formType === 'grade' && selectedStage && (
                                <div className={styles.formInfo}>
                                    <span>المرحلة: {selectedStage.name}</span>
                                </div>
                            )}

                            {formType === 'program' && selectedGrade && (
                                <div className={styles.formInfo}>
                                    <span>الصف: {selectedGrade.name}</span>
                                    <span>المرحلة: {selectedGrade.stage?.name}</span>
                                </div>
                            )}

                            {formType === 'subject' && selectedProgram && (
                                <div className={styles.formInfo}>
                                    <span>البرنامج: {selectedProgram.name}</span>
                                    <span>الصف: {selectedProgram.grade?.name}</span>
                                    <span>المرحلة: {selectedProgram.grade?.stage?.name}</span>
                                </div>
                            )}

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className={styles.cancelButton}
                                    disabled={saving}
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className={styles.saveButton}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <FaSpinner className={styles.spinner} />
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            {editingItem ? 'تحديث' : 'حفظ'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div
                        className={styles.modalOverlay}
                        onClick={() => !saving && setShowForm(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default Categories;