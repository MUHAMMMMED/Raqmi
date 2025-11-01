import {
    FaChartBar,
    FaHome,
    FaPhotoVideo
} from 'react-icons/fa';

// import { BiSolidCategory } from "react-icons/bi";
// import {
//     FaBook,
//     FaChartBar,
//     FaCog,
//     FaComments,
//     FaGraduationCap,
//     FaHeadset,
//     FaHome,
//     FaImages,
//     FaMoneyBillWave,
//     FaPalette,
//     FaStar,
//     FaUserFriends,
//     // الإعدادات
//     FaUsers,
//     FaVideo
// } from 'react-icons/fa';





export const sidebarData = {
    user: {
        name: "أحمد محمد",
        role: "مدير النظام",
        avatar: "👨‍💼"
    },
    groups: [
        {
            id: 1,
            name: "الرئيسية",
            icon: <FaHome size={18} />,
            items: [



                {
                    id: 1,
                    name: "لوحة التحكم",
                    icon: <FaChartBar size={18} />,
                    component: 'Dashboard',
                    badge: null
                }
            ]
        },
        // {
        //     id: 2,
        //     name: "إدارة المحتوى",
        //     icon: <FaGraduationCap size={18} />,
        //     items: [
        //         {
        //             id: 5,
        //             name: "المرحلة تعليمية",
        //             icon: <BiSolidCategory size={18} />,
        //             component: 'categories',
        //             badge: 8
        //         },
        //         {
        //             id: 2,
        //             name: "الكورسات",
        //             icon: <FaGraduationCap size={18} />,
        //             component: 'Courses',
        //             badge: 5
        //         },
        //         {
        //             id: 3,
        //             name: "الدروس",
        //             icon: <FaBook size={18} />,
        //             component: 'Lessons',
        //             badge: 12
        //         },
        //         {
        //             id: 4,
        //             name: "الريلز",
        //             icon: <FaVideo size={18} />,
        //             component: 'Reels',
        //             badge: 8
        //         },


        //         {
        //             id: 6,
        //             name: "القوالب",
        //             icon: <FaPalette size={18} />,
        //             component: 'Templates'
        //         }


        //     ]
        // },
        // {
        //     id: 3,
        //     name: "المكتبة",
        //     icon: <FaImages size={18} />,
        //     items: [
        //         {
        //             id: 5,
        //             name: "الميديا",
        //             icon: <FaImages size={18} />,
        //             component: 'Media'
        //         },

        //     ]
        // },
        {
            id: 6,
            name: "المكتبة  الوسائط ",
            icon: <FaPhotoVideo size={18} />,
            items: [
                {
                    id: 5,
                    name: "الكتاب",
                    icon: <FaPhotoVideo size={18} />,
                    component: 'book'
                },

            ]
        },





        // {
        //     id: 4,
        //     name: "الدعم",
        //     icon: <FaHeadset size={18} />,
        //     items: [
        //         {
        //             id: 7,
        //             name: "الدعم الفني",
        //             icon: <FaHeadset size={18} />,
        //             component: 'book',
        //             badge: 3
        //         },
        //         {
        //             id: 8,
        //             name: "طلبات الاسترداد",
        //             icon: <FaMoneyBillWave size={18} />,
        //             component: 'RefundRequests'
        //         },
        //         {
        //             id: 9,
        //             name: "الاشتراكات",
        //             icon: <FaMoneyBillWave size={18} />,
        //             component: 'SubscriptionList'
        //         },
        //         {
        //             id: 10,
        //             name: "الطلاب",
        //             icon: <FaUserFriends size={18} />,
        //             component: 'StudentList'
        //         },
        //         {
        //             id: 11,
        //             name: "التقييمات",
        //             icon: <FaStar size={18} />,
        //             component: 'Reviews'
        //         },
        //         {
        //             id: 12,
        //             name: "المجتمع",
        //             icon: <FaComments size={18} />,
        //             component: 'Feedback'
        //         }
        //     ]
        // },
        // {
        //     id: 5,
        //     name: "الإعدادات",
        //     icon: <FaCog size={18} />,
        //     items: [
        //         {
        //             id: 13,
        //             name: "المستخدمين",
        //             icon: <FaUsers size={18} />,
        //             component: 'Users'
        //         },
        //         {
        //             id: 14,
        //             name: "الإعدادات العامة",
        //             icon: <FaCog size={18} />,
        //             component: 'Settings'
        //         }
        //     ]
        // }
    ]
};