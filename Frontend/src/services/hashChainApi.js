// src/services/hashChainApi.js
import api from './api';

export const hashChainApi = {
    // 거래(후원) 기록
    createTransaction: async (projectId, userId, amount) => {
        const response = await api.post('/transactions', null, {
            params: { projectId, userId, amount }
        });
        return response.data;
    },

    // 해시체인 무결성 검증
    verifyHashChain: async () => {
        const response = await api.get('/transactions/verify');
        return response.data;
    }
};