import AxiosInstance from './AxiosInstance';



const API_URL = "/flashcard/cards/";


export const getCardsByLesson = async (lessonId) => {
    const response = await AxiosInstance.get(`${API_URL}?lesson=${lessonId}`);
    return response.data;
};



export const getCardsByBlock = async (blockId) => {
    const response = await AxiosInstance.get(`${API_URL}?block=${blockId}`);
    return response.data;
};





export const getCard = async (id) => {
    const response = await AxiosInstance.get(`${API_URL}/${id}/`);
    return response.data;
};




export const createCard = async (data) => {
    const response = await AxiosInstance.post(API_URL, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateCard = async (id, data) => {
    const response = await AxiosInstance.put(`${API_URL}${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteCard = async (id) => {
    const response = await AxiosInstance.delete(`${API_URL}/${id}/`);
    return response.data;
};