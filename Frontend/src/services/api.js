// src/services/api.js
import axios from 'axios';

// 백엔드 통신 기본 인스턴스
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

// 요청 인터셉터: localStorage에 저장된 토큰이 있으면 Authorization 헤더에 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;