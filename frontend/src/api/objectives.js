import AxiosInstance from "./AxiosInstance";


const API_URL = "/books";

// الحصول على جميع الأهداف التعليمية للبلوك
export const getBlockObjectives = async (blockId) => {
    const res = await AxiosInstance.get(`${API_URL}/objectives/?block=${blockId}`);
    return res.data;
};

// الحصول على هدف تعليمي محدد
export const getObjective = async (id) => {
    const res = await AxiosInstance.get(`${API_URL}/objectives/${id}/`);
    return res.data;
};

// إنشاء هدف تعليمي جديد
export const createObjective = async (data) => {
    console.log("POST /objectives/ - Sending:", data);
    const res = await AxiosInstance.post(`${API_URL}/objectives/`, data);
    return res.data;
};

// تحديث هدف تعليمي
export const updateObjective = async (id, data) => {
    console.log(`PUT /objectives/${id}/ - Sending:`, data);
    const res = await AxiosInstance.put(`${API_URL}/objectives/${id}/`, data);
    return res.data;
};

// حذف هدف تعليمي
export const deleteObjective = async (id) => {
    console.log(`DELETE /objectives/${id}/`);
    const res = await AxiosInstance.delete(`${API_URL}/objectives/${id}/`);
    return res.data;
};