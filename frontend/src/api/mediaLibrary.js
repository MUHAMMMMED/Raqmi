import AxiosInstance from "./AxiosInstance";


export const getMedia = (params) => {
    return AxiosInstance.get('/media-library/media/', { params });
};

export const uploadMedia = (formData) => {
    return AxiosInstance.post('/media-library/media/upload/', formData);
};