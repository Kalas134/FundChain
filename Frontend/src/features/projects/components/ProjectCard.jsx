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

        // 추가: 목업 데이터는 실제 DB status를 사용한다.
        // 목업도 PREPARING / ONGOING / SUCCESS / FAILED
        // 상태값을 그대로 상태 배지에 표시한다.
        projectStatus = project.status;

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


    // ============================================================
    // 추가: 프로젝트 상태별 화면 표시 설정
    //
    // 기존 "오늘 마감" 위치에 상태 배지를 표시한다.
    //
    // PREPARING은 ProjectCard 위에서 이미 return null 처리되므로
    // 여기에서는 ONGOING / SUCCESS / FAILED만 실제로 표시된다.
    // ============================================================
    const STATUS_CONFIG = {
        PREPARING: { label: '준비중', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' },
        ONGOING: { label: '진행중', badgeClass: 'bg-blue-100 text-blue-800 border-blue-300' },
        SUCCESS: { label: '성공', badgeClass: 'bg-accent/15 text-accent font-bold border-accent/40' },
        FAILED: { label: '실패', badgeClass: 'bg-warning/15 text-warning font-bold border-warning/40' }
    };

    const statusInfo = STATUS_CONFIG[projectStatus];


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

                {/* 수정:
                    기존 "오늘 마감" 대신 프로젝트 상태를 표시한다.
                    상태값에 대응하는 색상과 라벨을 함께 표시한다.
                */}
                {
                    statusInfo && (
                        <span
                            className={`project-card-deadline border ${statusInfo.className}`}
                        >
                            {statusInfo.label}
                        </span>
                    )
                }

                {/* 추가:
                    DB에서 별도로 마감 상태로 판단되는 경우
                    기존 "오늘 마감" 표시를 유지한다.
                    단, 상태 배지와 겹치지 않도록 별도로 표시한다.
                */}
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

                {/* 수정:
                    기존의
                    "상태 : 진행중"
                    텍스트는 제거한다.

                    상태는 썸네일 영역의 상태 배지로 표시한다.
                */}

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