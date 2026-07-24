import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProjectForm from "../components/ProjectForm";
import useProjects from "../hooks/useProjects";

function ProjectEditPage() {

    const { projectId } = useParams();
    const navigate = useNavigate();

    const {
        project,
        loading,
        error,
        fetchProject,
        editProject
    } = useProjects();

    useEffect(() => {
        fetchProject(projectId);
    }, [projectId]);
    const handleSubmit = async (formData) => {
        try {
            // TODO
            // JWT 적용 후 userId는 토큰에서 가져오기
            const userId = localStorage.getItem("userId");
            await editProject(
                projectId,
                formData,
                userId
            );
            alert("프로젝트가 수정되었습니다.");
            navigate(`/projects/${projectId}`);
        } catch (e) {
            console.error(e);
            alert("프로젝트 수정에 실패했습니다.");
        }
    };

    if (loading) {
        return <div>프로젝트 정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!project) {
        return <div>프로젝트가 존재하지 않습니다.</div>;
    }

    return (
        <div>
            <h1>프로젝트 수정</h1>
            <ProjectForm
                initialData={project}
                onSubmit={handleSubmit}
                submitText="수정"
            />
        </div>
    );
}

export default ProjectEditPage;