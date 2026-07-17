export const mockProjects = [
    {
        id: 1,
        imageUrl: "https://via.placeholder.com/150", // 나나 이미지 대체용
        sponsoredDate: "2022. 01. 29 후원",
        title: "행운을 시험해 보세요! 누구든지 즐길 수 있는 <나나>",
        description: "<나나 카드게임 단품>, 배송비 포함 (x1)",
        price: "12,000원",
        deliveryStatus: "2022. 07. 20 선물 전달 완료",
        status: "success", // 후원 성공
        category: "후원 성공 5",
        year: 2022,
        month: 1
    },
    // 필터링 및 탭 작동 확인을 위한 추가 데이터 예시
    {
        id: 2,
        imageUrl: "https://via.placeholder.com/150",
        sponsoredDate: "2023. 05. 10 후원",
        title: "상상력을 자극하는 보드게임 프로젝트",
        description: "기본 세트 (x1)",
        price: "25,000원",
        deliveryStatus: "결제 대기 중",
        status: "reserved", // 후원 예약
        category: "후원 예약",
        year: 2023,
        month: 5
    },
    {
        id: 3,
        imageUrl: "https://via.placeholder.com/150",
        sponsoredDate: "2021. 11. 15 후원",
        title: "친환경 다이어리 & 캘린더 세트",
        description: "얼리버드 세트 (x1)",
        price: "18,000원",
        deliveryStatus: "프로젝트 무산되었습니다.",
        status: "canceled", // 후원 무산
        category: "후원 무산 1",
        year: 2021,
        month: 11
    }
];