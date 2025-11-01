
import AxiosInstance from './AxiosInstance';

const API_URL = "/reels";

// الحصول على جميع الريلز الخاصة بدرس معين
export const getReelsByLesson = async (lessonId) => {
    try {
        const response = await AxiosInstance.get(`${API_URL}/reels/by-lesson/${lessonId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reels by lesson:', error);
        throw error;
    }
};

// الحصول على ريل بواسطة ID
export const getReel = async (reelId) => {
    try {
        const response = await AxiosInstance.get(`${API_URL}/reels/${reelId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reel:', error);
        throw error;
    }
};

// إنشاء ريل جديد
export const createReel = async (reelData) => {
    try {
        const response = await AxiosInstance.post(`${API_URL}/reels/`, reelData);
        return response.data;
    } catch (error) {
        console.error('Error creating reel:', error);
        throw error;
    }
};

// تحديث ريل موجود
export const updateReel = async (reelId, reelData) => {
    try {
        const response = await AxiosInstance.put(`${API_URL}/reels/${reelId}/`, reelData);
        return response.data;
    } catch (error) {
        console.error('Error updating reel:', error);
        throw error;
    }
};

// حذف ريل
export const deleteReel = async (reelId) => {
    try {
        const response = await AxiosInstance.delete(`${API_URL}/reels/${reelId}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting reel:', error);
        throw error;
    }
};

// الحصول على جميع القوالب
export const getReelTemplates = async () => {
    try {
        const response = await AxiosInstance.get(`${API_URL}/reel-templates/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reel templates:', error);
        throw error;
    }
};