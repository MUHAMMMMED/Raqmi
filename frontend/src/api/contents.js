import AxiosInstance from "./AxiosInstance";

const API = '/slides/contents/';

export const getContentsByLesson = async (lessonId) => {
    const response = await AxiosInstance.get(`${API}?lesson=${lessonId}`);
    return response.data;
};

export const getContent = async (id) => {
    const response = await AxiosInstance.get(`${API}${id}/`);
    return response.data;
};

export const createContent = async (data) => {
    const response = await AxiosInstance.post(API, data);
    return response.data;
};

export const updateContent = async (id, data) => {
    const response = await AxiosInstance.patch(`${API}${id}/`, data);
    return response.data;
};

export const deleteContent = async (id) => {
    const response = await AxiosInstance.delete(`${API}${id}/`);
    return response.data;
};