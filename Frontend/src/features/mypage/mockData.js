/**
 * 마이페이지 후원한 프로젝트 목록에서 사용하는 가상 테스트 데이터 (Mock Data)
 * 
 * @type {Array<Object>}
 * @property {number} id - 프로젝트 고유 식별자 ID
 * @property {string} imageUrl - 프로젝트 대표 썸네일 이미지 URL
 * @property {string} sponsoredDate - 후원 신청 날짜 표시 문자열
 * @property {string} title - 프로젝트 제목
 * @property {string} description - 후원한 선물/리워드 옵션 상세 내용
 * @property {string} price - 결제 및 후원 금액
 * @property {string} deliveryStatus - 배송 진행 상태 정보
 * @property {'success' | 'reserved' | 'canceled'} status - 후원 진행 상태 ('success': 후원 성공, 'reserved': 후원 예약, 'canceled': 후원 무산)
 * @property {string} category - 후원 카테고리 정보
 * @property {number} year - 필터링용 후원 연도
 * @property {number} month - 필터링용 후원 월
 */
export const mockProjects = [
    {
        id: 1,
        imageUrl: "https://via.placeholder.com/150", // 프로젝트 썸네일 이미지
        sponsoredDate: "2022. 01. 29 후원",
        title: "행운을 시험해 보세요! 누구든지 즐길 수 있는 <나나>",
        description: "<나나 카드게임 단품>, 배송비 포함 (x1)",
        price: "12,000원",
        deliveryStatus: "2022. 07. 20 선물 전달 완료",
        status: "success", // 후원 성공 상태
        category: "후원 성공 5",
        year: 2022,
        month: 1
    },
    // 필터링 및 탭 동작 검증용 가상 데이터 예시 (후원 예약)
    {
        id: 2,
        imageUrl: "https://via.placeholder.com/150",
        sponsoredDate: "2023. 05. 10 후원",
        title: "상상력을 자극하는 보드게임 프로젝트",
        description: "기본 세트 (x1)",
        price: "25,000원",
        deliveryStatus: "결제 대기 중",
        status: "reserved", // 후원 예약 상태
        category: "후원 예약",
        year: 2023,
        month: 5
    },
    // 필터링 및 탭 동작 검증용 가상 데이터 예시 (후원 무산)
    {
        id: 3,
        imageUrl: "https://via.placeholder.com/150",
        sponsoredDate: "2021. 11. 15 후원",
        title: "친환경 다이어리 & 캘린더 세트",
        description: "얼리버드 세트 (x1)",
        price: "18,000원",
        deliveryStatus: "프로젝트 무산되었습니다.",
        status: "canceled", // 후원 무산 상태
        category: "후원 무산 1",
        year: 2021,
        month: 11
    }
];