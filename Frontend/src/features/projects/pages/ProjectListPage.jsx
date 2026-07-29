import { useEffect } from "react";
import useProjects from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";

// 크리에이터 마이페이지에서 사용하던 목업 프로젝트 데이터
import { mockCreatorProjects } from "../../mypage/mockData";


function ProjectListPage() {

    const {
        projects,
        loading,
        error,
        fetchProjects
    } = useProjects();

    useEffect(() => {
        fetchProjects();
    }, []);

    // HTML 태그 제거 함수
    const stripHtmlTags = (html) => {
        if (!html) {
            return "";
        }
        return html.replace(/<[^>]*>/g, "");
    };

    // 기존 mockCreatorProjects를 ProjectResponse 형태로 변환
    const mockProjects = mockCreatorProjects.map((project) => ({
        projectId: project.projectId,
        creatorId: "mock-creator",
        title: project.title,
        thumbnailImage: project.imageUrl,
        targetAmount: project.targetAmount,
        description: project.description,
        startDate: `${project.year}-${String(project.month).padStart(2, "0")}-01T00:00:00+09:00`,
        endDate: `${project.year}-${String(project.month).padStart(2, "0")}-30T23:59:59+09:00`,
        status: project.status,
        isMock: true,
        contentHtml: `<p>${project.description}</p>`
    }));

    // DB 프로젝트 + 목업 프로젝트 통합
    const dbProjects = Array.isArray(projects) ? projects : [];

    const allProjects = [
        ...dbProjects.map((project) => ({
            ...project,
            description:
                project.description ||
                stripHtmlTags(project.contentHtml) ||
                ""
        })),
        ...mockProjects
    ];

    const projectList = allProjects.map(
        (project) => (
            <ProjectCard
                key={project.projectId}
                project={project}
            />
        )
    );

    return (
        <div className="min-h-[calc(100vh-140px)] w-full bg-bg">
            <main className="container-custom pt-10 pb-16">
                
                {/* Header Title Section */}
                <div className="mb-8 border-b border-slate-200 pb-6 text-left">
                    <span className="mb-2 inline-block text-xs font-bold tracking-widest text-accent uppercase">
                        EXPLORE PROJECTS
                    </span>
                    <h1 className="text-3xl font-bold text-thcolor my-1">
                        프로젝트 둘러보기
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base">
                        새롭고 창의적인 펀딩 프로젝트들을 살펴보고 직접 후원에 참여해보세요.
                    </p>
                </div>

                {
                    loading ? (
                        <div className="flex justify-center items-center py-20">
                            <p className="text-slate-500 text-base animate-pulse">
                                프로젝트 목록을 불러오는 중입니다...
                            </p>
                        </div>
                    ) : allProjects.length > 0 ? (
                        <div className="project-list-grid">
                            {projectList}
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center py-20 rounded-2xl border border-dashed border-slate-300 bg-white">
                            <p className="text-slate-500 font-medium">
                                등록된 프로젝트가 없습니다.
                            </p>
                        </div>
                    )
                }
            </main>
        </div>
    );
}

export default ProjectListPage;