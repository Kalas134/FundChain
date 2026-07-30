import React, { useState, useEffect, useMemo } from 'react';
import { getTransactionHistory } from './services/myPageApi';

const MOCK_TRANSACTION_HISTORY = [
    {
        supportId: 1001,
        projectId: 1,
        userId: "user_dongguri",
        amount: 50000,
        supportedAt: "2026-07-15",
        title: "친환경 블록체인 기반 자원 순환 펀딩 프로젝트",
        thumbnailImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80",
        targetAmount: 5000000,
        currentAmount: 6250000,
        startDate: "2026-07-01",
        endDate: "2026-08-01",
        status: "ONGOING",
        creatorId: "creator_ecolife",
        creatorNickname: "에코라이프 Labs",
        bankName: "신한카드",
        accountNum: "110-123-456789"
    },
    {
        supportId: 1002,
        projectId: 2,
        userId: "user_dongguri",
        amount: 120000,
        supportedAt: "2026-06-20",
        title: "행운을 시험해 보세요! 누구든지 즐길 수 있는 <나나>",
        thumbnailImage: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&auto=format&fit=crop&q=80",
        targetAmount: 10000000,
        currentAmount: 15400000,
        startDate: "2026-05-15",
        endDate: "2026-06-18",
        status: "SUCCESS",
        creatorId: "creator_boardgames",
        creatorNickname: "동구리 보드게임즈",
        bankName: "KB국민카드",
        accountNum: "456-789-012345"
    }
];

const STATUS_CONFIG = {
    ALL: { label: '전체', badgeClass: '' },
    ONGOING: { label: '진행중', badgeClass: 'bg-blue-100/70 text-blue-800 border border-blue-300' },
    SUCCESS: { label: '결제 완료', badgeClass: 'bg-accent/15 text-accent font-bold border border-accent/40' },
    FAILED: { label: '환불 완료', badgeClass: 'bg-warning/15 text-warning font-bold border border-warning/40' },
};

const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val || 0) + '원';

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

