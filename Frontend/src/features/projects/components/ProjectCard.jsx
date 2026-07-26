import React from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/frame.css";

function ProjectCard({ project }) {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/projects/${project.projectId}`);
    };

    // ============================================================
    // 추가: 프로젝트 종료일을 기준으로 마감 상태 계산
    // ============================================================
    const getDeadlineText = () => {

        // 진행 중인 프로젝트가 아니면 마감일 표시하지 않음
        if (project.status !== "ONGOING") {
            return null;
        }

        // 종료일 데이터가 없으면 표시하지 않음
        if (!project.endDate) {
            return null;
        }

        const today = new Date();

        // 오늘 날짜만 비교하기 위해 시/분/초 제거
        today.setHours(0, 0, 0, 0);

        const endDate = new Date(project.endDate);

        if (Number.isNaN(endDate.getTime())) {
            return null;
        }

        // 종료일도 날짜 단위로 비교
        endDate.setHours(0, 0, 0, 0);

        // 날짜 차이 계산
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(
            diffTime / (1000 * 60 * 60 * 24)
        );

        // 이미 종료된 프로젝트
        if (diffDays < 0) {
            return "마감";
        }

        // 오늘 마감
        if (diffDays === 0) {
            return "오늘 마감";
        }

        // 내일 마감
        if (diffDays === 1) {
            return "내일 마감";
        }

        // 2일 이상 남은 경우
        return `D-${diffDays}`;
    };

    // ============================================================
    // 추가: 계산된 마감 문구
    // ============================================================
    const deadlineText = getDeadlineText();

    return (
        <div
            className="project-card"
            onClick={handleClick}
        >
            {/* 썸네일 영역 */}
            <div className="project-card-image-wrapper">

                {project.thumbnailImage && (
                    <img
                        className="project-card-image"
                        src={project.thumbnailImage}
                        alt={project.title}
                    />
                )}

                {/* 수정: 실제 종료일 기준으로 마감 표시 */}
                {deadlineText && (
                    <span className="project-card-deadline">
                        {deadlineText}
                    </span>
                )}
            </div>

            {/* 프로젝트 정보 */}
            <div className="project-card-content">

                <h2 className="project-card-title">
                    {project.title}
                </h2>

                {/* 추가: 설명 3줄 제한 */}
                <p className="project-card-description">
                    {project.description}
                </p>

            </div>

            {/* 추가: 펀딩 버튼 */}
            <button
                type="button"
                className="project-card-funding-button"
                onClick={(e) => {
                    // 추가: 카드 클릭 이벤트가 버튼까지 전달되지 않도록 방지
                    e.stopPropagation();
                }}
            >
                펀딩하기
            </button>
        </div>
    );
}

export default ProjectCard;