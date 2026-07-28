import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSponsoredProjects } from './services/myPageApi';

/**
 * 사용자가 후원한 프로젝트 목록을 조회하고 필터링/검색할 수 있는 마이페이지 메인 화면 컴포넌트
 */
const SponsoredProjectsPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('전체');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getSponsoredProjects();
            if (Array.isArray(data)) {
                setProjects(data);
            } else {
                setProjects([]);
            }
        } catch (err) {
            console.error("후원 프로젝트 목록 조회 실패:", err);
            const msg = err.response?.data?.message || err.message || "후원 내역을 불러오지 못했습니다. 로그인 상태를 확인해 주세요.";
            setError(msg);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    // 백엔드 API(getSponsoredProjects)를 통해 실제 후원한 프로젝트 내역을 받아오도록 연동
    useEffect(() => {
        fetchProjects();
    }, []);

    // 1. 전체 데이터를 기반으로 각 탭의 실제 프로젝트 개수를 동적으로 계산
    const totalCount = projects.length;
    const reservedCount = projects.filter(p => p.status === 'reserved').length;
    const successCount = projects.filter(p => p.status === 'success').length;
    const canceledCount = projects.filter(p => p.status === 'canceled').length;

    // 2. 탭, 연도, 월, 검색어 조건에 따른 필터링 및 검색 로직
    const filteredProjects = projects.filter((project) => {
        if (selectedTab === '후원 예약' && project.status !== 'reserved') return false;
        if (selectedTab === '후원 성공' && project.status !== 'success') return false;
        if (selectedTab === '후원 무산' && project.status !== 'canceled') return false;

        if (selectedYear && project.year !== parseInt(selectedYear)) return false;
        if (selectedMonth && project.month !== parseInt(selectedMonth)) return false;

        if (searchTerm) {
            const normalizedSearch = searchTerm.toLowerCase();
            const matchTitle = project.title ? project.title.toLowerCase().includes(normalizedSearch) : false;
            const matchDesc = project.description ? project.description.toLowerCase().includes(normalizedSearch) : false;
            return matchTitle || matchDesc;
        }

        return true;
    });

    const handleResetFilters = () => {
        setSelectedYear('');
        setSelectedMonth('');
        setSearchTerm('');
    };

    const tabList = [
        { name: '전체', count: totalCount, showCount: true },
        { name: '후원 예약', count: reservedCount, showCount: reservedCount > 0 },
        { name: '후원 성공', count: successCount, showCount: true },
        { name: '후원 무산', count: canceledCount, showCount: true }
    ];

    if (loading) {
        return (
            <div className="w-full max-w-[1080px] mx-auto px-6 py-20 text-center text-gray-500 font-sans">
                후원 내역을 불러오는 중입니다...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-[1080px] mx-auto px-6 py-20 text-center text-gray-600 font-sans">
                <p className="text-lg font-semibold text-rose-600 mb-4">{error}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={fetchProjects}
                        className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg shadow hover:bg-opacity-90 transition-all"
                    >
                        다시 시도
                    </button>
                    <button
                        onClick={() => navigate('/LoginPage')}
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
            {/* 1. 페이지 메인 타이틀 */}
            <h1 className="text-3xl font-bold mb-8">후원한 프로젝트</h1>

            {/* 2. 유틸리티 바 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-4">
                    <div className="text-sm text-gray-700 text-start mx-2">
                        <span className="text-accent font-semibold">{filteredProjects.length}건</span>의 후원 내역이 있습니다.
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded text-sm bg-white text-gray-600 focus:outline-none cursor-pointer"
                        >
                            <option value="">년도</option>
                            <option value="2026">2026년</option>
                            <option value="2025">2025년</option>
                            <option value="2024">2024년</option>
                            <option value="2023">2023년</option>
                        </select>

                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded text-sm bg-white text-gray-600 focus:outline-none cursor-pointer"
                        >
                            <option value="">월</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}월</option>
                            ))}
                        </select>

                        <button
                            onClick={handleResetFilters}
                            className="px-3 py-1.5 border border-gray-200 rounded text-sm bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            초기화
                        </button>
                    </div>
                </div>

                <div className="relative w-full md:w-[320px]">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="프로젝트를 검색하세요."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded text-tcolor focus:outline-none focus:border-gray-400 bg-bg"
                    />
                </div>
            </div>

            {/* 3. 후원 상태 동적 탭 버튼 메뉴 */}
            <div className="flex gap-2.5 mb-8 overflow-x-auto pb-1">
                {tabList.map((tab) => {
                    const isActive = selectedTab === tab.name;
                    return (
                        <button
                            key={tab.name}
                            onClick={() => setSelectedTab(tab.name)}
                            className={`px-4 py-1.5 rounded-full font-sans text-sm border transition-colors whitespace-nowrap
                ${isActive
                                    ? 'bg-white text-tcolor font-bold border-accent border-2'
                                    : 'bg-white text-tcolor border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {tab.name}
                            {tab.showCount && <span className="ml-1 font-normal">{tab.count}</span>}
                        </button>
                    );
                })}
            </div>

            {/* 4. 필터링된 후원 프로젝트 카드의 목록 영역 */}
            <div className="flex flex-col gap-8">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <div key={project.id || project.projectId} className="w-full">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 text-start mx-4">
                                {project.status === 'success' && '후원 성공'}
                                {project.status === 'reserved' && '후원 예약'}
                                {project.status === 'canceled' && '후원 무산'}
                            </h3>

                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                <div className="relative flex p-6 items-start">
                                    <div className="w-[120px] h-[120px] rounded overflow-hidden mr-5 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                                        {project.imageUrl ? (
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400">이미지 없음</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col flex-grow pr-10 text-left">
                                        <span className="text-xs text-gray-400 mb-1.5">{project.sponsoredDate}</span>
                                        <h4 className="text-base font-bold text-gray-900 mb-1.5">{project.title}</h4>
                                        <p className="text-sm text-gray-500 mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: project.description || '' }}></p>
                                        <span className="text-base font-bold text-gray-900 mb-1.5">{project.price}</span>
                                        <span className="text-xs text-gray-500">{project.deliveryStatus}</span>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/projects/${project.projectId}`)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-600 transition-colors"
                                        aria-label="상세보기"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex border-t border-gray-100 p-3 px-6 gap-3">
                                    {project.status === 'success' && (
                                        <button className="flex-1 py-2.5 border border-accent border-2 text-accent rounded text-sm font-bold text-center hover:bg-accent/10 transition-colors">
                                            후기 작성
                                        </button>
                                    )}
                                    <button
                                        onClick={() => navigate("/transactionhistory")} // 지금 우선 연결부터 해 놓음
                                        className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded text-sm font-semibold text-center hover:bg-gray-50 transition-colors">
                                        후원 상세
                                    </button>
                                    <button className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded text-sm font-semibold text-center hover:bg-gray-50 transition-colors">
                                        창작자 문의
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 text-gray-400 border border-dashed border-gray-200 rounded-lg">
                        조건에 맞는 후원 내역이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SponsoredProjectsPage;