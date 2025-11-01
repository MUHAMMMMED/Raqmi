
import React, { useEffect, useState } from 'react';
import { FaBars, FaChevronDown, FaChevronLeft, FaMoon, FaSignOutAlt, FaSun } from 'react-icons/fa';

import styles from './Sidebar.module.css';
import { sidebarData } from './sidebarData';

const Sidebar = ({
    isSidebarExpanded,
    setIsSidebarExpanded,
    isSidebarVisible,
    setIsSidebarVisible,
    activeComponent,
    setActiveComponent
}) => {
    const [expandedGroups, setExpandedGroups] = useState([1, 2]);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // فتح المجموعة التي تحتوي على المكون النشط
        const activeGroup = sidebarData.groups.find(group =>
            group.items.some(item => activeComponent === item.component)
        );
        if (activeGroup && !expandedGroups.includes(activeGroup.id)) {
            setExpandedGroups(prev => [...prev, activeGroup.id]);
        }
    }, [activeComponent]);

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const isItemActive = (component) => {
        return activeComponent === component;
    };

    const handleItemClick = (item) => {
        setActiveComponent(item.component);
        // إغلاق السايدبار على الجوال بعد النقر
        if (window.innerWidth <= 767) {
            setIsSidebarVisible(false);
        }
    };

    const toggleSidebar = () => {
        if (window.innerWidth <= 767) {
            setIsSidebarVisible(!isSidebarVisible);
        } else {
            setIsSidebarExpanded(!isSidebarExpanded);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode');
    };

    const handleLogout = () => {
        // منطق تسجيل الخروج
        localStorage.removeItem('user_data');
        window.location.href = '/login';
    };

    return (
        <>
            {/* زر القائمة على الجوال */}
            {window.innerWidth <= 767 && (
                <button
                    className={styles.hamburger}
                    onClick={toggleSidebar}
                    aria-label="تبديل القائمة"
                >
                    <FaBars />
                </button>
            )}

            {/* السايدبار */}
            <aside
                className={`${styles.sidebar} ${isSidebarVisible || (window.innerWidth >= 768 && isSidebarExpanded)
                    ? styles.visible
                    : styles.hidden
                    } ${isSidebarExpanded ? styles.expanded : ''}`}
            >
                {/* رأس السايدبار */}
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>🎯</div>
                        {isSidebarExpanded && (
                            <div className={styles.logoText}>
                                <h2>EduPlatform</h2>
                                <span>نظام التعليم</span>
                            </div>
                        )}
                    </div>

                    {/* زر التبديل على الشاشات المتوسطة والكبيرة */}
                    {window.innerWidth >= 768 && (
                        <button
                            className={styles.toggleButton}
                            onClick={toggleSidebar}
                            aria-label={isSidebarExpanded ? "طي القائمة" : "توسيع القائمة"}
                        >
                            <FaChevronLeft />
                        </button>
                    )}
                </div>

                {/* معلومات المستخدم */}
                <div className={styles.userSection}>
                    <div className={styles.userAvatar}>
                        {sidebarData.user.avatar}
                    </div>
                    {isSidebarExpanded && (
                        <div className={styles.userInfo}>
                            <h4>{sidebarData.user.name}</h4>
                            <span>{sidebarData.user.role}</span>
                        </div>
                    )}
                </div>

                {/* قائمة التنقل */}
                <nav className={styles.navigation}>
                    {sidebarData.groups.map(group => (
                        <div key={group.id} className={styles.group}>
                            <div
                                className={styles.groupHeader}
                                onClick={() => toggleGroup(group.id)}
                            >
                                <span className={styles.groupIcon}>{group.icon}</span>
                                {isSidebarExpanded && (
                                    <>
                                        <span className={styles.groupName}>{group.name}</span>
                                        <span className={`${styles.groupArrow} ${expandedGroups.includes(group.id) ? styles.expanded : ''
                                            }`}>
                                            <FaChevronDown size={12} />
                                        </span>
                                    </>
                                )}
                            </div>

                            {isSidebarExpanded && expandedGroups.includes(group.id) && (
                                <div className={styles.groupItems}>
                                    {group.items.map(item => (
                                        <button
                                            key={item.id}
                                            className={`${styles.navItem} ${isItemActive(item.component) ? styles.active : ''
                                                }`}
                                            onClick={() => handleItemClick(item)}
                                            aria-label={`الانتقال إلى ${item.name}`}
                                        >
                                            <span className={styles.itemIcon}>{item.icon}</span>
                                            <span className={styles.itemName}>{item.name}</span>
                                            {item.badge && (
                                                <span className={styles.itemBadge}>{item.badge}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* تذييل السايدبار */}
                <div className={styles.sidebarFooter}>
                    <button
                        className={styles.footerItem}
                        onClick={toggleDarkMode}
                        aria-label={darkMode ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
                    >
                        {darkMode ? <FaSun /> : <FaMoon />}
                        {isSidebarExpanded && <span>الوضع الليلي</span>}
                    </button>

                    <button
                        className={styles.footerItem}
                        onClick={handleLogout}
                        aria-label="تسجيل الخروج"
                    >
                        <FaSignOutAlt />
                        {isSidebarExpanded && <span>تسجيل الخروج</span>}
                    </button>
                </div>
            </aside>

            {/* Overlay للجوال */}
            {isSidebarVisible && window.innerWidth <= 767 && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsSidebarVisible(false)}
                />
            )}
        </>
    );
};

export default Sidebar;