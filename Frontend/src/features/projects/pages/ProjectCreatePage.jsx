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
            // JWT 적용 전 임시 creatorId
            const creatorId = localStorage.getItem("userId");
            const submitData = {
                ...formData,
                // 문자열 -> 숫자 변환
                targetAmount: Number(
                    formData.targetAmount
                ),
                // 날짜 ISO 변환
                startDate:
                    new Date(
                        formData.startDate
                    ).toISOString(),
                endDate:
                    new Date(
                        formData.endDate
                    ).toISOString(),
                // HTML 태그 보정
                contentHtml:
                    formData.contentHtml.startsWith("<p>")
                        ? formData.contentHtml
                        :
                        `<p>${formData.contentHtml}</p>`
            };

            await addProject(
                submitData,
                creatorId
            );

            alert(
                "프로젝트가 등록되었습니다."
            );

            navigate("/projects");
        } catch (e) {
            console.error(e);
            alert(
                "프로젝트 등록 실패"
            );
        }
    };


    return (
        <div>
            <h1>
                프로젝트 등록
            </h1>

            <ProjectForm
                onSubmit={handleSubmit}
                submitText="등록"
            />
        </div>
    );
}


export default ProjectCreatePage;