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
            const creatorId = localStorage.getItem("userId");
            const submitData = {
                ...formData,
                targetAmount: Number(formData.targetAmount),
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                contentHtml: formData.contentHtml.startsWith("<p>")
                    ? formData.contentHtml
                    : `<p>${formData.contentHtml}</p>`
            };

            await addProject(submitData, creatorId);
            alert("프로젝트가 성공적으로 등록되었습니다.");
            navigate("/projects");
        } catch (e) {
            console.error(e);
            alert("프로젝트 등록에 실패했습니다. 입력 정보를 확인해주세요.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] w-full bg-bg">
            <main className="container-custom pt-10 pb-16">
                
                {/* Header Title Section */}
                <div className="mb-8 border-b border-slate-200 pb-6 text-left">
                    <span className="mb-2 inline-block text-xs font-bold tracking-widest text-accent uppercase">
                        CREATE PROJECT
                    </span>
                    <h1 className="text-3xl font-bold text-thcolor my-1">
                        프로젝트 등록
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base">
                        후원자들에게 인상 깊은 새로운 프로젝트 정보를 입력하고 펀딩을 시작해 보세요.
                    </p>
                </div>

                {/* Form Wrapper - align left edge with title section */}
                <div className="w-full">
                    <ProjectForm
                        onSubmit={handleSubmit}
                        submitText="프로젝트 등록 완료"
                    />
                </div>

            </main>
        </div>
    );
}

export default ProjectCreatePage;