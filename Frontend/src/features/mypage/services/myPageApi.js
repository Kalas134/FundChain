import api from '../../../services/api';

/**
 * 마이페이지 회원 정보 조회 API
 * GET /api/mypage/me
 */
export const getMyPageInfo = async () => {
    const response = await api.get('/mypage/me');
    return response.data;
};

/**
 * 마이페이지 회원 정보 수정 API
 * PUT /api/mypage/me
 * @param {Object} updateData - { nickname, phoneNum, bankName, accountNum }
 */
export const updateMyPageInfo = async (updateData) => {
    const response = await api.put('/mypage/me', updateData);
    return response.data;
};
