import React, { useState } from "react";

import styles from './BookUpload.module.css';

import {
    FaBorderAll,
    FaCheckCircle,
    FaExclamationTriangle,
    FaEyeDropper,
    FaFilePdf,
    FaFont,
    FaPalette,
    FaSpinner,
    FaTimes,
    FaUpload
} from 'react-icons/fa';
import { uploadBook } from "../../../../api/books";

const BookUpload = ({ onSuccess, onCancel }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        // إعدادات التصميم
        primary_color: "#1E90FF",
        secondary_color: "#FFD700",
        background_color: "#FFFFFF",
        main_font: "Cairo",
        desc_font: "Tajawal",
        border_radius: 16,
        padding: 12
    });

    const FONT_OPTIONS = [
        { value: "Cairo", label: "Cairo", category: "عربية" },
        { value: "Tajawal", label: "Tajawal", category: "عربية" },
        { value: "Amiri", label: "Amiri", category: "عربية" },
        { value: "Almarai", label: "Almarai", category: "عربية" },
        { value: "Arial", label: "Arial", category: "إنجليزية" },
        { value: "Times New Roman", label: "Times New Roman", category: "إنجليزية" },
        { value: "Georgia", label: "Georgia", category: "إنجليزية" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setUploadStatus({
                    type: 'error',
                    message: 'الرجاء اختيار ملف PDF فقط'
                });
                return;
            }

            if (selectedFile.size > 50 * 1024 * 1024) { // 50MB
                setUploadStatus({
                    type: 'error',
                    message: 'حجم الملف كبير جداً. الحد الأقصى 50MB'
                });
                return;
            }

            setFile(selectedFile);

            // تعيين العنوان تلقائياً من اسم الملف
            if (!formData.title) {
                const fileName = selectedFile.name.replace('.pdf', '').replace(/_/g, ' ');
                setFormData(prev => ({
                    ...prev,
                    title: fileName
                }));
            }

            setUploadStatus(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus({
                type: 'error',
                message: 'الرجاء اختيار ملف PDF'
            });
            return;
        }

        if (!formData.title.trim()) {
            setUploadStatus({
                type: 'error',
                message: 'الرجاء إدخال عنوان الكتاب'
            });
            return;
        }

        setUploading(true);
        setUploadStatus(null);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("pdf", file);
            uploadFormData.append("title", formData.title);
            uploadFormData.append("primary_color", formData.primary_color);
            uploadFormData.append("secondary_color", formData.secondary_color);
            uploadFormData.append("background_color", formData.background_color);
            uploadFormData.append("main_font", formData.main_font);
            uploadFormData.append("desc_font", formData.desc_font);
            uploadFormData.append("border_radius", formData.border_radius.toString());
            uploadFormData.append("padding", formData.padding.toString());

            await uploadBook(uploadFormData);

            setUploadStatus({
                type: 'success',
                message: 'تم رفع الكتاب بنجاح!'
            });

            // إعادة تعيين النموذج
            setFile(null);
            setFormData({
                title: "",
                primary_color: "#1E90FF",
                secondary_color: "#FFD700",
                background_color: "#FFFFFF",
                main_font: "Cairo",
                desc_font: "Tajawal",
                border_radius: 16,
                padding: 12
            });

            // مسح حقل الملف
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';

            // استدعاء onSuccess بعد تأخير بسيط لإظهار رسالة النجاح
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1500);

        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus({
                type: 'error',
                message: 'حدث خطأ أثناء رفع الملف. الرجاء المحاولة مرة أخرى'
            });
        } finally {
            setUploading(false);
        }
    };

    const DesignPreview = () => (
        <div className={styles.designPreview}>
            <h4>
                <FaEyeDropper className={styles.previewIcon} />
                معاينة التصميم
            </h4>

            <div className={styles.previewContainer}>
                <div
                    className={styles.previewCard}
                    style={{
                        '--primary-color': formData.primary_color,
                        '--secondary-color': formData.secondary_color,
                        '--background-color': formData.background_color,
                        '--border-radius': `${formData.border_radius}px`,
                        '--padding': `${formData.padding}px`,
                        '--main-font': formData.main_font,
                        '--desc-font': formData.desc_font
                    }}
                >
                    <div className={styles.previewHeader}>
                        <div className={styles.previewIconContainer}>
                            <FaFilePdf />
                        </div>
                        <div className={styles.previewText}>
                            <h5 style={{ fontFamily: formData.main_font }}>
                                {formData.title || "عنوان الكتاب"}
                            </h5>
                            <p style={{ fontFamily: formData.desc_font }}>
                                هذا نموذج معاينة للتصميم
                            </p>
                        </div>
                    </div>

                    <div className={styles.previewColors}>
                        <div
                            className={styles.colorDot}
                            style={{ backgroundColor: formData.primary_color }}
                            title={`أساسي: ${formData.primary_color}`}
                        />
                        <div
                            className={styles.colorDot}
                            style={{ backgroundColor: formData.secondary_color }}
                            title={`ثانوي: ${formData.secondary_color}`}
                        />
                        <div
                            className={styles.colorDot}
                            style={{ backgroundColor: formData.background_color, border: '1px solid #e2e8f0' }}
                            title={`خلفية: ${formData.background_color}`}
                        />
                    </div>

                    <div className={styles.previewSpecs}>
                        <span>نصف قطر: {formData.border_radius}px</span>
                        <span>مسافة: {formData.padding}px</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.uploadContainer}>
            <div className={styles.header}>
                <FaUpload className={styles.headerIcon} />
                <div>
                    <h1>رفع كتاب جديد</h1>
                    <p>أضف كتاباً جديداً إلى المكتبة مع إعدادات التصميم المخصصة</p>
                </div>
                {onCancel && (
                    <button
                        className={styles.closeButton}
                        onClick={onCancel}
                        disabled={uploading}
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            <div className={styles.uploadForm}>
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaFilePdf className={styles.sectionIcon} />
                        <h3>معلومات الكتاب</h3>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            عنوان الكتاب *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={styles.textInput}
                            placeholder="أدخل عنوان الكتاب..."
                            required
                            disabled={uploading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            ملف PDF *
                        </label>
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

                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaPalette className={styles.sectionIcon} />
                        <h3>إعدادات التصميم</h3>
                    </div>

                    <div className={styles.designGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaEyeDropper className={styles.labelIcon} />
                                اللون الأساسي
                            </label>
                            <div className={styles.colorInputGroup}>
                                <input
                                    type="color"
                                    name="primary_color"
                                    value={formData.primary_color}
                                    onChange={handleInputChange}
                                    className={styles.colorInput}
                                    disabled={uploading}
                                />
                                <input
                                    type="text"
                                    name="primary_color"
                                    value={formData.primary_color}
                                    onChange={handleInputChange}
                                    className={styles.colorTextInput}
                                    disabled={uploading}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaEyeDropper className={styles.labelIcon} />
                                اللون الثانوي
                            </label>
                            <div className={styles.colorInputGroup}>
                                <input
                                    type="color"
                                    name="secondary_color"
                                    value={formData.secondary_color}
                                    onChange={handleInputChange}
                                    className={styles.colorInput}
                                    disabled={uploading}
                                />
                                <input
                                    type="text"
                                    name="secondary_color"
                                    value={formData.secondary_color}
                                    onChange={handleInputChange}
                                    className={styles.colorTextInput}
                                    disabled={uploading}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaEyeDropper className={styles.labelIcon} />
                                لون الخلفية
                            </label>
                            <div className={styles.colorInputGroup}>
                                <input
                                    type="color"
                                    name="background_color"
                                    value={formData.background_color}
                                    onChange={handleInputChange}
                                    className={styles.colorInput}
                                    disabled={uploading}
                                />
                                <input
                                    type="text"
                                    name="background_color"
                                    value={formData.background_color}
                                    onChange={handleInputChange}
                                    className={styles.colorTextInput}
                                    disabled={uploading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.designGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaFont className={styles.labelIcon} />
                                خط العناوين
                            </label>
                            <select
                                name="main_font"
                                value={formData.main_font}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                disabled={uploading}
                            >
                                {FONT_OPTIONS.map(font => (
                                    <option key={font.value} value={font.value}>
                                        {font.label} ({font.category})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaFont className={styles.labelIcon} />
                                خط النصوص
                            </label>
                            <select
                                name="desc_font"
                                value={formData.desc_font}
                                onChange={handleInputChange}
                                className={styles.selectInput}
                                disabled={uploading}
                            >
                                {FONT_OPTIONS.map(font => (
                                    <option key={font.value} value={font.value}>
                                        {font.label} ({font.category})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.designGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaBorderAll className={styles.labelIcon} />
                                نصف قطر الحواف (px)
                            </label>
                            <div className={styles.rangeInputGroup}>
                                <input
                                    type="range"
                                    name="border_radius"
                                    min="0"
                                    max="30"
                                    value={formData.border_radius}
                                    onChange={handleNumberInputChange}
                                    className={styles.rangeInput}
                                    disabled={uploading}
                                />
                                <span className={styles.rangeValue}>
                                    {formData.border_radius}px
                                </span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaBorderAll className={styles.labelIcon} />
                                المسافة الداخلية (px)
                            </label>
                            <div className={styles.rangeInputGroup}>
                                <input
                                    type="range"
                                    name="padding"
                                    min="8"
                                    max="30"
                                    value={formData.padding}
                                    onChange={handleNumberInputChange}
                                    className={styles.rangeInput}
                                    disabled={uploading}
                                />
                                <span className={styles.rangeValue}>
                                    {formData.padding}px
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <DesignPreview />

                {uploadStatus && (
                    <div className={`${styles.statusMessage} ${styles[uploadStatus.type]}`}>
                        {uploadStatus.type === 'success' ? (
                            <FaCheckCircle className={styles.statusIcon} />
                        ) : (
                            <FaExclamationTriangle className={styles.statusIcon} />
                        )}
                        {uploadStatus.message}
                    </div>
                )}

                <div className={styles.actions}>
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            disabled={uploading}
                            className={styles.cancelButton}
                        >
                            إلغاء
                        </button>
                    )}
                    <button
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        className={`${styles.uploadButton} ${uploading ? styles.loading : ''}`}
                    >
                        {uploading ? (
                            <>
                                <FaSpinner className={styles.spinner} />
                                جاري الرفع...
                            </>
                        ) : (
                            <>
                                <FaUpload className={styles.buttonIcon} />
                                رفع الكتاب
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookUpload;