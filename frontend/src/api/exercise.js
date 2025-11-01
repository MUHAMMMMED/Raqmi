import AxiosInstance from "./AxiosInstance";

const API_URL = "/books";

/**
 * تحويل كائن عادي إلى FormData مع دعم الكائنات المتداخلة (مثل options)
 */
const buildFormData = (obj) => {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            // أرسل كـ string فارغ أو لا ترسله
            formData.append(key, '');
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            // كائن متداخل → حوّله إلى JSON string
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });

    return formData;
};

export const createExercise = (data) => {


    const formData = buildFormData(data);

    return AxiosInstance.post(`${API_URL}/exercises/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateExercise = (id, data) => {


    const formData = buildFormData(data);

    return AxiosInstance.put(`${API_URL}/exercises/${id}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteExercise = (id) => {

    return AxiosInstance.delete(`${API_URL}/exercises/${id}/`);
};