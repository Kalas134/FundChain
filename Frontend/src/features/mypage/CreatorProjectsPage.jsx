import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { mockCreatorProjects } from './mockData';
import { getMyProjects } from './services/myPageApi';


/**
 * 프로젝트 상태 매핑
 *
 * PREPARING : 준비중
 * ONGOING   : 진행중
 * SUCCESS   : 성공
 * FAILED    : 실패
 */
const STATUS_CONFIG = {
    PREPARING: {
        label: '준비중',
        badgeClass:
            'bg-amber-100 text-amber-800 border-amber-300'
    },

    ONGOING: {
        label: '진행중',
        badgeClass:
            'bg-blue-100 text-blue-800 border-blue-300'
    },

    SUCCESS: {
        label: '성공',
        badgeClass:
            'bg-accent/15 text-accent font-bold border-accent/40'
    },

    FAILED: {
        label: '실패',
        badgeClass:
            'bg-warning/15 text-warning font-bold border-warning/40'
    }
};


/**
 * 창작자의 프로젝트 목록 관리 페이지
 */
const CreatorProjectsPage = () => {

    const navigate = useNavigate();


    // ============================================================
    // 프로젝트 목록
    // ============================================================

    const [projectsList, setProjectsList] =
        useState(mockCreatorProjects);


    // ============================================================
    // 검색어
    // ============================================================

    const [searchTerm, setSearchTerm] =
        useState('');


    // ============================================================
    // 상태 필터
    // ============================================================

    const [selectedTab, setSelectedTab] =
        useState('전체');


    // ============================================================
    // 연도 / 월 필터
    // ============================================================

    const [selectedYear, setSelectedYear] =
        useState('');

    const [selectedMonth, setSelectedMonth] =
        useState('');


    // ============================================================
    // 백엔드에서 내가 만든 프로젝트 조회
    // ============================================================

    useEffect(() => {

        const loadMyProjects = async () => {

            try {

                /*
                 * 로그인한 사용자의 ID
                 *
                 * 주의:
                 * 여기의 userId는 프로젝트 ID가 아니라
                 * 로그인한 사용자의 ID입니다.
                 *
                 * 이 값이 백엔드의
                 *
                 * GET /api/projects/creator/{creatorId}
                 *
                 * 의 creatorId로 전달됩니다.
                 */
                const userId =
                    localStorage.getItem('userId');


                if (!userId) {
                    return;
                }


                /*
                 * 현재 로그인한 사용자가 만든 프로젝트 조회
                 */
                const data =
                    await getMyProjects(userId);


                /*
                 * 기존 목업 프로젝트 + DB 프로젝트
                 *
                 * 프로젝트 식별자는 projectId로 통일
                 */
                setProjectsList(prev => {

                    const existingIds =
                        new Set(
                            prev.map(
                                project => project.projectId
                            )
                        );


                    const newProjects =
                        (data || []).filter(
                            project =>
                                !existingIds.has(
                                    project.projectId
                                )
                        );


                    return [
                        ...prev,
                        ...newProjects
                    ];
                });


            } catch (error) {

                console.error(
                    '내 프로젝트 조회 실패:',
                    error
                );
            }
        };


        loadMyProjects();

    }, []);


    // ============================================================
    // 프로젝트 상태별 개수
    // ============================================================

    const totalCount =
        projectsList.length;


    const preparingCount =
        projectsList.filter(
            project =>
                project.status === 'PREPARING'
        ).length;


    const ongoingCount =
        projectsList.filter(
            project =>
                project.status === 'ONGOING'
        ).length;


    const successCount =
        projectsList.filter(
            project =>
                project.status === 'SUCCESS'
        ).length;


    const failedCount =
        projectsList.filter(
            project =>
                project.status === 'FAILED'
        ).length;


    // ============================================================
    // 필터링
    // ============================================================

    const filteredProjects =
        projectsList.filter(project => {


            // ----------------------------------------------------
            // 상태 탭
            // ----------------------------------------------------

            if (
                selectedTab === '준비중' &&
                project.status !== 'PREPARING'
            ) {
                return false;
            }


            if (
                selectedTab === '진행중' &&
                project.status !== 'ONGOING'
            ) {
                return false;
            }


            if (
                selectedTab === '성공' &&
                project.status !== 'SUCCESS'
            ) {
                return false;
            }


            if (
                selectedTab === '실패' &&
                project.status !== 'FAILED'
            ) {
                return false;
            }


            // ----------------------------------------------------
            // 연도
            // ----------------------------------------------------

            if (
                selectedYear &&
                project.year !==
                    parseInt(selectedYear)
            ) {
                return false;
            }


            // ----------------------------------------------------
            // 월
            // ----------------------------------------------------

            if (
                selectedMonth &&
                project.month !==
                    parseInt(selectedMonth)
            ) {
                return false;
            }


            // ----------------------------------------------------
            // 검색어
            // ----------------------------------------------------

            if (searchTerm) {

                const normalizedSearch =
                    searchTerm.toLowerCase();


                const matchTitle =
                    project.title
                        .toLowerCase()
                        .includes(normalizedSearch);


                const matchDesc =
                    project.description
                        .toLowerCase()
                        .includes(normalizedSearch);


                return (
                    matchTitle ||
                    matchDesc
                );
            }


            return true;
        });


    // ============================================================
    // 필터 초기화
    // ============================================================

    const handleResetFilters = () => {

        setSelectedYear('');
        setSelectedMonth('');
        setSearchTerm('');
    };


    // ============================================================
    // 상태 탭 목록
    // ============================================================

    const tabList = [
        {
            name: '전체',
            count: totalCount
        },

        {
            name: '준비중',
            count: preparingCount
        },

        {
            name: '진행중',
            count: ongoingCount
        },

        {
            name: '성공',
            count: successCount
        },

        {
            name: '실패',
            count: failedCount
        }
    ];


    // ============================================================
    // 프로젝트 상세 페이지
    // ============================================================

    const handleCardClick = (projectId) => {

        navigate(
            `/projects/${projectId}`
        );
    };


    // ============================================================
    // 프로젝트 수정
    // ============================================================

    const handleEditProject = (
        e,
        project
    ) => {

        e.stopPropagation();


        /*
         * 현재 프로젝트가 준비중인 경우에만 수정 가능
         */
        if (
            project.status !== 'PREPARING'
        ) {
            return;
        }


        /*
         * 프로젝트의 실제 PK
         *
         * userId가 아님.
         */
        const projectId =
            project.projectId;


        navigate(
            `/projects/${projectId}/edit`
        );
    };


    // ============================================================
    // 프로젝트 삭제
    // ============================================================

    const handleDeleteProject = (
        e,
        projectId
    ) => {

        e.stopPropagation();


        if (
            window.confirm(
                '정말로 이 프로젝트를 삭제하시겠습니까?'
            )
        ) {

            /*
             * projectId를 기준으로 삭제
             *
             * 기존:
             * p.id !== projectId
             *
             * 수정:
             * p.projectId !== projectId
             */
            setProjectsList(
                prev =>
                    prev.filter(
                        project =>
                            project.projectId !==
                            projectId
                    )
            );


            alert(
                '프로젝트가 삭제되었습니다.'
            );
        }
    };


    // ============================================================
    // 화면
    // ============================================================

    return (

        <div
            className="
                w-full
                max-w-[1080px]
                mx-auto
                px-6
                py-10
                font-sans
                text-gray-900
            "
        >

            {/* ====================================================
                1. 제목
            ==================================================== */}

            <h1
                className="
                    text-3xl
                    font-bold
                    mb-8
                "
            >
                내가 만든 프로젝트
            </h1>


            {/* ====================================================
                2. 검색 / 날짜 필터
            ==================================================== */}

            <div
                className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    justify-between
                    gap-4
                    mb-6
                "
            >

                {/* ------------------------------------------------
                    왼쪽
                ------------------------------------------------ */}

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                    "
                >

                    <div
                        className="
                            text-sm
                            text-gray-700
                            text-start
                            mx-2
                        "
                    >

                        총{' '}

                        <span
                            className="
                                text-accent
                                font-semibold
                            "
                        >
                            {filteredProjects.length}건
                        </span>

                        의 프로젝트가 있습니다.

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        {/* 연도 */}

                        <select
                            value={selectedYear}
                            onChange={(e) =>
                                setSelectedYear(
                                    e.target.value
                                )
                            }
                            className="
                                px-3
                                py-1.5
                                border
                                border-gray-200
                                rounded
                                text-sm
                                bg-white
                                text-gray-600
                                focus:outline-none
                                cursor-pointer
                            "
                        >

                            <option value="">
                                년도
                            </option>

                            <option value="2023">
                                2023년
                            </option>

                            <option value="2022">
                                2022년
                            </option>

                            <option value="2021">
                                2021년
                            </option>

                        </select>


                        {/* 월 */}

                        <select
                            value={selectedMonth}
                            onChange={(e) =>
                                setSelectedMonth(
                                    e.target.value
                                )
                            }
                            className="
                                px-3
                                py-1.5
                                border
                                border-gray-200
                                rounded
                                text-sm
                                bg-white
                                text-gray-600
                                focus:outline-none
                                cursor-pointer
                            "
                        >

                            <option value="">
                                월
                            </option>

                            {[...Array(12)].map(
                                (_, i) => (

                                    <option
                                        key={i + 1}
                                        value={i + 1}
                                    >
                                        {i + 1}월
                                    </option>
                                )
                            )}

                        </select>


                        {/* 초기화 */}

                        <button
                            onClick={
                                handleResetFilters
                            }
                            className="
                                px-3
                                py-1.5
                                border
                                border-gray-200
                                rounded
                                text-sm
                                bg-white
                                text-gray-400
                                hover:text-gray-600
                                hover:bg-gray-50
                                transition-colors
                            "
                        >
                            초기화
                        </button>

                    </div>

                </div>


                {/* ------------------------------------------------
                    검색
                ------------------------------------------------ */}

                <div
                    className="
                        relative
                        w-full
                        md:w-[320px]
                    "
                >

                    <span
                        className="
                            absolute
                            inset-y-0
                            left-3
                            flex
                            items-center
                            text-gray-400
                        "
                    >

                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="
                                    M21 21
                                    l-6-6
                                    m2-5
                                    a7 7 0 11-14 0
                                    7 7 0 0114 0z
                                "
                            />

                        </svg>

                    </span>


                    <input
                        type="text"
                        placeholder="프로젝트를 검색하세요."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                        className="
                            w-full
                            pl-10
                            pr-4
                            py-2
                            border
                            border-gray-200
                            rounded
                            text-tcolor
                            focus:outline-none
                            focus:border-gray-400
                            bg-bg
                        "
                    />

                </div>

            </div>


            {/* ====================================================
                3. 상태 필터
            ==================================================== */}

            <div
                className="
                    flex
                    gap-2.5
                    mb-8
                    overflow-x-auto
                    pb-1
                "
            >

                {tabList.map(tab => {

                    const isActive =
                        selectedTab ===
                        tab.name;


                    return (

                        <button
                            key={tab.name}
                            onClick={() =>
                                setSelectedTab(
                                    tab.name
                                )
                            }
                            className={`
                                px-4
                                py-1.5
                                rounded-full
                                font-sans
                                text-sm
                                border
                                transition-colors
                                whitespace-nowrap

                                ${
                                    isActive
                                        ? `
                                            bg-white
                                            text-tcolor
                                            font-bold
                                            border-accent
                                            border-2
                                        `
                                        : `
                                            bg-white
                                            text-tcolor
                                            border-gray-200
                                            hover:bg-gray-50
                                        `
                                }
                            `}
                        >

                            {tab.name}

                            <span
                                className="
                                    ml-1
                                    font-normal
                                "
                            >
                                {tab.count}
                            </span>

                        </button>
                    );
                })}

            </div>


            {/* ====================================================
                4. 프로젝트 목록
            ==================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-8
                "
            >

                {filteredProjects.length > 0 ? (

                    filteredProjects.map(
                        project => {

                            const statusInfo =
                                STATUS_CONFIG[
                                    project.status
                                ] || {
                                    label:
                                        project.status,
                                    badgeClass:
                                        'bg-gray-100 text-gray-700'
                                };


                            const achievementRate =
                                project.targetAmount > 0
                                    ? Math.round(
                                        (
                                            project.currentAmount /
                                            project.targetAmount
                                        ) * 100
                                    )
                                    : 0;


                            /*
                             * PREPARING 상태에서만
                             * 수정 버튼 활성화
                             */
                            const isEditable =
                                project.status ===
                                'PREPARING';


                            return (

                                <div
                                    key={
                                        project.projectId
                                    }
                                    className="w-full"
                                >

                                    {/* ------------------------------------------------
                                        상태 헤더
                                    ------------------------------------------------ */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            mb-3
                                            mx-4
                                        "
                                    >

                                        <h3
                                            className="
                                                text-lg
                                                font-bold
                                                text-gray-900
                                            "
                                        >
                                            {
                                                statusInfo.label
                                            }
                                        </h3>


                                        <span
                                            className={`
                                                px-2.5
                                                py-0.5
                                                rounded-full
                                                text-xs
                                                font-semibold
                                                border

                                                ${
                                                    statusInfo.badgeClass
                                                }
                                            `}
                                        >
                                            {
                                                statusInfo.label
                                            }
                                        </span>

                                    </div>


                                    {/* ------------------------------------------------
                                        프로젝트 카드
                                    ------------------------------------------------ */}

                                    <div
                                        onClick={() =>
                                            handleCardClick(
                                                project.projectId
                                            )
                                        }
                                        className="
                                            border
                                            border-gray-200
                                            rounded-lg
                                            overflow-hidden
                                            bg-white
                                            shadow-sm
                                            hover:shadow-md
                                            transition-shadow
                                            cursor-pointer
                                        "
                                    >

                                        <div
                                            className="
                                                relative
                                                flex
                                                p-6
                                                items-start
                                            "
                                        >

                                            {/* 썸네일 */}

                                            <div
                                                className="
                                                    w-[120px]
                                                    h-[120px]
                                                    rounded
                                                    overflow-hidden
                                                    mr-5
                                                    flex-shrink-0
                                                    bg-gray-100
                                                "
                                            >

                                                <img
                                                    src={
                                                        project.imageUrl
                                                    }
                                                    alt={
                                                        project.title
                                                    }
                                                    className="
                                                        w-full
                                                        h-full
                                                        object-cover
                                                    "
                                                />

                                            </div>


                                            {/* 프로젝트 정보 */}

                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    flex-grow
                                                    pr-10
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-xs
                                                        text-gray-400
                                                        mb-1.5
                                                    "
                                                >
                                                    {
                                                        project.createdDate
                                                    }
                                                </span>


                                                <h4
                                                    className="
                                                        text-base
                                                        font-bold
                                                        text-gray-900
                                                        mb-1.5
                                                    "
                                                >
                                                    {
                                                        project.title
                                                    }
                                                </h4>


                                                <p
                                                    className="
                                                        text-sm
                                                        text-gray-500
                                                        mb-3
                                                        line-clamp-2
                                                    "
                                                >
                                                    {
                                                        project.description
                                                    }
                                                </p>


                                                {/* 후원 금액 */}

                                                <div
                                                    className="
                                                        w-full
                                                        mt-1
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            justify-between
                                                            items-center
                                                            text-sm
                                                            mb-1.5
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                font-bold
                                                                text-gray-900
                                                            "
                                                        >

                                                            {
                                                                project
                                                                    .currentAmount
                                                                    .toLocaleString()
                                                            }원

                                                            <span
                                                                className="
                                                                    text-accent
                                                                    font-extrabold
                                                                "
                                                            >
                                                                {' '}
                                                                (
                                                                {
                                                                    achievementRate
                                                                }%)
                                                            </span>

                                                        </span>


                                                        <span
                                                            className="
                                                                text-xs
                                                                text-gray-400
                                                                font-medium
                                                            "
                                                        >
                                                            목표{' '}
                                                            {
                                                                project
                                                                    .targetAmount
                                                                    .toLocaleString()
                                                            }원
                                                        </span>

                                                    </div>


                                                    {/* Progress Bar */}

                                                    <div
                                                        className="
                                                            w-full
                                                            bg-gray-100
                                                            rounded-full
                                                            h-2.5
                                                            overflow-hidden
                                                        "
                                                    >

                                                        <div
                                                            className={`
                                                                h-full
                                                                rounded-full
                                                                transition-all
                                                                duration-500

                                                                ${
                                                                    project.status ===
                                                                    'FAILED'
                                                                        ? 'bg-warning'
                                                                        : 'bg-accent'
                                                                }
                                                            `}
                                                            style={{
                                                                width:
                                                                    `${Math.min(
                                                                        achievementRate,
                                                                        100
                                                                    )}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            </div>


                                            {/* 상세보기 화살표 */}

                                            <div
                                                className="
                                                    absolute
                                                    right-6
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-gray-400
                                                    hover:text-gray-600
                                                    transition-colors
                                                "
                                            >

                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >

                                                    <path
                                                        d="M9 5l7 7-7 7"
                                                    />

                                                </svg>

                                            </div>

                                        </div>


                                        {/* ====================================================
                                            하단 액션 버튼
                                        ==================================================== */}

                                        <div
                                            className="
                                                flex
                                                border-t
                                                border-gray-100
                                                p-3
                                                px-6
                                                gap-3
                                            "
                                        >

                                            {/* 수정 */}

                                            <button
                                                type="button"
                                                onClick={(e) =>
                                                    handleEditProject(
                                                        e,
                                                        project
                                                    )
                                                }
                                                disabled={
                                                    !isEditable
                                                }
                                                className={`
                                                    flex-1
                                                    py-2.5
                                                    rounded
                                                    text-sm
                                                    font-semibold
                                                    text-center
                                                    transition-colors

                                                    ${
                                                        isEditable
                                                            ? `
                                                                border
                                                                border-accent
                                                                text-accent
                                                                hover:bg-accent/10
                                                                cursor-pointer
                                                            `
                                                            : `
                                                                border
                                                                border-gray-200
                                                                text-gray-300
                                                                bg-gray-50
                                                                cursor-not-allowed
                                                            `
                                                    }
                                                `}
                                            >
                                                프로젝트 수정
                                            </button>


                                            {/* 삭제 */}

                                            <button
                                                type="button"
                                                onClick={(e) =>
                                                    handleDeleteProject(
                                                        e,
                                                        project.projectId
                                                    )
                                                }
                                                className="
                                                    flex-1
                                                    py-2.5
                                                    border
                                                    border-warning/40
                                                    text-warning
                                                    rounded
                                                    text-sm
                                                    font-semibold
                                                    text-center
                                                    hover:bg-warning/10
                                                    transition-colors
                                                "
                                            >
                                                프로젝트 삭제
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )

                ) : (

                    /* 검색/필터 결과 없음 */

                    <div
                        className="
                            text-center
                            py-20
                            text-gray-400
                            border
                            border-dashed
                            border-gray-200
                            rounded-lg
                        "
                    >
                        조건에 맞는 프로젝트가 없습니다.
                    </div>
                )}

            </div>

        </div>
    );
};


export default CreatorProjectsPage;