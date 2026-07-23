import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useProjects from "../hooks/useProjects";

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
    }, [projectId]);

    if (loading) {
        return (
            <div>
                프로젝트 정보를 불러오는 중입니다...
            </div>
        );
    }

    if (error) {
        return (
            <div>
                {error}
            </div>
        );
    }

    if (!project) {
        return (
            <div>
                프로젝트가 존재하지 않습니다.
            </div>
        );
    }

    return (
        <div>
            <h1>
                {project.title}
            </h1>
            {
                project.thumbnailImage && (
                    <img
                        src={project.thumbnailImage}
                        alt={project.title}
                    />
                )
            }
            <p>
                작성자 :
                {project.creatorId}
            </p>
            <p>
                목표 금액 :
                {project.targetAmount.toLocaleString()}원
            </p>
            <p>
                시작일 :
                {project.startDate}
            </p>
            <p>
                종료일 :
                {project.endDate}
            </p>
            <p>
                상태 :
                {project.status}
            </p>
            <hr />
            <div
                dangerouslySetInnerHTML={{
                    __html: project.contentHtml
                }}
            />
        </div>
    );
}

export default ProjectDetailPage;