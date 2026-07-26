import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCreatorProjects } from './mockData'; // 목업데이터
import { getMyProjects } from './services/myPageApi';

/**
 * 프로젝트 상태 매핑 (라벨, 배지 스타일)
 * 'PREPARING': 준비중, 'ONGOING': 진행중, 'SUCCESS': 성공, 'FAILED': 실패
 */
const STATUS_CONFIG = {
    PREPARING: { label: '준비중', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' },
    ONGOING: { label: '진행중', badgeClass: 'bg-blue-100 text-blue-800 border-blue-300' },
    SUCCESS: { label: '성공', badgeClass: 'bg-accent/15 text-accent font-bold border-accent/40' },
    FAILED: { label: '실패', badgeClass: 'bg-warning/15 text-warning font-bold border-warning/40' }
};

/**
 * 창작자가 자신이 만든 프로젝트 목록을 관리하고 필터링/검색할 수 있는 마이페이지 메인 화면 컴포넌트
 */
const CreatorProjectsPage = () => {
    const navigate = useNavigate();

    // 프로젝트 목록 상태 관리 (삭제 기능 테스트 지원)
    const [projectsList, setProjectsList] = useState(mockCreatorProjects);
    // const [projectsList, setProjectsList] = useState([]);

    // 프로젝트 검색어 상태
    const [searchTerm, setSearchTerm] = useState('');

    // 선택된 프로젝트 상태 필터 탭 ('전체', '준비중', '진행중', '성공', '실패')
    const [selectedTab, setSelectedTab] = useState('전체');

    // 선택된 조회 연도 및 월 필터
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        const loadMyProjects = async () => {
            try {
                const userId = localStorage.getItem("userId");

                if (!userId) {
                    return;
                }

                const data = await getMyProjects(userId);

                // 목업데이터 용
                // if (data && data.length > 0) {
                //     setProjectsList(data);
                // }

                // 크리에이터 프로젝트만 부르는 용도 
                // setProjectsList(data || []);

                // 기존 목업 데이터에 DB 프로젝트 추가
                setProjectsList(prev => [
                    ...prev,
                    ...(data || [])
                ]);

            } catch (error) {
                console.error("내 프로젝트 조회 실패:", error);
            }
        };

        loadMyProjects();
    }, []);

    // 1. 상태별 프로젝트 개수 계산
    const totalCount = projectsList.length;
    const preparingCount = projectsList.filter(p => p.status === 'PREPARING').length;
    const ongoingCount = projectsList.filter(p => p.status === 'ONGOING').length;
    const successCount = projectsList.filter(p => p.status === 'SUCCESS').length;
    const failedCount = projectsList.filter(p => p.status === 'FAILED').length;

    // 2. 탭, 연도, 월, 검색어 조건에 따른 필터링 로직
    const filteredProjects = projectsList.filter((project) => {
        // 탭 필터 적용
        if (selectedTab === '준비중' && project.status !== 'PREPARING') return false;
        if (selectedTab === '진행중' && project.status !== 'ONGOING') return false;
        if (selectedTab === '성공' && project.status !== 'SUCCESS') return false;
        if (selectedTab === '실패' && project.status !== 'FAILED') return false;

        // 연도 필터
        if (selectedYear && project.year !== parseInt(selectedYear)) return false;

        // 월 필터
        if (selectedMonth && project.month !== parseInt(selectedMonth)) return false;

        // 검색어 필터 (제목 또는 설명)
        if (searchTerm) {
            const normalizedSearch = searchTerm.toLowerCase();
            const matchTitle = project.title.toLowerCase().includes(normalizedSearch);
            const matchDesc = project.description.toLowerCase().includes(normalizedSearch);
            return matchTitle || matchDesc;
        }

        return true;
    });

    // 필터 초기화
    const handleResetFilters = () => {
        setSelectedYear('');
        setSelectedMonth('');
        setSearchTerm('');
    };

    // 탭 UI 항목 목록
    const tabList = [
        { name: '전체', count: totalCount },
        { name: '준비중', count: preparingCount },
        { name: '진행중', count: ongoingCount },
        { name: '성공', count: successCount },
        { name: '실패', count: failedCount }
    ];

    // 카드 클릭시 프로젝트 상세 페이지로 이동
    const handleCardClick = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    // 프로젝트 수정 핸들러
    const handleEditProject = (e, projectId) => {
        e.stopPropagation(); // 카드 전체 클릭 이벤트 전파 방지
        navigate(`/project/edit/${projectId}`);
    };

    // 프로젝트 삭제 핸들러
    const handleDeleteProject = (e, projectId) => {
        e.stopPropagation(); // 카드 전체 클릭 이벤트 전파 방지
        if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
            setProjectsList(prev => prev.filter(p => p.id !== projectId));
            alert('프로젝트가 삭제되었습니다.');
        }
    };

    return (
        <div className="w-full max-w-[1080px] mx-auto px-6 py-10 font-sans text-gray-900">

            {/* 1. 메인 타이틀 */}
            <h1 className="text-3xl font-bold mb-8">내가 만든 프로젝트</h1>

            {/* 2. 유틸리티 바 (결과 건수, 년/월 드롭다운, 초기화 및 검색 바) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

                {/* 왼쪽: 건수, 년/월 선택, 초기화 */}
                <div className="flex flex-col gap-4">
                    <div className="text-sm text-gray-700 text-start mx-2">
                        총 <span className="text-accent font-semibold">{filteredProjects.length}건</span>의 프로젝트가 있습니다.
                    </div>

                    <div className="flex items-center gap-2">
                        {/* 년도 선택 */}
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

                        {/* 월 선택 */}
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

                        {/* 필터 초기화 */}
                        <button
                            onClick={handleResetFilters}
                            className="px-3 py-1.5 border border-gray-200 rounded text-sm bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            초기화
                        </button>
                    </div>
                </div>

                {/* 오른쪽: 키워드 검색 바 */}
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

            {/* 3. 상태 필터 동적 탭 (PREPARING, ONGOING, SUCCESS, FAILED 대응) */}
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
                            <span className="ml-1 font-normal">{tab.count}</span>
                        </button>
                    );
                })}
            </div>

            {/* 4. 프로젝트 카드 목록 */}
            <div className="flex flex-col gap-8">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => {
                        const statusInfo = STATUS_CONFIG[project.status] || { label: project.status, badgeClass: 'bg-gray-100 text-gray-700' };
                        const achievementRate = project.targetAmount > 0
                            ? Math.round((project.currentAmount / project.targetAmount) * 100)
                            : 0;

                        return (
                            <div key={project.id} className="w-full">
                                {/* 프로젝트 상태 헤더 라벨 */}
                                <div className="flex items-center gap-2 mb-3 mx-4">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {statusInfo.label}
                                    </h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>

                                {/* 카드 전체 클릭시 상세페이지 이동 */}
                                <div
                                    onClick={() => handleCardClick(project.id)}
                                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="relative flex p-6 items-start">
                                        {/* 썸네일 */}
                                        <div className="w-[120px] h-[120px] rounded overflow-hidden mr-5 flex-shrink-0 bg-gray-100">
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* 프로젝트 정보 */}
                                        <div className="flex flex-col flex-grow pr-10">
                                            <span className="text-xs text-gray-400 mb-1.5">{project.createdDate}</span>
                                            <h4 className="text-base font-bold text-gray-900 mb-1.5">{project.title}</h4>
                                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.description}</p>

                                            {/* 후원 금액 및 바형 인디케이터 (Progress Bar) */}
                                            <div className="w-full mt-1">
                                                <div className="flex justify-between items-center text-sm mb-1.5">
                                                    <span className="font-bold text-gray-900">
                                                        {project.currentAmount.toLocaleString()}원{' '}
                                                        <span className="text-accent font-extrabold">({achievementRate}%)</span>
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        목표 {project.targetAmount.toLocaleString()}원
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            project.status === 'SUCCESS' ? 'bg-accent' :
                                                            project.status === 'FAILED' ? 'bg-warning' :
                                                            'bg-accent'
                                                        }`}
                                                        style={{ width: `${Math.min(achievementRate, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* 상세보기 이동 화살표 */}
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* 하단 액션 버튼 그룹 (프로젝트 수정, 프로젝트 삭제 - 2개 버튼 1:1 넓이) */}
                                    <div className="flex border-t border-gray-100 p-3 px-6 gap-3">
                                        <button
                                            onClick={(e) => handleEditProject(e, project.id)}
                                            className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded text-sm font-semibold text-center hover:bg-gray-50 transition-colors"
                                        >
                                            프로젝트 수정
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteProject(e, project.id)}
                                            className="flex-1 py-2.5 border border-warning/40 text-warning rounded text-sm font-semibold text-center hover:bg-warning/10 transition-colors"
                                        >
                                            프로젝트 삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    /* 조건에 부합하는 프로젝트가 없을 경우 빈 화면 */
                    <div className="text-center py-20 text-gray-400 border border-dashed border-gray-200 rounded-lg">
                        조건에 맞는 프로젝트가 없습니다.
                    </div>
                )}
            </div>

        </div>
    );
};

export default CreatorProjectsPage;