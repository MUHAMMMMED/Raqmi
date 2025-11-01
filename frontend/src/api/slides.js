import AxiosInstance from "./AxiosInstance";

const API = "slides/slides";

export const getSlides = (lessonId) => AxiosInstance.get(`${API}/?lesson=${lessonId}`);
export const getSlide = (id) => AxiosInstance.get(`${API}/${id}/`);
export const createSlide = (data) => AxiosInstance.post(API, data);
export const updateSlide = (id, data) => AxiosInstance.put(`${API}/${id}/`, data);
export const deleteSlide = (id) => AxiosInstance.delete(`${API}/${id}/`);

export const updateSlideOrder = (slides) =>
    AxiosInstance.post(`${API}update-order/`, { slides });





