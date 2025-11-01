import AxiosInstance from "./AxiosInstance";
const API_URL = "/books";
export const getBooks = async () => {
    const res = await AxiosInstance.get(`${API_URL}/books/`);
    return res.data;
};
export const getBook = async (id) => {
    const res = await AxiosInstance.get(`${API_URL}/books/${id}/`);
    return res.data;
};
// رفع كتاب جديد
export const uploadBook = async (formData) => {

    const res = await AxiosInstance.post(`${API_URL}/books/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const getBookLesson = async (id) => {
    const response = await AxiosInstance.get(`${API_URL}/lessons/${id}/`);
    return response.data;
};






export const createBlock = (data) => {
    console.log("POST /blocks/ - Sending:", Object.fromEntries(data));
    return AxiosInstance.post(`${API_URL}/blocks/`, data);
};

export const updateBlock = (id, data) => {
    console.log(`PUT /blocks/${id}/ - Sending:`, Object.fromEntries(data));
    return AxiosInstance.put(`${API_URL}/blocks/${id}/`, data);
};

export const deleteBlock = (id) => {
    console.log(`DELETE /blocks/${id}/`);
    return AxiosInstance.delete(`${API_URL}/blocks/${id}/`);
};




// -------- Reels --------
export const getReels = async () => {
    const res = await AxiosInstance.get(`${API_URL}/reel/`);
    return res.data;
};

export const createReel = async (formData) => {
    const res = await AxiosInstance.post(`${API_URL}/reel/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const updateReel = async (id, formData) => {
    const res = await AxiosInstance.put(`${API_URL}/reel/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const deleteReel = async (id) => {
    const res = await AxiosInstance.delete(`${API_URL}/reel/${id}/`);
    return res.data;
};
