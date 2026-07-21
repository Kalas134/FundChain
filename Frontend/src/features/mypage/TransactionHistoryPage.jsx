import React, { useState, useMemo } from 'react';

/**
 * [DB Schema 참고]
 * 1. Users: USER_ID, USER_ROLE, NICKNAME, USERNAME, BIRTHDATE, PHONE_NUM, EMAIL, BANK_NAME, ACCOUNT_NUM
 * 2. Projects: PROJECT_ID, CREATOR_ID, TITLE, THUMBNAIL_IMAGE, TARGET_AMOUNT, START_DATE, END_DATE, STATUS ('PREPARING', 'ONGOING', 'SUCCESS', 'FAILED')
 * 3. SupportHistory: SUPPORT_ID, PROJECT_ID, USER_ID, AMOUNT, SUPPORTED_AT
 */

// SupportHistory, Projects, Users 테이블 JOIN 데이터 구조를 모방한 Mock 데이터셋
const MOCK_TRANSACTION_HISTORY = [
    {
        supportId: 1001,
        projectId: 1,
        userId: "user_dongguri",
        amount: 50000,
        supportedAt: "2026-07-15T14:30:00",
        // Projects 테이블 JOIN 정보
        title: "친환경 블록체인 기반 자원 순환 펀딩 프로젝트",
        thumbnailImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80",
        targetAmount: 5000000,
        currentAmount: 6250000,
        startDate: "2026-07-01T00:00:00",
        endDate: "2026-08-01T23:59:59",
        status: "ONGOING",
        // Users (Creator) 테이블 JOIN 정보
        creatorId: "creator_ecolife",
        creatorNickname: "에코라이프 Labs",
        bankName: "신한은행",
        accountNum: "110-123-456789"
    },
    {
        supportId: 1002,
        projectId: 2,
        userId: "user_dongguri",
        amount: 120000,
        supportedAt: "2026-06-20T09:15:00",
        title: "행운을 시험해 보세요! 누구든지 즐길 수 있는 <나나>",
        thumbnailImage: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&auto=format&fit=crop&q=80",
        targetAmount: 10000000,
        currentAmount: 15400000,
        startDate: "2026-05-15T00:00:00",
        endDate: "2026-06-18T23:59:59",
        status: "SUCCESS",
        creatorId: "creator_boardgames",
        creatorNickname: "동구리 보드게임즈",
        bankName: "국민은행",
        accountNum: "456-789-012345"
    },
    {
        supportId: 1003,
        projectId: 3,
        userId: "user_dongguri",
        amount: 30000,
        supportedAt: "2026-05-04T18:45:00",
        title: "독립 창작자를 위한 스마트 크라우드 펀딩 키트",
        thumbnailImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&auto=format&fit=crop&q=80",
        targetAmount: 20000000,
        currentAmount: 3400000,
        startDate: "2026-04-01T00:00:00",
        endDate: "2026-05-01T23:59:59",
        status: "FAILED",
        creatorId: "creator_smartkit",
        creatorNickname: "스마트킷 스튜디오",
        bankName: "카카오뱅크",
        accountNum: "3333-01-234567"
    },
    {
        supportId: 1004,
        projectId: 4,
        userId: "user_dongguri",
        amount: 85000,
        supportedAt: "2026-04-12T11:00:00",
        title: "제로웨이스트 다회용 리사이클링 패브릭 가방",
        thumbnailImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80",
        targetAmount: 3000000,
        currentAmount: 4200000,
        startDate: "2026-03-10T00:00:00",
        endDate: "2026-04-10T23:59:59",
        status: "SUCCESS",
        creatorId: "creator_greenbag",
        creatorNickname: "그린어스 패브릭",
        bankName: "하나은행",
        accountNum: "987-654-321098"
    },
    {
        supportId: 1005,
        projectId: 5,
        userId: "user_dongguri",
        amount: 150000,
        supportedAt: "2026-07-20T16:20:00",
        title: "차세대 Web3 펀딩체인 스마트 컨트랙트 에디션",
        thumbnailImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&auto=format&fit=crop&q=80",
        targetAmount: 50000000,
        currentAmount: 12000000,
        startDate: "2026-08-01T00:00:00",
        endDate: "2026-09-01T23:59:59",
        status: "PREPARING",
        creatorId: "creator_fundchain",
        creatorNickname: "FundChain 개발팀",
        bankName: "우리은행",
        accountNum: "1002-987-654321"
    }
];

/**
 * 프로젝트 상태별 스타일 뱃지 맵
 */
