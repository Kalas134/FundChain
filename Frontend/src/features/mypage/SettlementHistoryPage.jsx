import React, { useState, useEffect, useMemo } from 'react';
import { getSettlementHistory } from './services/myPageApi';

// 크리에이터 프로젝트 정산 내역 Mock 데이터셋 (fallback)
const MOCK_SETTLEMENT_HISTORY = [
    {
        settlementId: 2001,
        projectId: 101,
        title: "스마트 홈 IoT 가젯 프로젝트",
        thumbnailImage: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&auto=format&fit=crop&q=80",
        targetAmount: 10000000,
        totalRaised: 12500000,
        backerCount: 142,
        platformFee: 625000,
        pgFee: 375000,
        netAmount: 11500000,
        settledAt: "2026-07-20",
        status: "COMPLETED",
        bankName: "신한은행",
        accountNum: "110-456-789012",
        accountHolder: "김창작"
    },
    {
        settlementId: 2002,
        projectId: 102,
        title: "친환경 비건 텀블러 & 오가닉 백",
        thumbnailImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80",
        targetAmount: 5000000,
        totalRaised: 6200000,
        backerCount: 88,
        platformFee: 310000,
        pgFee: 186000,
        netAmount: 5704000,
        settledAt: "2026-06-15",
        status: "COMPLETED",
        bankName: "KB국민은행",
        accountNum: "456-12-345678",
        accountHolder: "김창작"
    }
];

