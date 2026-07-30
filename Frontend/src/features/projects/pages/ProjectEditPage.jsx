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
        if (projectId) {
            fetchProject(projectId);
        }
    }, [projectId, fetchProject]);

    const handleSubmit = async (formData) => {
        try {
            // JWT 적용 후 userId는 토큰에서 가져오기
            const userId = localStorage.getItem("userId");
            const submitData = {
                ...formData,
                targetAmount: Number(formData.targetAmount),
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                contentHtml: formData.contentHtml.startsWith("<p>")
                    ? formData.contentHtml
                    : `<p>${formData.contentHtml}</p>`
            };

            await editProject(
                projectId,
                submitData,
                userId
            );
            alert("프로젝트가 성공적으로 수정되었습니다.");
            navigate(`/projects/${projectId}`);
        } catch (e) {
            console.error(e);
            alert("프로젝트 수정에 실패했습니다. 입력 정보를 확인해주세요.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] w-full bg-bg">
            <main className="container-custom pt-10 pb-16">

                {/* Header Title Section */}
                <div className="mb-8 border-b border-slate-200 pb-6 text-left">
                    <span className="mb-2 inline-block text-xs font-bold tracking-widest text-accent uppercase">
                        EDIT PROJECT
                    </span>
                    <h1 className="text-3xl font-bold text-thcolor my-1">
                        프로젝트 수정
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base">
                        등록된 프로젝트 정보를 수정하고 최신 변경사항으로 업데이트해 보세요.
                    </p>
                </div>

                {/* Form Wrapper or State Feedback */}
                {loading ? (
                    <div className="flex justify-center items-center py-20 rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 text-base font-medium">
                                프로젝트 정보를 불러오는 중입니다...
                            </p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col justify-center items-center py-20 rounded-2xl border border-dashed border-slate-300 bg-white space-y-4 text-center p-6">
                        <p className="text-rose-500 font-semibold text-lg">
                            {typeof error === "string" ? error : "프로젝트 정보를 불러오는 중 오류가 발생했습니다."}
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/projects")}
                            className="btn-primary text-sm"
                        >
                            프로젝트 목록으로 돌아가기
                        </button>
                    </div>
                ) : !project ? (
                    <div className="flex flex-col justify-center items-center py-20 rounded-2xl border border-dashed border-slate-300 bg-white space-y-4 text-center p-6">
                        <p className="text-slate-600 font-medium text-lg">
                            존재하지 않거나 접근할 수 없는 프로젝트입니다.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/projects")}
                            className="btn-primary text-sm"
                        >
                            프로젝트 목록으로 돌아가기
                        </button>
                    </div>
                ) : (
                    <div className="w-full">
                        <ProjectForm
                            initialData={project}
                            onSubmit={handleSubmit}
                            submitText="프로젝트 수정 완료"
                        />
                    </div>
                )}

            </main>
        </div>
    );
}

export default ProjectEditPage;