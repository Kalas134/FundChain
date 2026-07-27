import api from '../../../services/api';

/**

* 마이페이지 회원 정보 조회 API
*
* GET /api/mypage/me
  */
  export const getMyPageInfo = async () => {

  const response = await api.get('/mypage/me');

  return response.data;
  };

/**

* 마이페이지 회원 정보 수정 API
*
* PUT /api/mypage/me
*
* @param {Object} updateData
* { nickname, phoneNum, bankName, accountNum }
  */
  export const updateMyPageInfo = async (updateData) => {

  const response = await api.put('/mypage/me', updateData);

  return response.data;
  };

/**

* 크리에이터 프로젝트 목록 조회 API
*
* GET /api/projects/creator/{creatorId}
*
* @param {string} creatorId
* @returns {Array}
  */
  export const getMyProjects = async (creatorId) => {

  const response =
  await api.get(`/projects/creator/${creatorId}`);

  /*

  * 백엔드 ProjectResponse를
  * CreatorProjectsPage에서 사용하는 형태로 변환
  *
  * 중요:
  * 프로젝트 식별자는 id가 아니라 projectId로 통일
    */
    return response.data.map(project => ({

    projectId: project.projectId,

    imageUrl: project.thumbnailImage,

    createdDate: project.startDate,

    title: project.title,

    description: project.contentHtml || '',

    currentAmount: 0, // 추후 실제 후원금액 API 연동

    targetAmount: Number(project.targetAmount),

    status: project.status,

    year: new Date(project.startDate).getFullYear(),

    month: new Date(project.startDate).getMonth() + 1

  }));
  };
