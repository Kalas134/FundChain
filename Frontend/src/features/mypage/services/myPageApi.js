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

/**
 * 크리에이터 프로젝트 목록 조회 API
 * GET /api/mypage/myprojects ==> 기존 충영씨가 만든것
 * GET /api/projects/creator/{creatorId}
 */
export const getMyProjects = async (creatorId) => {
    const response = await api.get(`/projects/creator/${creatorId}`);

    return response.data.map(project => ({
        id: project.projectId,
        imageUrl: project.thumbnailImage,
        createdDate: project.startDate,
        title: project.title,
        description: project.contentHtml || '',
        currentAmount: 0, // 임시값 알맞는 값으로 전환 바람
        targetAmount: Number(project.targetAmount),
        status: project.status,
        year: new Date(project.startDate).getFullYear(),
        month: new Date(project.startDate).getMonth() + 1
    }));
};