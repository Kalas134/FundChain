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


    // ============================================================
    // 추가: PREPARING 상태 프로젝트 목록 노출 방지
    //
    // PREPARING:
    // 아직 공개/진행 전인 프로젝트이므로
    // 일반 프로젝트 목록에서는 표시하지 않는다.
    //
    // DB 프로젝트와 목업 프로젝트 모두 동일하게 적용된다.
    // ============================================================
    if (project.status === "PREPARING") {
        return null;
    }


    // ============================================================
    // 추가: 프로젝트 상태 표시 처리
    //
    // DB 프로젝트:
    // project.isMock이 없으므로 실제 DB의 status를 사용한다.
    //
    // 목업 프로젝트:
    // isMock === true인 경우에는 임시 데이터이므로
    // 현재 목록 화면에서는 별도의 상태 처리를 한다.
    // ============================================================
    let projectStatus = "";
    let showDeadline = false;

    if (project.isMock) {

        // 추가: 목업 데이터는 실제 DB status를 사용하지 않는다.
        // 현재는 임시 테스트용으로 진행중 상태로 표시한다.
        projectStatus = "진행중";

    } else {

        // 추가: 실제 DB 프로젝트는 DB에서 가져온 status를 사용한다.
        projectStatus = project.status;

        // 추가: DB 프로젝트의 status가 실제 마감 상태인 경우
        // 마감 표시를 보여준다.
        //
        // 주의:
        // 여기의 "FAILED" 등 상태값은 실제 DB에서 사용하는
        // status 값에 맞춰야 한다.
        if (
            project.status === "FAILED" ||
            project.status === "CLOSED" ||
            project.status === "ENDED"
        ) {
            showDeadline = true;
        }
    }


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

                {/* 수정: 항상 "오늘 마감"을 표시하지 않고
                    실제 프로젝트 상태에 따라서 표시 */}
                {
                    showDeadline && (
                        <span className="project-card-deadline">
                            오늘 마감
                        </span>
                    )
                }

            </div>

            {/* 프로젝트 정보 */}
            <div className="project-card-content">

                <h2 className="project-card-title">
                    {project.title}
                </h2>

                <p className="project-card-description">
                    {project.description}
                </p>

                {/* 추가: 프로젝트 상태 표시 */}
                <p className="project-card-status">
                    상태 : {projectStatus}
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