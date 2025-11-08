import AxiosInstance from "./AxiosInstance";

const API = "slides/slides";

export const getSlides = (id) => AxiosInstance.get(`${API}/?content=${id}`);
export const getSlide = (id) => AxiosInstance.get(`${API}/${id}/`);
export const createSlide = (data) => AxiosInstance.post(`${API}/`, data);
export const updateSlide = (id, data) => AxiosInstance.put(`${API}/${id}/`, data);
export const deleteSlide = (id) => AxiosInstance.delete(`${API}/${id}/`);

export const updateSlideOrder = (slides) =>
    AxiosInstance.post(`${API}/update-order/`, slides);

export const duplicateSlide = (slideId) =>
    AxiosInstance.post(`${API}/${slideId}/duplicate/`);

