import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import useProjects from "../hooks/useProjects";

function ProjectCreatePage() {

    const navigate = useNavigate();

    const {
        addProject
    } = useProjects();

    const handleSubmit = async (formData) => {
        try {

            // TODO
            // JWT 적용 전 임시 creatorId
            const creatorId = "creator1";
            await addProject(
                formData,
                creatorId
            );
            alert("프로젝트가 등록되었습니다.");
            navigate("/projects");
        } catch (e) {
            console.error(e);
            alert("등록 실패");
        }
    };
    return (
        <div>
            <h1>프로젝트 등록</h1>
            <ProjectForm
                onSubmit={handleSubmit}
                submitText="등록"
            />
        </div>
    );
}

export default ProjectCreatePage;