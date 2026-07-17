import React, { useState } from 'react';
import { mockProjects } from './mockData';

const SponsoredProjectsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('전체'); // 전체, 후원 예약, 후원 성공, 후원 무산
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    // 1. 전체 데이터를 기반으로 각 탭의 실제 개수를 동적으로 계산
    const totalCount = mockProjects.length;
    const reservedCount = mockProjects.filter(p => p.status === 'reserved').length;
    const successCount = mockProjects.filter(p => p.status === 'success').length;
    const canceledCount = mockProjects.filter(p => p.status === 'canceled').length;

    // 2. 필터링 및 검색 로직
    const filteredProjects = mockProjects.filter((project) => {
        // 탭 필터
        if (selectedTab === '후원 예약' && project.status !== 'reserved') return false;
        if (selectedTab === '후원 성공' && project.status !== 'success') return false;
        if (selectedTab === '후원 무산' && project.status !== 'canceled') return false;

        // 년도 필터
        if (selectedYear && project.year !== parseInt(selectedYear)) return false;

        // 월 필터
        if (selectedMonth && project.month !== parseInt(selectedMonth)) return false;

        // 검색 필터 (제목, 설명 기준)
        if (searchTerm) {
            const normalizedSearch = searchTerm.toLowerCase();
            const matchTitle = project.title.toLowerCase().includes(normalizedSearch);
            const matchDesc = project.description.toLowerCase().includes(normalizedSearch);
            return matchTitle || matchDesc;
        }

        return true;
    });

    // 필터 초기화 함수
    const handleResetFilters = () => {
        setSelectedYear('');
        setSelectedMonth('');
        setSearchTerm('');
    };

    // 탭 구조 배열 (동적으로 계산된 count 바인딩)
    const tabList = [
        { name: '전체', count: totalCount, showCount: true },
        { name: '후원 예약', count: reservedCount, showCount: reservedCount > 0 }, // 0건이면 숫자 안 보이게 처리 (이미지 기준)
        { name: '후원 성공', count: successCount, showCount: true },
        { name: '후원 무산', count: canceledCount, showCount: true }
    ];

    return (
        <div className="w-full max-w-[1080px] mx-auto px-6 py-10 font-sans text-gray-900">

            {/* 1. 페이지 메인 타이틀 */}
            <h1 className="text-3xl font-bold mb-8">후원한 프로젝트</h1>

            {/* 2. 유틸리티 바 (현재 필터링된 결과 건수 표시) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

                {/* 왼쪽: 건수 & 셀렉트 박스 */}
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
                            <option value="2023">2023년</option>
                            <option value="2022">2022년</option>
                            <option value="2021">2021년</option>
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

                {/* 오른쪽: 검색 바 */}
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

            {/* 3. 동적 탭 버튼 메뉴 */}
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
                            {/* 이미지처럼 건수가 있을 때만 (또는 설정된 조건에 따라) 숫자를 표시 */}
                            {tab.showCount && <span className="ml-1 font-normal">{tab.count}</span>}
                        </button>
                    );
                })}
            </div>

            {/* 4. 필터링된 프로젝트 카드 리스트 */}
            <div className="flex flex-col gap-8">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <div key={project.id} className="w-full">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 text-start mx-4">
                                {project.status === 'success' && '후원 성공'}
                                {project.status === 'reserved' && '후원 예약'}
                                {project.status === 'canceled' && '후원 무산'}
                            </h3>

                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                <div className="relative flex p-6 items-start">
                                    <div className="w-[120px] h-[120px] rounded overflow-hidden mr-5 flex-shrink-0">
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-grow pr-10">
                                        <span className="text-xs text-gray-400 mb-1.5">{project.sponsoredDate}</span>
                                        <h4 className="text-base font-bold text-gray-900 mb-1.5">{project.title}</h4>
                                        <p className="text-sm text-gray-500 mb-2">{project.description}</p>
                                        <span className="text-base font-bold text-gray-900 mb-1.5">{project.price}</span>
                                        <span className="text-xs text-gray-500">{project.deliveryStatus}</span>
                                    </div>

                                    <button
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-600 transition-colors"
                                        aria-label="상세보기"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex border-t border-gray-100 p-3 px-6 gap-3">
                                    <button className="flex-1 py-2.5 border border-accent border-2 text-accent rounded text-sm font-bold text-center hover:bg-red-50 transition-colors">
                                        후기 작성
                                    </button>
                                    <button className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded text-sm font-semibold text-center hover:bg-gray-50 transition-colors">
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