import React from 'react';

const ProjectCard = ({ project }) => {
    return (
        <div className="w-full max-w-[900px] mx-auto my-5 px-4 font-sans">
            {/* 상태 헤더 */}
            <h3 className="text-xl font-bold text-gray-900 mb-4">후원 성공</h3>

            {/* 카드 메인 박스 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">

                {/* 카드 상단 콘텐츠 영역 */}
                <div className="relative flex p-6 items-start">

                    {/* 이미지 영역 */}
                    <div className="w-[120px] h-[120px] rounded overflow-hidden mr-5 flex-shrink-0">
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* 텍스트 정보 영역 */}
                    <div className="flex flex-col flex-grow pr-10">
                        <span className="text-xs text-gray-400 mb-1.5">{project.sponsoredDate}</span>
                        <h4 className="text-base font-bold text-gray-900 mb-1.5">{project.title}</h4>
                        <p className="text-sm text-gray-500 mb-2">{project.description}</p>
                        <span className="text-base font-bold text-gray-900 mb-1.5">{project.price}</span>
                        <span className="text-xs text-gray-500">{project.deliveryStatus}</span>
                    </div>

                    {/* 오른쪽 화살표 버튼 */}
                    <button
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-600 transition-colors"
                        aria-label="상세보기"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* 하단 버튼 그룹 */}
                <div className="flex border-t border-gray-100 p-3 px-6 gap-3">
                    <button className="flex-1 py-2.5 border border-red-400 text-red-400 rounded text-sm font-semibold text-center hover:bg-red-50 transition-colors">
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
    );
};

export default ProjectCard;