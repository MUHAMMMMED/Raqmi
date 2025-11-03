
import React, { useEffect, useState } from "react";
import { FaGraduationCap, FaPlus } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import styles from './CourseList.module.css';

import { deleteCourse, getCourses } from "../../api/courses";
import CourseCard from "./components/CourseCard/CourseCard";
import CourseForm from "./components/CourseForm/CourseForm";
import FilterSection from "./components/FilterSection/FilterSection";


const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const response = await getCourses();
            setCourses(response.data);
            setFilteredCourses(response.data);
        } catch (error) {
            console.error('Error loading courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setShowForm(true);
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
            try {
                await deleteCourse(courseId);
                loadCourses();
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('حدث خطأ أثناء حذف الكورس');
            }
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingCourse(null);
        loadCourses();
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingCourse(null);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل الكورسات...</p>
            </div>
        );
    }

    return (
        <div className={styles.courseListContainer}>
            {/* الهيدر */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.titleSection}>
                        <FaGraduationCap className={styles.titleIcon} />
                        <div>
                            <h1>إدارة الكورسات التعليمية</h1>
                            <span className={styles.subtitle}>
                                قم بإدارة الكورسات وإنشاء تجارب تعليمية مخصصة
                            </span>
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        <div className={styles.stats}>
                            <span className={styles.statItem}>
                                <strong>{courses.length}</strong> كورس متاح
                            </span>
                        </div>
                        <button
                            className={styles.addButton}
                            onClick={() => setShowForm(true)}
                        >
                            <FaPlus />
                            <span>إضافة كورس جديد</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* قسم الفلترة */}
            <FilterSection
                courses={courses}
                onFilterChange={setFilteredCourses}
            />

            {/* إحصائيات النتائج */}
            <div className={styles.resultsInfo}>
                <span className={styles.resultsCount}>
                    عرض {filteredCourses.length} من أصل {courses.length} كورس
                </span>
            </div>

            {/* شبكة الكورسات */}
            {filteredCourses.length > 0 ? (
                <div className={styles.coursesGrid}>
                    {filteredCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onViewLessons={() => navigate(`/courses/${course.id}/lessons`)}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>📚</div>
                    <h3>لا توجد كورسات مطابقة للبحث</h3>
                    <p>جرب تعديل كلمات البحث أو إزالة بعض الفلاتر</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className={styles.addCourseBtn}
                    >
                        <FaPlus />
                        إضافة كورس جديد
                    </button>
                </div>
            )}

            {/* نافذة الإضافة/التعديل */}
            {(showForm || editingCourse) && (
                <div className={styles.modalOverlay} onClick={handleFormCancel}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <CourseForm
                            course={editingCourse}
                            onSuccess={handleFormSuccess}
                            onCancel={handleFormCancel}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseList;