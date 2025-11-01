import AxiosInstance from "./AxiosInstance";


const API = "slides/slide-blocks";

export const getBlocks = (slideId) => AxiosInstance.get(`${API}/?slide=${slideId}`);
export const createBlock = (data) => AxiosInstance.post(API, data);
export const updateBlock = (id, data) => AxiosInstance.put(`${API}/${id}/`, data);
export const deleteBlock = (id) => AxiosInstance.delete(`${API}/${id}/`);


