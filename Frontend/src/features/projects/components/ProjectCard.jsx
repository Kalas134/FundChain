import React from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/frame.css";

function ProjectCard({ project }) {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/projects/${project.projectId}`);
    };

    // 추가: 이미지가 없을 경우 사용할 기본 이미지
    const defaultImage = "/images/projects/default-project.jpg";

    const imageUrl =
        project.thumbnailImage || defaultImage;

    return (
        <div
            className="project-card"
            onClick={handleClick}
        >
            {/* 썸네일 영역 */}
            <div className="project-card-image-wrapper">

                {/* 수정: 이미지가 없어도 기본 이미지가 표시되도록 변경 */}
                <img
                    className="project-card-image"
                    src={imageUrl}
                    alt={project.title}
                    onError={(e) => {
                        // 추가: 기본 이미지 자체가 실패하는 경우
                        // onError가 반복 실행되지 않도록 방지
                        if (e.currentTarget.src.endsWith("default-project.jpg")) {
                            e.currentTarget.style.display = "none";
                            return;
                        }

                        // 추가: 잘못된 이미지 경로인 경우 기본 이미지로 대체
                        e.currentTarget.src = defaultImage;
                    }}
                />

                {/* 마감 임박 표시 */}
                <span className="project-card-deadline">
                    오늘 마감
                </span>
            </div>

            {/* 프로젝트 정보 */}
            <div className="project-card-content">

                <h2 className="project-card-title">
                    {project.title}
                </h2>

                <p className="project-card-description">
                    {project.description}
                </p>

            </div>

            {/* 펀딩 버튼 */}
            <button
                type="button"
                className="project-card-funding-button"
                onClick={(e) => {
                    // 카드 클릭 이벤트가 버튼까지 전달되지 않도록 방지
                    e.stopPropagation();
                }}
            >
                펀딩하기
            </button>
        </div>
    );
}

export default ProjectCard;