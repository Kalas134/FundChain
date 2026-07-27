/**
 * 마이페이지 및 후원/정산 통신 API 모듈
 * (getSponsoredProjects, getTransactionHistory, getSettlementHistory, supportProject 등)
 */
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
 * @param {Object} updateData { nickname, phoneNum, bankName, accountNum }
 */
export const updateMyPageInfo = async (updateData) => {
  const response = await api.put('/mypage/me', updateData);
  return response.data;
};

/**
 * 크리에이터 프로젝트 목록 조회 API
 * GET /api/projects/creator/{creatorId}
 * @param {string} creatorId
 * @returns {Array}
 */
export const getMyProjects = async (creatorId) => {
  const response = await api.get(`/projects/creator/${creatorId}`);

  return response.data.map(project => ({
    projectId: project.projectId,
    imageUrl: project.thumbnailImage,
    createdDate: project.startDate,
    title: project.title,
    description: project.contentHtml || '',
    currentAmount: 0,
    targetAmount: Number(project.targetAmount),
    status: project.status,
    year: new Date(project.startDate).getFullYear(),
    month: new Date(project.startDate).getMonth() + 1
  }));
};

/**
 * 후원한 프로젝트 목록 조회 API
 * GET /api/mypage/sponsored-projects
 */
export const getSponsoredProjects = async () => {
  const response = await api.get('/mypage/sponsored-projects');
  return response.data;
};

/**
 * 거래 및 결제 내역 조회 API
 * GET /api/mypage/transaction-history
 */
export const getTransactionHistory = async () => {
  const response = await api.get('/mypage/transaction-history');
  return response.data;
};

/**
 * 크리에이터 정산 내역 조회 API
 * GET /api/mypage/settlement-history
 */
export const getSettlementHistory = async () => {
  const response = await api.get('/mypage/settlement-history');
  return response.data;
};

/**
 * 프로젝트 후원하기 API
 * POST /api/mypage/support/{projectId}
 */
export const supportProject = async (projectId, amount) => {
  const response = await api.post(`/mypage/support/${projectId}`, { amount });
  return response.data;
};
