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
export default api;