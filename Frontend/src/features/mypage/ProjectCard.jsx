import React from 'react';

/**
 * 개별 프로젝트 후원 내역 카드 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.project - 단일 프로젝트 데이터 정보 객체
 */
const ProjectCard = ({ project }) => {
    return (
        <div className="w-full max-w-[900px] mx-auto my-5 px-4 font-sans">
            {/* 상태 헤더 (후원 상태 표시) */}
            <h3 className="text-xl font-bold text-gray-900 mb-4">후원 성공</h3>

            {/* 카드 메인 컨테이너 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">

                {/* 카드 상단 콘텐츠 영역 */}
                <div className="relative flex p-6 items-start">

                    {/* 프로젝트 썸네일 이미지 영역 */}
                    <div className="w-[120px] h-[120px] rounded overflow-hidden mr-5 flex-shrink-0">
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* 프로젝트 상세 정보 영역 (후원 일자, 제목, 리워드 설명, 금액, 선물 배송 상태) */}
                    <div className="flex flex-col flex-grow pr-10">
                        <span className="text-xs text-gray-400 mb-1.5">{project.sponsoredDate}</span>
                        <h4 className="text-base font-bold text-gray-900 mb-1.5">{project.title}</h4>
                        <p className="text-sm text-gray-500 mb-2">{project.description}</p>
                        <span className="text-base font-bold text-gray-900 mb-1.5">{project.price}</span>
                        <span className="text-xs text-gray-500">{project.deliveryStatus}</span>
                    </div>

                    {/* 오른쪽 상세보기 이동 버튼 */}
                    <button
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-600 transition-colors"
                        aria-label="상세보기"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* 하단 액션 버튼 그룹 (후기 작성, 후원 상세 보기, 창작자 문의) */}
                <div className="flex border-t border-gray-100 p-3 px-6 gap-3">
                    {project?.status === 'success' && (
                        <button className="flex-1 py-2.5 border border-accent text-accent rounded text-sm font-semibold text-center hover:bg-accent/10 transition-colors">
                            후기 작성
                        </button>
                    )}
                    <button className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded text-sm font-semibold text-center hover:bg-gray-50 transition-colors">
                        후원 상세
                    </button>
                    <button className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded text-sm font-semibold text-center hover:bg-gray-50 transition-colors">
                        창작자 문의
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProjectCard;