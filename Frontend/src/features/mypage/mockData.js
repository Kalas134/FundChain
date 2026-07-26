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

/**
 * 창작자의 내 프로젝트 관리 화면에서 사용하는 가상 테스트 데이터 (Mock Data)
 * status: 'PREPARING' (준비중) | 'ONGOING' (진행중) | 'SUCCESS' (성공) | 'FAILED' (실패)
 */
export const mockCreatorProjects = [
    {
        id: 101,
        // 수정: 임시 이미지 파일을 public 폴더에서 불러옴
        imageUrl: "/images/projects/101/project-101.jpg",
        createdDate: "2023. 04. 15 생성",
        title: "스마트 홈 IoT 가젯 프로젝트",
        description: "쉽고 빠르게 구축하는 차세대 스마트홈 허브 및 센서 패키지",
        targetAmount: 10000000,
        currentAmount: 12500000,
        status: "ONGOING",
        year: 2023,
        month: 4
    },
    {
        id: 102,
        // 수정
        imageUrl: "/images/projects/102/project-102.jpg",
        createdDate: "2023. 01. 10 생성",
        title: "친환경 비건 텀블러 & 오가닉 백",
        description: "지구를 살리는 지속 가능한 친환경 텀블러 디자인 프로젝트",
        targetAmount: 5000000,
        currentAmount: 6200000,
        status: "SUCCESS",
        year: 2023,
        month: 1
    },
    {
        id: 103,
        // 수정
        imageUrl: "/images/projects/103/project-103.jpg",
        createdDate: "2023. 06. 01 생성",
        title: "초고음질 블루투스 수제 헤드폰",
        description: "장인의 손길로 제작하는 최고급 원목 하우징 수제 헤드폰",
        targetAmount: 20000000,
        currentAmount: 3500000,
        status: "PREPARING",
        year: 2023,
        month: 6
    },
    {
        id: 104,
        // 수정
        imageUrl: "/images/projects/104/project-104.jpg",
        createdDate: "2022. 09. 12 생성",
        title: "아날로그 필름 감성 미니 카메라",
        description: "포켓 사이즈로 즐기는 독창적인 레트로 필름 카메라",
        targetAmount: 8000000,
        currentAmount: 2400000,
        status: "FAILED",
        year: 2022,
        month: 9
    }
];