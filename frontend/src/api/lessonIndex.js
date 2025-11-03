
import AxiosInstance from './AxiosInstance';

const API_URL = "/books/lesson-index/";

export const getLessonIndex = async (params = {}) => {
    const response = await AxiosInstance.get(API_URL, { params });
    return response.data;
};

export const getLessonIndexItem = async (id) => {
    const response = await AxiosInstance.get(`${API_URL}${id}/`);
    return response.data;
};

export const createLessonIndex = async (lessonData) => {
    const response = await AxiosInstance.post(API_URL, lessonData);
    return response.data;
};

export const updateLessonIndex = async (id, lessonData) => {
    const response = await AxiosInstance.put(`${API_URL}${id}/`, lessonData);
    return response.data;
};

export const deleteLessonIndex = async (id) => {
    const response = await AxiosInstance.delete(`${API_URL}${id}/`);
    return response.data;
};

export const assignAiLesson = async (lessonIndexId, aiLessonId) => {
    const response = await AxiosInstance.post(`${API_URL}${lessonIndexId}/assign_ai_lesson/`, {
        ai_lesson_id: aiLessonId
    });
    return response.data;
};

export const getLessonIndexFilters = async () => {
    const response = await AxiosInstance.get(`${API_URL}filters/`);
    return response.data;
};