const STATUS_CONFIG = {
    ALL: { label: '전체', badgeClass: '' },
    COMPLETED: { label: '지급 완료', badgeClass: 'bg-accent/15 text-accent font-bold border border-accent/40' },
    IN_PROGRESS: { label: '정산 진행중', badgeClass: 'bg-blue-100/70 text-blue-800 border border-blue-300' },
    PENDING: { label: '정산 대기', badgeClass: 'bg-amber-100/80 text-amber-800 border border-amber-300' },
    FAILED: { label: '정산 무산', badgeClass: 'bg-warning/15 text-warning font-bold border border-warning/40' },
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

function SettlementHistoryPage() {
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('LATEST');
    const [selectedStatement, setSelectedStatement] = useState(null);

    // 백엔드 정산 계산 API(getSettlementHistory) 데이터를 실시간 수신하도록 연결
    useEffect(() => {
        const fetchSettlements = async () => {
            try {
                setLoading(true);
                const data = await getSettlementHistory();
                if (Array.isArray(data)) {
                    setHistoryList(data);
                } else {
                    setHistoryList(MOCK_SETTLEMENT_HISTORY);
                }
            } catch (err) {
                console.error("정산 내역 조회 실패, 목업 데이터 사용:", err);
                setHistoryList(MOCK_SETTLEMENT_HISTORY);
            } finally {
                setLoading(false);
            }
        };

        fetchSettlements();
    }, []);

    const stats = useMemo(() => {
        const completedItems = historyList.filter(item => item.status === 'COMPLETED');
        const pendingItems = historyList.filter(item => item.status === 'PENDING' || item.status === 'IN_PROGRESS');

        const totalCompletedAmount = completedItems.reduce((acc, curr) => acc + (curr.netAmount || 0), 0);
        const totalPendingAmount = pendingItems.reduce((acc, curr) => acc + (curr.netAmount || 0), 0);
        const totalCount = historyList.length;

        const totalFees = completedItems.reduce((acc, curr) => acc + (curr.platformFee || 0) + (curr.pgFee || 0), 0);

        return { totalCompletedAmount, totalPendingAmount, totalCount, totalFees };
    }, [historyList]);

    const filteredHistory = useMemo(() => {
        return historyList.filter((item) => {
            if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                return item.title ? item.title.toLowerCase().includes(term) : false;
            }
            return true;
        }).sort((a, b) => {
            if (sortBy === 'LATEST') return new Date(b.settledAt) - new Date(a.settledAt);
            if (sortBy === 'OLDEST') return new Date(a.settledAt) - new Date(b.settledAt);
            if (sortBy === 'HIGH_AMOUNT') return (b.netAmount || 0) - (a.netAmount || 0);
            if (sortBy === 'LOW_AMOUNT') return (a.netAmount || 0) - (b.netAmount || 0);
            return 0;
        });
    }, [historyList, searchTerm, statusFilter, sortBy]);

    const groupedHistory = useMemo(() => {
        const groups = {};
        filteredHistory.forEach((item) => {
            const dateKey = getDateGroupKey(item.settledAt) || '기타';
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(item);
        });
        return groups;
    }, [filteredHistory]);

    if (loading) {
        return (
            <div className="w-full max-w-[1080px] mx-auto px-6 py-20 text-center text-gray-500 font-sans">
                정산 내역을 불러오는 중입니다...
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1080px] mx-auto px-6 py-10 font-sans text-gray-900">
            {/* 1. 페이지 헤더 */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">프로젝트 정산 내역</h1>
                    <p className="text-xs text-gray-500 mt-1">
                        창작자님이 성공적으로 완료했거나 진행 중인 프로젝트의 정산금 수령 및 지급 명세입니다.
                    </p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
                >
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    명세서 인쇄
                </button>
            </div>

            {/* 2. 정산 내역 요약 카드 */}
            <div className="bg-white text-tcolor border border-gray-200 rounded-2xl p-6 mb-8 shadow-xs relative overflow-hidden text-left">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-xs text-tcolor font-semibold">FundChain 크리에이터 정산 요약</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2">
                    <div>
                        <span className="text-xs text-gray-400 block mb-1">총 누적 지급 완료 금액</span>
                        <span className="text-3xl font-extrabold text-tcolor tracking-tight font-sans">
                            {formatCurrency(stats.totalCompletedAmount)}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 pt-2 sm:pt-0">
                        <span>총 <strong className="text-tcolor font-bold">{stats.totalCount}건</strong> 정산</span>
                        <span>·</span>
                        <span>정산 대기/진행 <strong className="text-accent font-bold">+{formatCurrency(stats.totalPendingAmount)}</strong></span>
                        <span>·</span>
                        <span>누적 수수료 <span className="text-gray-400 font-medium">{formatCurrency(stats.totalFees)}</span></span>
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
                                className={`px-4 py-1.5 rounded-full text-sm font-sans border transition-colors whitespace-nowrap cursor-pointer ${isActive
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
                            placeholder="프로젝트 검색"
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
                        <option value="HIGH_AMOUNT">정산액 높은순</option>
                        <option value="LOW_AMOUNT">정산액 낮은순</option>
                    </select>
                </div>
            </div>

            {/* 4. 정산 내역 리스트 */}
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
                                    const targetAmountNum = item.targetAmount || 1;
                                    const achievementRate = Math.round(((item.totalRaised || 0) / targetAmountNum) * 100);

                                    return (
                                        <div
                                            key={item.settlementId}
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
                                                        달성률 {achievementRate}% ({formatCurrency(item.totalRaised)}) · 후원자 {item.backerCount}명 · 정산번호 (#SETTL-{item.settlementId})
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pl-13 sm:pl-0">
                                                <div className="text-left sm:text-right">
                                                    <span className={`text-base font-extrabold font-sans ${isFailed ? 'text-gray-400' : 'text-tcolor'
                                                        }`}>
                                                        {isFailed ? '0원' : formatCurrency(item.netAmount)}
                                                    </span>
                                                    <span className="block text-[11px] text-gray-400">
                                                        {isFailed ? '정산 실패 (미지급)' : `수수료 차감 후 실입금액`}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => setSelectedStatement(item)}
                                                    className="px-2.5 py-1 border border-gray-300 hover:border-slate-800 text-gray-700 hover:text-slate-900 rounded text-xs transition-colors bg-white shadow-2xs cursor-pointer"
                                                >
                                                    정산 명세서
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
                        <p className="text-xs font-medium">조회 조건에 맞는 프로젝트 정산 내역이 존재하지 않습니다.</p>
                    </div>
                )}
            </div>

            {/* 5. 정산 상세 명세서 모달 */}
            {selectedStatement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden text-left border border-gray-200">
                        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-base text-white">프로젝트 정산 명세서</h3>
                                <p className="text-[11px] text-slate-400 font-mono">정산번호: SETTL-{selectedStatement.settlementId}</p>
                            </div>
                            <button
                                onClick={() => setSelectedStatement(null)}
                                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 space-y-3.5 text-xs text-gray-700 font-sans">
                            <div className="pb-3 border-b border-gray-100">
                                <span className="text-gray-400 block mb-0.5">프로젝트명</span>
                                <p className="font-bold text-sm text-gray-900 leading-snug">{selectedStatement.title}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                                <div>
                                    <span className="text-gray-400 block mb-0.5">목표 금액</span>
                                    <p className="font-semibold text-gray-800">{formatCurrency(selectedStatement.targetAmount)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">총 펀딩 모금액</span>
                                    <p className="font-bold text-accent">{formatCurrency(selectedStatement.totalRaised)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                                <div>
                                    <span className="text-gray-400 block mb-0.5">정산 지급일</span>
                                    <p className="font-semibold text-gray-800">{formatDate(selectedStatement.settledAt)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">정산 처리 상태</span>
                                    <p className="font-semibold text-slate-900">
                                        {STATUS_CONFIG[selectedStatement.status]?.label || selectedStatement.status}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3.5 rounded-xl space-y-2 border border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>총 펀딩 성공액</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(selectedStatement.totalRaised)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>플랫폼 이용 수수료 (5%)</span>
                                    <span className="text-warning">-{formatCurrency(selectedStatement.platformFee)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>PG 결제 수수료 (3%)</span>
                                    <span className="text-warning">-{formatCurrency(selectedStatement.pgFee)}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 flex justify-between text-gray-600">
                                    <span>입금 계좌 정보</span>
                                    <span className="font-medium text-gray-800">{selectedStatement.bankName} {selectedStatement.accountNum} ({selectedStatement.accountHolder})</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-300 text-sm">
                                    <span className="font-bold text-gray-900">최종 실지급 정산액</span>
                                    <span className="font-extrabold font-mono text-slate-900 text-base">
                                        {formatCurrency(selectedStatement.netAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-3.5 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                onClick={() => window.print()}
                                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-100 cursor-pointer"
                            >
                                명세서 인쇄
                            </button>
                            <button
                                onClick={() => setSelectedStatement(null)}
                                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
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

export default SettlementHistoryPage;
