import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useProjects from "../hooks/useProjects";

function ProjectDetailPage() {

    const { projectId } = useParams();

    const navigate = useNavigate();

    const {
        project,
        loading,
        error,
        fetchProject,
        removeProject
    } = useProjects();

    useEffect(() => {
        fetchProject(projectId);
    }, [projectId, fetchProject]);

    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) {
            return;
        }
        try {
            // TODO
            // JWT 적용 후 userId는 토큰에서 가져오기
            const userId = localStorage.getItem("userId");
            await removeProject(
                projectId,
                userId
            );
            alert("프로젝트가 삭제되었습니다.");
            navigate("/projects");
        } catch (e) {
            console.error(e);
            alert("삭제 실패");
        }
    };

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
                {Number(project.targetAmount).toLocaleString()}원
            </p>
            <p>
                시작일 :
                {new Date(project.startDate).toLocaleDateString("ko-KR")}
            </p>
            <p>
                종료일 :
                {new Date(project.endDate).toLocaleDateString("ko-KR")}
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
            <hr />
            <div className="ProjectDetailBtn">
                <button className="ProjectDetailEditBtn"
                    onClick={() =>
                        navigate(`/projects/${projectId}/edit`)
                    }
                >
                    수정
                </button>
                <button
                    onClick={handleDelete}
                >
                    삭제
                </button>
            </div>
        </div>
    );
}

export default ProjectDetailPage;