const getDateGroupKey = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${days[d.getDay()]})`;
};

function TransactionHistoryPage() {
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('LATEST');
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getTransactionHistory();
            if (Array.isArray(data)) {
                setHistoryList(data);
            } else {
                setHistoryList([]);
            }
        } catch (err) {
            console.error("거래 내역 조회 실패:", err);
            const msg = err.response?.data?.message || err.message || "거래 내역을 불러오지 못했습니다. 로그인 상태를 확인해 주세요.";
            setError(msg);
            setHistoryList([]);
        } finally {
            setLoading(false);
        }
    };

    // 백엔드 결제/거래 내역 API(getTransactionHistory) 연동
    useEffect(() => {
        fetchTransactions();
    }, []);

    const stats = useMemo(() => {
        const totalAmount = historyList.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const totalCount = historyList.length;
        const refundAmount = historyList
            .filter(item => item.status === 'FAILED')
            .reduce((acc, curr) => acc + (curr.amount || 0), 0);

        return { totalAmount, totalCount, refundAmount };
    }, [historyList]);

    const filteredHistory = useMemo(() => {
        return historyList.filter((item) => {
            if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const matchTitle = item.title ? item.title.toLowerCase().includes(term) : false;
                const matchCreator = item.creatorNickname ? item.creatorNickname.toLowerCase().includes(term) : false;
                return matchTitle || matchCreator;
            }
            return true;
        }).sort((a, b) => {
            if (sortBy === 'LATEST') return new Date(b.supportedAt) - new Date(a.supportedAt);
            if (sortBy === 'OLDEST') return new Date(a.supportedAt) - new Date(b.supportedAt);
            if (sortBy === 'HIGH_AMOUNT') return (b.amount || 0) - (a.amount || 0);
            if (sortBy === 'LOW_AMOUNT') return (a.amount || 0) - (b.amount || 0);
            return 0;
        });
    }, [historyList, searchTerm, statusFilter, sortBy]);

    const groupedHistory = useMemo(() => {
        const groups = {};
        filteredHistory.forEach((item) => {
            const dateKey = getDateGroupKey(item.supportedAt) || '기타';
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(item);
        });
        return groups;
    }, [filteredHistory]);

    if (loading) {
        return (
            <div className="w-full max-w-[1080px] mx-auto px-6 py-20 text-center text-gray-500 font-sans">
                거래 내역을 불러오는 중입니다...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-[1080px] mx-auto px-6 py-20 text-center text-gray-600 font-sans">
                <p className="text-lg font-semibold text-rose-600 mb-4">{error}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={fetchTransactions}
                        className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg shadow hover:bg-opacity-90 transition-all"
                    >
                        다시 시도
                    </button>
                    <button
                        onClick={() => window.location.href = "/LoginPage"}
                        className="px-4 py-2 bg-primary text-white font-medium rounded-lg shadow hover:bg-opacity-90 transition-all shadow-md"
                    >
                        로그인 페이지로 이동
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1080px] mx-auto px-6 py-10 font-sans text-gray-900">
            {/* 1. 페이지 헤더 */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">거래 및 결제 내역</h1>
                    <p className="text-xs text-gray-500 mt-1">
                        후원하신 프로젝트의 결제 완료 및 환불 처리 상세 명세입니다.
                    </p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-2xs"
                >
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    내역 인쇄
                </button>
            </div>

            {/* 2. 결제 내역 요약 카드 */}
            <div className="bg-white text-tcolor border border-gray-200 rounded-2xl p-6 mb-8 shadow-xs relative overflow-hidden text-left">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-xs text-tcolor font-semibold">FundChain 후원 결제 요약</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2">
                    <div>
                        <span className="text-xs text-gray-400 block mb-1">총 누적 결제 금액</span>
                        <span className="text-3xl font-extrabold text-tcolor tracking-tight font-sans">
                            {formatCurrency(stats.totalAmount)}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 pt-2 sm:pt-0">
                        <span>총 <strong className="text-tcolor font-bold">{stats.totalCount}건</strong> 결제</span>
                        <span>·</span>
                        <span>환불 완료 <strong className="text-warning font-bold">+{formatCurrency(stats.refundAmount)}</strong></span>
                    </div>
                </div>
            </div>

            {/* 3. 검색 & 필터 바 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                    {Object.keys(STATUS_CONFIG).map((statusKey) => {
                        const isActive = statusFilter === statusKey;
                        const label = STATUS_CONFIG[statusKey].label;
                        return (
                            <button
                                key={statusKey}
                                onClick={() => setStatusFilter(statusKey)}
                                className={`px-4 py-1.5 rounded-full text-sm font-sans border transition-colors whitespace-nowrap ${isActive
                                    ? 'bg-white text-tcolor font-bold border-accent border-2'
                                    : 'bg-white text-tcolor border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:w-56">
                        <input
                            type="text"
                            placeholder="프로젝트 / 창작자 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-slate-800"
                        />
                        <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-slate-800 cursor-pointer"
                    >
                        <option value="LATEST">최신순</option>
                        <option value="OLDEST">과거순</option>
                        <option value="HIGH_AMOUNT">금액 높은순</option>
                        <option value="LOW_AMOUNT">금액 낮은순</option>
                    </select>
                </div>
            </div>

            {/* 4. 거래 내역 리스트 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {Object.keys(groupedHistory).length > 0 ? (
                    Object.keys(groupedHistory).map((dateKey) => (
                        <div key={dateKey} className="border-b border-gray-100 last:border-b-0">
                            <div className="bg-gray-50/80 px-4 py-2 border-y border-gray-100 text-xs font-semibold text-gray-500 text-left">
                                {dateKey}
                            </div>

                            <div className="divide-y divide-gray-100">
                                {groupedHistory[dateKey].map((item) => {
                                    const isFailed = item.status === 'FAILED';
                                    const statusInfo = STATUS_CONFIG[item.status] || { label: item.status, badgeClass: '' };

                                    return (
                                        <div
                                            key={item.supportId}
                                            className="px-4 py-3.5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                                        >
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <h3 className="text-sm font-bold text-gray-900 truncate">
                                                            {item.title}
                                                        </h3>
                                                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold flex-shrink-0 ${statusInfo.badgeClass}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        창작자: {item.creatorNickname || '알 수 없음'} · 결제번호 (#SUP-{item.supportId})
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pl-13 sm:pl-0">
                                                <div className="text-left sm:text-right">
                                                    <span className={`text-base font-extrabold font-sans ${isFailed ? 'text-warning' : 'text-tcolor'
                                                         }`}>
                                                        {isFailed ? `+${formatCurrency(item.amount)}` : formatCurrency(item.amount)}
                                                    </span>
                                                    <span className="block text-[11px] text-gray-400">
                                                        {isFailed ? '환불 완료' : '결제 완료'}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => setSelectedReceipt(item)}
                                                    className="px-2.5 py-1 border border-gray-300 hover:border-slate-800 text-gray-700 hover:text-slate-900 rounded text-xs transition-colors bg-white shadow-2xs"
                                                >
                                                    영수증
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center text-gray-400">
                        <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-xs font-medium">조회 조건에 맞는 거래 및 결제 내역이 존재하지 않습니다.</p>
                    </div>
                )}
            </div>

            {/* 5. 전자 결제 영수증 모달 */}
            {selectedReceipt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden text-left border border-gray-200">
                        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-base text-white">후원 결제 영수증</h3>
                                <p className="text-[11px] text-slate-400 font-mono">결제번호: SUP-{selectedReceipt.supportId}</p>
                            </div>
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="text-slate-400 hover:text-white text-lg font-bold p-1"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 space-y-3.5 text-xs text-gray-700 font-sans">
                            <div className="pb-3 border-b border-gray-100">
                                <span className="text-gray-400 block mb-0.5">프로젝트명</span>
                                <p className="font-bold text-sm text-gray-900 leading-snug">{selectedReceipt.title}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                                <div>
                                    <span className="text-gray-400 block mb-0.5">창작자 (수령인)</span>
                                    <p className="font-semibold text-gray-800">{selectedReceipt.creatorNickname}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">후원자 ID</span>
                                    <p className="font-semibold text-gray-800">{selectedReceipt.userId}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                                <div>
                                    <span className="text-gray-400 block mb-0.5">결제 일시</span>
                                    <p className="font-semibold text-gray-800">{formatDate(selectedReceipt.supportedAt)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">결제 상태</span>
                                    <p className="font-semibold text-slate-900">
                                        {STATUS_CONFIG[selectedReceipt.status]?.label || selectedReceipt.status}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3.5 rounded-xl space-y-1.5 border border-gray-200">
                                <div className="flex justify-between text-gray-500">
                                    <span>결제 수단</span>
                                    <span className="font-medium text-gray-800">{selectedReceipt.bankName || '기본 결제'}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200 text-sm">
                                    <span className="font-bold text-gray-900">최종 결제 금액</span>
                                    <span className="font-extrabold font-mono text-slate-900 text-base">
                                        {formatCurrency(selectedReceipt.amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-3.5 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                onClick={() => window.print()}
                                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-100"
                            >
                                인쇄
                            </button>
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
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