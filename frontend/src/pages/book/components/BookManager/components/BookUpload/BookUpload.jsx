import React, { useEffect, useState } from "react";
import {
    FaBorderAll,
    FaCheckCircle,
    FaExclamationTriangle,
    FaFilePdf,
    FaSpinner,
    FaTimes,
    FaUpload
} from 'react-icons/fa';
import { uploadBook } from "../../../../../../api/books";

import styles from './BookUpload.module.css';

import {
    getGradePrograms, getProgramSubjects,
    getStageGrades,
    getStages
} from "../../../../../../api/categories";
const BookUpload = ({ onSuccess, onCancel }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);

    const [title, setTitle] = useState("");

    // الفئات
    const [stages, setStages] = useState([]);
    const [grades, setGrades] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [selectedStage, setSelectedStage] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    const [loadingStages, setLoadingStages] = useState(false);
    const [loadingGrades, setLoadingGrades] = useState(false);
    const [loadingPrograms, setLoadingPrograms] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    // جلب المراحل عند تحميل المكون
    useEffect(() => {
        const fetchStages = async () => {
            setLoadingStages(true);
            try {
                const data = await getStages();
                setStages(data);
            } catch (error) {
                console.error("Error fetching stages:", error);
            } finally {
                setLoadingStages(false);
            }
        };
        fetchStages();
    }, []);

    // جلب الصفوف عند اختيار مرحلة
    useEffect(() => {
        if (selectedStage) {
            const fetchGrades = async () => {
                setLoadingGrades(true);
                try {
                    const data = await getStageGrades(selectedStage);
                    setGrades(data);
                    setSelectedGrade("");
                    setPrograms([]);
                    setSubjects([]);
                } catch (error) {
                    console.error("Error fetching grades:", error);
                } finally {
                    setLoadingGrades(false);
                }
            };
            fetchGrades();
        } else {
            setGrades([]);
            setPrograms([]);
            setSubjects([]);
        }
    }, [selectedStage]);

    // جلب البرامج
    useEffect(() => {
        if (selectedGrade) {
            const fetchPrograms = async () => {
                setLoadingPrograms(true);
                try {
                    const data = await getGradePrograms(selectedGrade);
                    setPrograms(data);
                    setSelectedProgram("");
                    setSubjects([]);
                } catch (error) {
                    console.error("Error fetching programs:", error);
                } finally {
                    setLoadingPrograms(false);
                }
            };
            fetchPrograms();
        } else {
            setPrograms([]);
            setSubjects([]);
        }
    }, [selectedGrade]);

    // جلب المواد
    useEffect(() => {
        if (selectedProgram) {
            const fetchSubjects = async () => {
                setLoadingSubjects(true);
                try {
                    const data = await getProgramSubjects(selectedProgram);
                    setSubjects(data);
                    setSelectedSubject("");
                } catch (error) {
                    console.error("Error fetching subjects:", error);
                } finally {
                    setLoadingSubjects(false);
                }
            };
            fetchSubjects();
        } else {
            setSubjects([]);
        }
    }, [selectedProgram]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setUploadStatus({ type: 'error', message: 'الرجاء اختيار ملف PDF فقط' });
                return;
            }
            if (selectedFile.size > 50 * 1024 * 1024) {
                setUploadStatus({ type: 'error', message: 'حجم الملف كبير جدًا. الحد الأقصى 50MB' });
                return;
            }

            setFile(selectedFile);
            if (!title) {
                const fileName = selectedFile.name.replace('.pdf', '').replace(/_/g, ' ');
                setTitle(fileName);
            }
            setUploadStatus(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus({ type: 'error', message: 'الرجاء اختيار ملف PDF' });
            return;
        }
        if (!title.trim()) {
            setUploadStatus({ type: 'error', message: 'الرجاء إدخال عنوان الكتاب' });
            return;
        }
        if (!selectedSubject) {
            setUploadStatus({ type: 'error', message: 'الرجاء اختيار المادة' });
            return;
        }

        setUploading(true);
        setUploadStatus(null);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("pdf", file);
            uploadFormData.append("title", title);
            if (selectedStage) uploadFormData.append("stage", selectedStage);
            if (selectedGrade) uploadFormData.append("grade", selectedGrade);
            if (selectedProgram) uploadFormData.append("program", selectedProgram);
            if (selectedSubject) uploadFormData.append("subject", selectedSubject);

            await uploadBook(uploadFormData);

            setUploadStatus({ type: 'success', message: 'تم رفع الكتاب بنجاح!' });

            // إعادة تعيين
            setFile(null);
            setTitle("");
            setSelectedStage(""); setSelectedGrade(""); setSelectedProgram(""); setSelectedSubject("");
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';

            setTimeout(() => onSuccess?.(), 1500);
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus({ type: 'error', message: 'حدث خطأ أثناء الرفع' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.uploadContainer}>
            <div className={styles.header}>
                <FaUpload className={styles.headerIcon} />
                <div>
                    <h1>رفع كتاب جديد</h1>
                    <p>اختر الفئة وارفع الكتاب في المكتبة</p>
                </div>
                {onCancel && (
                    <button className={styles.closeButton} onClick={onCancel} disabled={uploading}>
                        <FaTimes />
                    </button>
                )}
            </div>

            <div className={styles.uploadForm}>
                {/* معلومات الكتاب */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaFilePdf className={styles.sectionIcon} />
                        <h3>معلومات الكتاب</h3>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>عنوان الكتاب *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.textInput}
                            placeholder="أدخل عنوان الكتاب..."
                            disabled={uploading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>ملف PDF *</label>
                        <div className={styles.fileUploadArea}>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="application/pdf"
                                className={styles.fileInput}
                                id="pdf-upload"
                                disabled={uploading}
                            />
                            <label htmlFor="pdf-upload" className={styles.fileLabel}>
                                <FaFilePdf className={styles.fileIcon} />
                                <div>
                                    <span className={styles.fileTitle}>
                                        {file ? file.name : 'اختر ملف PDF'}
                                    </span>
                                    <span className={styles.fileHint}>
                                        {file ? `(${(file.size / (1024 * 1024)).toFixed(2)} MB)` : 'الحد الأقصى 50MB'}
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* اختيار الفئات */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaBorderAll className={styles.sectionIcon} />
                        <h3>اختيار الفئة</h3>
                    </div>

                    <div className={styles.designGrid}>
                        {/* المرحلة */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>المرحلة</label>
                            <select
                                value={selectedStage}
                                onChange={(e) => setSelectedStage(e.target.value)}
                                className={styles.selectInput}
                                disabled={uploading || loadingStages}
                            >
                                <option value="">اختر المرحلة...</option>
                                {stages.map(stage => (
                                    <option key={stage.id} value={stage.id}>{stage.name}</option>
                                ))}
                            </select>
                            {loadingStages && <small>جاري تحميل المراحل...</small>}
                        </div>

                        {/* الصف */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>الصف</label>
                            <select
                                value={selectedGrade}
                                onChange={(e) => setSelectedGrade(e.target.value)}
                                className={styles.selectInput}
                                disabled={uploading || !selectedStage || loadingGrades}
                            >
                                <option value="">اختر الصف...</option>
                                {grades.map(grade => (
                                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.designGrid}>
                        {/* البرنامج */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>البرنامج</label>
                            <select
                                value={selectedProgram}
                                onChange={(e) => setSelectedProgram(e.target.value)}
                                className={styles.selectInput}
                                disabled={uploading || !selectedGrade || loadingPrograms}
                            >
                                <option value="">اختر البرنامج...</option>
                                {programs.map(program => (
                                    <option key={program.id} value={program.id}>{program.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* المادة */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>المادة *</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className={styles.selectInput}
                                disabled={uploading || !selectedProgram || loadingSubjects}
                            >
                                <option value="">اختر المادة...</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* الحالة */}
                {uploadStatus && (
                    <div className={`${styles.statusMessage} ${styles[uploadStatus.type]}`}>
                        {uploadStatus.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                        {uploadStatus.message}
                    </div>
                )}

                {/* الأزرار */}
                <div className={styles.actions}>
                    {onCancel && (
                        <button onClick={onCancel} disabled={uploading} className={styles.cancelButton}>
                            إلغاء
                        </button>
                    )}
                    <button
                        onClick={handleUpload}
                        disabled={uploading || !file || !selectedSubject}
                        className={`${styles.uploadButton} ${uploading ? styles.loading : ''}`}
                    >
                        {uploading ? (
                            <> <FaSpinner className={styles.spinner} /> جاري الرفع... </>
                        ) : (
                            <> <FaUpload className={styles.buttonIcon} /> رفع الكتاب </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookUpload;