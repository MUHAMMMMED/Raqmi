import AxiosInstance from "./AxiosInstance";

const API = "history/";

export const getHistory = (slideId) => AxiosInstance.get(`${API}history/?slide=${slideId}`);