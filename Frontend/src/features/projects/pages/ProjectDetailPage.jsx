import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useProjects from "../hooks/useProjects";
import "../../../styles/frame.css";

function ProjectDetailPage() {

    const { projectId } = useParams();

    const {
        project,
        loading,
        error,
        fetchProject
    } = useProjects();

    useEffect(() => {
        fetchProject(projectId);
    }, [projectId, fetchProject]);

    if (loading) {
        return (
            <div className="ProjectDetailPage">
                <div className="ProjectDetailLoading">
                    프로젝트 정보를 불러오는 중입니다...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ProjectDetailPage">
                <div className="ProjectDetailError">
                    {error}
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="ProjectDetailPage">
                <div className="ProjectDetailError">
                    프로젝트가 존재하지 않습니다.
                </div>
            </div>
        );
    }

    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const today = new Date();

    const isEnded = today > endDate;

    return (
        <div className="ProjectDetailPage">

            <div className="ProjectDetailContainer">

                {/* 프로젝트 이미지 */}
                <div className="ProjectDetailImageBox">
                    {project.thumbnailImage ? (
                        <img
                            src={project.thumbnailImage}
                            alt={project.title}
                            className="ProjectDetailImage"
                        />
                    ) : (
                        <div className="ProjectDetailNoImage">
                            이미지가 없습니다.
                        </div>
                    )}
                </div>

                {/* 프로젝트 기본 정보 */}
                <section className="ProjectDetailInfo">

                    <div className="ProjectDetailStatus">
                        {isEnded ? "마감" : "진행중"}
                    </div>

                    <h1 className="ProjectDetailTitle">
                        {project.title}
                    </h1>

                    <div className="ProjectDetailCreator">
                        작성자&nbsp; {project.creatorId}
                    </div>

                    <div className="ProjectDetailAmount">
                        <span>목표 금액</span>
                        <strong>
                            {Number(project.targetAmount).toLocaleString("ko-KR")}원
                        </strong>
                    </div>

                    <div className="ProjectDetailDate">

                        <div>
                            <span>펀딩 시작</span>
                            <strong>
                                {startDate.toLocaleDateString("ko-KR")}
                            </strong>
                        </div>

                        <div>
                            <span>펀딩 종료</span>
                            <strong>
                                {endDate.toLocaleDateString("ko-KR")}
                            </strong>
                        </div>

                    </div>

                    <button
                        className="ProjectDetailFundingBtn"
                        disabled={isEnded}
                    >
                        {isEnded ? "마감된 프로젝트" : "펀딩하기"}
                    </button>

                </section>

                {/* 프로젝트 설명 */}
                <section className="ProjectDetailContent">

                    <h2>프로젝트 소개</h2>

                    <div
                        className="ProjectDetailContentBody"
                        dangerouslySetInnerHTML={{
                            __html: project.contentHtml
                        }}
                    />

                </section>

            </div>

        </div>
    );
}

export default ProjectDetailPage;