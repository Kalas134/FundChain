// src/services/api.js
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore'; // Zustand 스토어 경로

// 1. Axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // 백엔드 Spring Boot 포트 및 API 기본 경로
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Request Interceptor (요청 가로채기)
// 백엔드로 요청을 보내기 직전에 로그인 토큰(JWT)이 있다면 Header에 자동으로 끼워 넣습니다.
api.interceptors.request.use(
    (config) => {
        // Zustand 스토어에서 현재 저장된 토큰을 가져옵니다.
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor (응답 가로채기 - 선택사항이지만 강력 추천)
// 로그인 만료(401 Unauthorized) 등의 에러가 백엔드로부터 넘어왔을 때 전역 처리를 할 수 있습니다.
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 예: 토큰이 만료되었거나 권한이 없는 경우 (401 에러)
        if (error.response && error.response.status === 401) {
            alert('세션이 만료되었습니다. 다시 로그인해 주세요.');

            // Zustand 스토어의 로그아웃 액션을 호출해 토큰을 지우고 로그인 페이지로 이동 처리
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;