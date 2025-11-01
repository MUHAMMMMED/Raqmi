import AxiosInstance from "./AxiosInstance";


const API = "courses/courses";

export const getCourses = () => AxiosInstance.get(`${API}/`);
export const getCourse = (id) => AxiosInstance.get(`${API}/${id}/`);
export const createCourse = (data) => AxiosInstance.post(`${API}/`, data);
export const updateCourse = (id, data) => AxiosInstance.put(`${API}/${id}/`, data);
export const deleteCourse = (id) => AxiosInstance.delete(`${API}/${id}/`);
