import AxiosInstance from "./AxiosInstance";


const API_URL = "/books/book-parts/";

export const createPart = (bookId, data) =>
    AxiosInstance.post(`${API_URL}`, { ...data, book: bookId });

export const updatePart = (partId, data) =>
    AxiosInstance.put(`${API_URL}${partId}/`, data);

export const deletePart = (partId) =>
    AxiosInstance.delete(`${API_URL}${partId}/`);