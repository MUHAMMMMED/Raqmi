

import AxiosInstance from "./AxiosInstance";


export const getLessonsByCourse = async (courseId) => {
    const response = await AxiosInstance.get(`lessons/lessons/?course=${courseId}`)

    return response.data;
};

export const getLesson = async (id) => {
    const response = await AxiosInstance.get(`/lessons/lessons/${id}/`);
    return response.data;
};

export const createLesson = async (lessonData) => {
    const response = await AxiosInstance.post('/lessons/lessons/', lessonData);
    return response.data;
};

export const updateLesson = async (id, lessonData) => {
    const response = await AxiosInstance.put(`/lessons/${id}/`, lessonData);
    return response.data;
};

export const deleteLesson = async (id) => {
    const response = await AxiosInstance.delete(`/lessons/lessons/${id}/`);
    return response.data;
};