const STATUS_CONFIG = {
    ALL: { label: '전체', badgeClass: '' },
    ONGOING: { label: '진행중', badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
    SUCCESS: { label: '펀딩 성공', badgeClass: 'bg-indigo-50 text-indigo-600 border border-indigo-200' },
    FAILED: { label: '펀딩 무산', badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200' },
    PREPARING: { label: '준비중', badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200' },
};

/**
 * 숫자 통화(원) 포맷팅 헬퍼 함수
 * @param {number} val - 금액 숫자
 */
const formatCurrency = (val) => {
    return new Intl.NumberFormat('ko-KR').format(val || 0) + '원';
};

/**
 * 날짜 포맷팅 헬퍼 함수
 * @param {string} dateStr - ISO 날짜 문자열
 */
const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/**
 * 마이페이지 - 후원/거래 내역 컴포넌트 (TransactionHistoryPage)
 * Users, Projects, SupportHistory DB 테이블 구조에 맞춘 UI 디자인
 */
function TransactionHistoryPage() {
    // 검색어 상태 (프로젝트 제목 또는 창작자 닉네임)
    const [searchTerm, setSearchTerm] = useState('');
    // 상태 필터 탭 ('ALL', 'ONGOING', 'SUCCESS', 'FAILED', 'PREPARING')
    const [statusFilter, setStatusFilter] = useState('ALL');
    // 정렬 방식 상태 ('LATEST', 'OLDEST', 'HIGH_AMOUNT', 'LOW_AMOUNT')
    const [sortBy, setSortBy] = useState('LATEST');
    // 선택된 영수증 모달 데이터 상태
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    // 1. 요약 통계 계산
    const stats = useMemo(() => {
        const totalAmount = MOCK_TRANSACTION_HISTORY.reduce((acc, curr) => acc + curr.amount, 0);
        const totalCount = MOCK_TRANSACTION_HISTORY.length;
        const ongoingCount = MOCK_TRANSACTION_HISTORY.filter(item => item.status === 'ONGOING').length;
        const successCount = MOCK_TRANSACTION_HISTORY.filter(item => item.status === 'SUCCESS').length;

        return { totalAmount, totalCount, ongoingCount, successCount };
    }, []);

    // 2. 필터링 및 정렬 처리
    const filteredHistory = useMemo(() => {
        return MOCK_TRANSACTION_HISTORY.filter((item) => {
            // 탭 필터링
            if (statusFilter !== 'ALL' && item.status !== statusFilter) {
                return false;
            }
            // 검색어 필터링 (프로젝트 제목 또는 창작자 닉네임)
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const matchTitle = item.title.toLowerCase().includes(term);
                const matchCreator = item.creatorNickname.toLowerCase().includes(term);
                return matchTitle || matchCreator;
            }
            return true;
        }).sort((a, b) => {
            if (sortBy === 'LATEST') return new Date(b.supportedAt) - new Date(a.supportedAt);
            if (sortBy === 'OLDEST') return new Date(a.supportedAt) - new Date(b.supportedAt);
            if (sortBy === 'HIGH_AMOUNT') return b.amount - a.amount;
            if (sortBy === 'LOW_AMOUNT') return a.amount - b.amount;
            return 0;
        });
    }, [searchTerm, statusFilter, sortBy]);

    return (
        <div className="w-full max-w-[1080px] mx-auto px-4 py-8 font-sans text-tcolor">
            {/* 페이지 타이틀 */}
            <div className="text-left mb-8">
                <h1 className="text-3xl font-bold text-thcolor mb-2">후원 및 거래 내역</h1>
                <p className="text-sm text-gray-500">
                    회원님이 참여하신 펀딩 프로젝트의 후원 상세 내역(SupportHistory)을 확인하실 수 있습니다.
                </p>
            </div>

            {/* 1. 요약 통계 카운터 카드 영역 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-left">
                    <p className="text-xs font-medium text-gray-400 mb-1">총 후원 금액</p>
                    <p className="text-xl font-bold text-funding">{formatCurrency(stats.totalAmount)}</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-left">
                    <p className="text-xs font-medium text-gray-400 mb-1">총 후원 건수</p>
                    <p className="text-xl font-bold text-gray-800">{stats.totalCount}건</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-left">
                    <p className="text-xs font-medium text-gray-400 mb-1">진행중 프로젝트</p>
                    <p className="text-xl font-bold text-emerald-600">{stats.ongoingCount}건</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-left">
                    <p className="text-xs font-medium text-gray-400 mb-1">펀딩 성공 프로젝트</p>
                    <p className="text-xl font-bold text-indigo-600">{stats.successCount}건</p>
                </div>
            </div>

            {/* 2. 컨트롤 바 (상태 탭, 검색 및 정렬) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                {/* 상태 필터 탭 */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {Object.keys(STATUS_CONFIG).map((statusKey) => {
                        const isActive = statusFilter === statusKey;
                        const label = STATUS_CONFIG[statusKey].label;
                        return (
                            <button
                                key={statusKey}
                                onClick={() => setStatusFilter(statusKey)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${isActive
                                        ? 'bg-funding text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* 검색창 & 정렬 선택 */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="프로젝트 / 창작자 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-funding transition-colors"
                        />
                        <svg
                            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-funding cursor-pointer"
                    >
                        <option value="LATEST">최신 후원순</option>
                        <option value="OLDEST">과거 후원순</option>
                        <option value="HIGH_AMOUNT">후원금액 높은순</option>
                        <option value="LOW_AMOUNT">후원금액 낮은순</option>
                    </select>
                </div>
            </div>

            {/* 3. 후원 내역 카드 리스트 */}
            <div className="flex flex-col gap-4">
                {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => {
                        const progressPercent = Math.min(
                            100,
                            Math.round((item.currentAmount / item.targetAmount) * 100)
                        );
                        const statusInfo = STATUS_CONFIG[item.status] || { label: item.status, badgeClass: '' };

                        return (
                            <div
                                key={item.supportId}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left"
                            >
                                {/* 카드 헤더 (후원번호 & 일시 & 상태) */}
                                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/50 text-xs">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-500">#SUP-{item.supportId}</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-gray-500">후원 일시: {formatDate(item.supportedAt)}</span>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${statusInfo.badgeClass}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>

                                {/* 카드 본문 (이미지 + 정보 + 금액) */}
                                <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    {/* 썸네일 & 프로젝트 상세 */}
                                    <div className="flex items-start gap-4 flex-1">
                                        <img
                                            src={item.thumbnailImage}
                                            alt={item.title}
                                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                                        />
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-semibold text-accent mb-1">
                                                창작자: {item.creatorNickname}
                                            </span>
                                            <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                                                {item.title}
                                            </h3>

                                            {/* 달성률 프로그레스 바 */}
                                            <div className="w-full max-w-sm mt-1">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>목표 {formatCurrency(item.targetAmount)}</span>
                                                    <span className="font-bold text-funding">{progressPercent}% 달성</span>
                                                </div>
                                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-accent h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 후원 금액 & 버튼 그룹 */}
                                    <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                                        <div className="text-right">
                                            <span className="text-xs text-gray-400 block mb-0.5">내가 후원한 금액</span>
                                            <span className="text-xl font-bold text-funding">
                                                {formatCurrency(item.amount)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 w-full md:w-auto">
                                            <button
                                                onClick={() => setSelectedReceipt(item)}
                                                className="flex-1 md:flex-initial px-4 py-2 border border-funding text-funding rounded-lg text-xs font-semibold hover:bg-indigo-50 transition-colors"
                                            >
                                                상세 영수증
                                            </button>
                                            <button
                                                onClick={() => alert(`${item.creatorNickname} 창작자에게 문의하기 페이지로 이동합니다.`)}
                                                className="flex-1 md:flex-initial px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                                            >
                                                창작자 문의
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    /* 검색/필터 결과가 없을 경우 */
                    <div className="bg-white border border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-medium">조건에 해당되는 후원 내역이 존재하지 않습니다.</p>
                    </div>
                )}
            </div>

            {/* 4. 후원 상세 영수증 Modal */}
            {selectedReceipt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-left border border-gray-100">
                        {/* 모달 헤더 */}
                        <div className="bg-funding text-white px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">후원 내역 영수증</h3>
                                <p className="text-xs text-indigo-100">SupportHistory Ref: #{selectedReceipt.supportId}</p>
                            </div>
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
                            >
                                ✕
                            </button>
                        </div>

                        {/* 모달 본문 */}
                        <div className="p-6 space-y-4 text-xs text-gray-700">
                            <div className="pb-3 border-b border-gray-100">
                                <span className="text-gray-400 block mb-1">프로젝트명 (Projects.TITLE)</span>
                                <p className="font-bold text-sm text-gray-900 leading-tight">{selectedReceipt.title}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-100">
                                <div>
                                    <span className="text-gray-400 block mb-0.5">후원자 ID (Users)</span>
                                    <p className="font-semibold text-gray-800">{selectedReceipt.userId}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">창작자 (Creator)</span>
                                    <p className="font-semibold text-gray-800">{selectedReceipt.creatorNickname}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-100">
                                <div>
                                    <span className="text-gray-400 block mb-0.5">후원 승인 일시</span>
                                    <p className="font-semibold text-gray-800">{formatDate(selectedReceipt.supportedAt)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">프로젝트 상태</span>
                                    <p className="font-semibold text-funding">{STATUS_CONFIG[selectedReceipt.status]?.label}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">창작자 정산 은행</span>
                                    <span className="font-semibold">{selectedReceipt.bankName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">창작자 계좌번호</span>
                                    <span className="font-semibold">{selectedReceipt.accountNum}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200 text-sm">
                                    <span className="font-bold text-gray-900">최종 후원 결제 금액</span>
                                    <span className="font-bold text-funding text-base">
                                        {formatCurrency(selectedReceipt.amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 모달 푸터 */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-100"
                            >
                                영수증 인쇄
                            </button>
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="px-4 py-2 bg-funding text-white rounded-lg text-xs font-semibold hover:bg-indigo-600"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransactionHistoryPage;