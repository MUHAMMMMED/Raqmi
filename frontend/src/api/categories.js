
import AxiosInstance from './AxiosInstance';

const API_URL = "/categories";

// المراحل - CRUD
export const getStages = async () => {
    const response = await AxiosInstance.get(`${API_URL}/stages/`);
    return response.data;
};

export const getStage = async (id) => {
    const response = await AxiosInstance.get(`${API_URL}/stages/${id}/`);
    return response.data;
};

export const createStage = async (stageData) => {
    const response = await AxiosInstance.post(`${API_URL}/stages/`, stageData);
    return response.data;
};

export const updateStage = async (id, stageData) => {
    const response = await AxiosInstance.put(`${API_URL}/stages/${id}/`, stageData);
    return response.data;
};

export const deleteStage = async (id) => {
    const response = await AxiosInstance.delete(`${API_URL}/stages/${id}/`);
    return response.data;
};

// الصفوف - CRUD
export const getGrades = async (params = {}) => {
    const response = await AxiosInstance.get(`${API_URL}/grades/`, { params });
    return response.data;
};

export const getGrade = async (id) => {
    const response = await AxiosInstance.get(`${API_URL}/grades/${id}/`);
    return response.data;
};

export const createGrade = async (gradeData) => {
    const response = await AxiosInstance.post(`${API_URL}/grades/`, gradeData);
    return response.data;
};

export const updateGrade = async (id, gradeData) => {
    const response = await AxiosInstance.put(`${API_URL}/grades/${id}/`, gradeData);
    return response.data;
};

export const deleteGrade = async (id) => {
    const response = await AxiosInstance.delete(`${API_URL}/grades/${id}/`);
    return response.data;
};

// البرامج - CRUD
export const getPrograms = async (params = {}) => {
    const response = await AxiosInstance.get(`${API_URL}/programs/`, { params });
    return response.data;
};

export const getProgram = async (id) => {
    const response = await AxiosInstance.get(`${API_URL}/programs/${id}/`);
    return response.data;
};

export const createProgram = async (programData) => {
    const response = await AxiosInstance.post(`${API_URL}/programs/`, programData);
    return response.data;
};

export const updateProgram = async (id, programData) => {
    const response = await AxiosInstance.put(`${API_URL}/programs/${id}/`, programData);
    return response.data;
};

export const deleteProgram = async (id) => {
    const response = await AxiosInstance.delete(`${API_URL}/programs/${id}/`);
    return response.data;
};

// المواد - CRUD
export const getSubjects = async (params = {}) => {
    const response = await AxiosInstance.get(`${API_URL}/subjects/`, { params });
    return response.data;
};

export const getSubject = async (id) => {
    const response = await AxiosInstance.get(`${API_URL}/subjects/${id}/`);
    return response.data;
};

export const createSubject = async (subjectData) => {
    const response = await AxiosInstance.post(`${API_URL}/subjects/`, subjectData);
    return response.data;
};

export const updateSubject = async (id, subjectData) => {
    const response = await AxiosInstance.put(`${API_URL}/subjects/${id}/`, subjectData);
    return response.data;
};

export const deleteSubject = async (id) => {
    const response = await AxiosInstance.delete(`${API_URL}/subjects/${id}/`);
    return response.data;
};

// العلاقات
export const getStageGrades = async (stageId) => {
    const response = await AxiosInstance.get(`${API_URL}/stages/${stageId}/grades/`);
    return response.data;
};

export const getGradePrograms = async (gradeId) => {
    const response = await AxiosInstance.get(`${API_URL}/grades/${gradeId}/programs/`);
    return response.data;
};

export const getProgramSubjects = async (programId) => {
    const response = await AxiosInstance.get(`${API_URL}/programs/${programId}/subjects/`);
    return response.data;
};