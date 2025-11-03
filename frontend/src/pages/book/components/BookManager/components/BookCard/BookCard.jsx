import React, { useEffect, useState } from 'react';
import {
    FaBook, FaCalendar,
    FaEdit,
    FaExclamationTriangle,
    FaExternalLinkAlt, FaFilePdf,
    FaLayerGroup,
    FaList,
    FaSpinner,
    FaTimes,
    FaTrash
} from 'react-icons/fa';

import { deleteBook, updateBook } from '../../../../../../api/books';
import {
    getGradePrograms,
    getProgramSubjects,
    getStageGrades,
    getStages,
} from '../../../../../../api/categories';
import styles from './BookCard.module.css';

const BookCard = ({ book, onViewParts, onOpenPdf, onBookUpdated, onBookDeleted }) => {
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [title, setTitle] = useState(book.title);
    const [file, setFile] = useState(null);
    const [selectedStage, setSelectedStage] = useState(book.stage?.id || "");
    const [selectedGrade, setSelectedGrade] = useState(book.grade?.id || "");
    const [selectedProgram, setSelectedProgram] = useState(book.program?.id || "");
    const [selectedSubject, setSelectedSubject] = useState(book.subject?.id || "");

    const [stages, setStages] = useState([]);
    const [grades, setGrades] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    useEffect(() => {
        const fetchStages = async () => {
            try {
                const data = await getStages();
                setStages(data);
            } catch (error) {
                console.error("Error fetching stages:", error);
            }
        };
        fetchStages();
    }, []);

    const openEdit = async () => {
        setTitle(book.title);
        setFile(null);

        // اختيار القيم الافتراضية للقوائم المتسلسلة
        const stageId = book.stage || "";
        setSelectedStage(stageId);

        if (stageId) {
            const gradesData = await getStageGrades(stageId);
            setGrades(gradesData);

            const gradeId = book.grade || "";
            setSelectedGrade(gradeId);

            if (gradeId) {
                const programsData = await getGradePrograms(gradeId);
                setPrograms(programsData);

                const programId = book.program || "";
                setSelectedProgram(programId);

                if (programId) {
                    const subjectsData = await getProgramSubjects(programId);
                    setSubjects(subjectsData);

                    const subjectId = book.subject || "";
                    setSelectedSubject(subjectId);
                }
            }
        }

        setShowEdit(true);
    };

    const handleUpdate = async () => {
        if (!title.trim()) {
            alert("الرجاء إدخال عنوان الكتاب");
            return;
        }
        if (!selectedSubject) {
            alert("الرجاء اختيار المادة");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            if (file) formData.append("pdf", file);
            if (selectedStage) formData.append("stage", parseInt(selectedStage));
            if (selectedGrade) formData.append("grade", parseInt(selectedGrade));
            if (selectedProgram) formData.append("program", parseInt(selectedProgram));
            if (selectedSubject) formData.append("subject", parseInt(selectedSubject));

            await updateBook(book.id, formData);
            setShowEdit(false);
            onBookUpdated?.();
        } catch (error) {
            console.error("Update error:", error);
            alert("حدث خطأ أثناء التعديل");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await deleteBook(book.id);
            setShowDeleteConfirm(false);
            onBookDeleted?.(book.id);
        } catch (error) {
            console.error("Delete error:", error);
            alert("حدث خطأ أثناء الحذف");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            <div className={styles.card}>
                {/* شريط العلوي */}
                <div className={styles.topBar}>
                    <span className={styles.categoryBadge}>
                        {book.subject_title || 'غير محدد'}
                    </span>
                    <div className={styles.actions}>
                        <button
                            className={styles.editBtn}
                            onClick={openEdit}
                            aria-label="تعديل الكتاب"
                        >
                            <FaEdit />
                        </button>
                        <button
                            className={styles.deleteBtn}
                            onClick={() => setShowDeleteConfirm(true)}
                            aria-label="حذف الكتاب"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>

                {/* المحتوى الرئيسي */}
                <div className={styles.content}>
                    <div className={styles.bookHeader}>
                        <div className={styles.bookIcon}>
                            <FaBook />
                        </div>
                        <div className={styles.bookInfo}>
                            <h3 className={styles.title}>{book.title}</h3>
                            <div className={styles.categoryPath}>
                                <FaLayerGroup className={styles.pathIcon} />
                                <span>{book.stage_title}</span>
                                <span className={styles.pathSeparator}>→</span>
                                <span>{book.grade_title}</span>
                                <span className={styles.pathSeparator}>→</span>
                                <span>{book.program_title}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.metaInfo}>
                        <div className={styles.metaItem}>
                            <FaCalendar className={styles.metaIcon} />
                            <span>{formatDate(book.uploaded_at)}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <FaFilePdf className={styles.metaIcon} />
                            <span>PDF</span>
                        </div>
                        <div className={styles.metaItem}>
                            <FaList className={styles.metaIcon} />
                            <span>{book.parts?.length || 0} أجزاء</span>
                        </div>
                    </div>
                </div>

                {/* الأزرار الرئيسية */}
                <div className={styles.mainActions}>
                    <button
                        className={styles.secondaryBtn}
                        onClick={() => onOpenPdf(book.pdf)}
                    >
                        <FaExternalLinkAlt />
                        <span>فتح PDF</span>
                    </button>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => onViewParts(book)}
                    >
                        <FaList />
                        <span>عرض الأجزاء</span>
                    </button>
                </div>
            </div>

            {/* نافذة التعديل */}
            {showEdit && (
                <div className={styles.modalOverlay} onClick={() => setShowEdit(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>تعديل الكتاب</h3>
                            <button onClick={() => setShowEdit(false)} className={styles.closeBtn}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>عنوان الكتاب *</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className={styles.textInput}
                                    placeholder="أدخل العنوان..."
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>ملف PDF (اختياري)</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={e => setFile(e.target.files[0])}
                                    className={styles.fileInput}
                                />
                                {file && <small className={styles.fileName}>{file.name}</small>}
                            </div>

                            <div className={styles.categoryGrid}>
                                <div className={styles.formGroup}>
                                    <label>المرحلة</label>
                                    <select
                                        value={selectedStage}
                                        onChange={e => setSelectedStage(e.target.value)}
                                        className={styles.selectInput}
                                    >
                                        <option value="">اختر المرحلة...</option>
                                        {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>الصف</label>
                                    <select
                                        value={selectedGrade}
                                        onChange={e => setSelectedGrade(e.target.value)}
                                        className={styles.selectInput}
                                        disabled={!selectedStage}
                                    >
                                        <option value="">اختر الصف...</option>
                                        {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.categoryGrid}>
                                <div className={styles.formGroup}>
                                    <label>البرنامج</label>
                                    <select
                                        value={selectedProgram}
                                        onChange={e => setSelectedProgram(e.target.value)}
                                        className={styles.selectInput}
                                        disabled={!selectedGrade}
                                    >
                                        <option value="">اختر البرنامج...</option>
                                        {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>المادة *</label>
                                    <select
                                        value={selectedSubject}
                                        onChange={e => setSelectedSubject(e.target.value)}
                                        className={styles.selectInput}
                                        disabled={!selectedProgram}
                                    >
                                        <option value="">اختر المادة...</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                onClick={() => setShowEdit(false)}
                                className={styles.cancelBtn}
                                disabled={loading}
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className={styles.saveBtn}
                            >
                                {loading ? <><FaSpinner className={styles.spinner} /> جاري الحفظ...</> : 'حفظ التغييرات'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* نافذة تأكيد الحذف */}
            {showDeleteConfirm && (
                <div className={styles.deleteOverlay} onClick={() => setShowDeleteConfirm(false)}>
                    <div className={styles.deleteModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.deleteHeader}>
                            <FaExclamationTriangle className={styles.warnIcon} />
                            <h3>حذف الكتاب</h3>
                        </div>
                        <div className={styles.deleteBody}>
                            <p>هل أنت متأكد من حذف الكتاب التالي؟</p>
                            <p className={styles.bookTitleHighlight}>"{book.title}"</p>
                            <p className={styles.warningText}>
                                <strong>تحذير:</strong> هذا الإجراء <span className={styles.irreversible}>لا يمكن التراجع عنه</span>،
                                وسيتم حذف الكتاب وجميع أجزائه نهائيًا.
                            </p>
                        </div>
                        <div className={styles.deleteActions}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className={styles.cancelBtn}
                                disabled={deleteLoading}
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleDelete}
                                className={styles.dangerBtn}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'جاري الحذف...' : 'حذف نهائي'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookCard;