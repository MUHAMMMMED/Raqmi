
import axios from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import Config from './config';

const baseURL = `${Config.baseURL}/api`;

let accessToken = localStorage.getItem('access_token');
let refreshToken = localStorage.getItem('refresh_token');

const AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
});

AxiosInstance.interceptors.request.use(async (req) => {
    if (accessToken) {
        req.headers.Authorization = `Bearer ${accessToken}`;
        try {
            const user = jwtDecode(accessToken);
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
            if (!isExpired) return req;

            // توكن منتهي، نطلب واحد جديد
            const resp = await axios.post(`${baseURL}/Users/token/refresh/`, {
                refresh: refreshToken,
            });

            const newAccessToken = resp.data.access;
            localStorage.setItem('access_token', newAccessToken);
            req.headers.Authorization = `Bearer ${newAccessToken}`;
            return req;
        } catch (error) {
            console.error('Token decoding or refresh failed:', error);
            return Promise.reject(error);
        }
    } else {
        req.headers.Authorization = "";
        return req;
    }
});

export default AxiosInstance;