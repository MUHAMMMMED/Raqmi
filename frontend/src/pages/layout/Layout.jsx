
import React, { useEffect, useState } from 'react';
import BookList from '../book/BookList';
import Categories from '../categories/Categories/Categories';
import CourseList from '../courses/CourseList';
import Dashboard from '../Dashboard/Dashboard';
import LessonIndexManager from '../LessonIndex/LessonIndexManager';
import MediaLibrary from '../MediaLibrary/MediaLibrary';
import styles from './Layout.module.css';
import Sidebar from './Sidebar/Sidebar';

const Layout = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [activeComponent, setActiveComponent] = useState('Dashboard');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarExpanded(true);
                setSidebarVisible(true);
            } else if (window.innerWidth >= 768) {
                setSidebarExpanded(false);
                setSidebarVisible(true);
            } else {
                setSidebarExpanded(false);
                setSidebarVisible(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // دالة عرض المكون بناءً على الـ component name
    const renderComponent = () => {
        switch (activeComponent) {
            case 'Dashboard': return <Dashboard />;
            case 'Courses': return <CourseList />;
            case 'book': return <BookList />;
            case 'Media': return <MediaLibrary />;
            case 'Index': return <LessonIndexManager />;

            case 'categories': return <Categories />;


            default: return <Dashboard />;
        }
    };

    return (
        <div className={styles.layout}>
            <Sidebar
                isSidebarExpanded={sidebarExpanded}
                setIsSidebarExpanded={setSidebarExpanded}
                isSidebarVisible={sidebarVisible}
                setIsSidebarVisible={setSidebarVisible}
                activeComponent={activeComponent}
                setActiveComponent={setActiveComponent}
            />

            <main className={`${styles.mainContent} ${sidebarExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed
                }`}>
                <div className={styles.contentWrapper}>
                    {renderComponent()}
                </div>
            </main>
        </div>
    );
};

export default Layout;