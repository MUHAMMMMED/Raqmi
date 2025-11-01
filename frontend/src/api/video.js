import AxiosInstance from "./AxiosInstance";


const API_URL = "/video/";

export const generateVideo = async (lessonId) => {
    const res = await AxiosInstance.post(`${API_URL}generate/`, { lesson_id: lessonId });
    return res.data;
};

export const checkVideoProgress = async (taskId) => {
    const res = await AxiosInstance.get(`${API_URL}progress/${taskId}/`);
    return res.data;
};