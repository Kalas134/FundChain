import { useEffect } from "react";
import useProjects from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";

// 추가: 크리에이터 마이페이지에서 사용하던 목업 프로젝트 데이터
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

    // 이후에 useCallback 적용시
    // useEffect(() => {
    //     fetchProjects();
    // }, [fetchProjects]);
    // 로 변경


    // ============================================================
    // 추가: HTML 태그 제거 함수
    //
    // DB의 contentHtml이
    // "<p>프로젝트 설명입니다.</p>"
    // 형태로 들어오는 경우,
    // 카드에서는 "프로젝트 설명입니다."만 표시하도록 한다.
    // ============================================================
    const stripHtmlTags = (html) => {
        if (!html) {
            return "";
        }

        return html.replace(/<[^>]*>/g, "");
    };


    // ============================================================
    // 추가: 기존 mockCreatorProjects를 ProjectResponse 형태로 변환
    //
    // mockCreatorProjects의 구조:
    // id, imageUrl, createdDate, description ...
    //
    // ProjectCard가 현재 사용하는 DB 프로젝트 구조:
    // projectId, thumbnailImage, startDate, contentHtml ...
    //
    // 따라서 두 데이터를 같은 구조로 맞춰준다.
    // ============================================================
    const mockProjects = mockCreatorProjects.map((project) => ({
        projectId: project.id,
        creatorId: "mock-creator",
        title: project.title,
        thumbnailImage: project.imageUrl,
        targetAmount: project.targetAmount,

        // 추가: ProjectCard에서 사용할 프로젝트 설명
        description: project.description,

        // 목업의 year/month를 이용해 날짜 형태를 만들어준다.
        startDate: `${project.year}-${String(project.month).padStart(2, "0")}-01T00:00:00+09:00`,
        endDate: `${project.year}-${String(project.month).padStart(2, "0")}-30T23:59:59+09:00`,

        status: project.status,

        // 추가: 해당 데이터가 목업 프로젝트임을 표시
        // ProjectCard에서 목업/DB 프로젝트를 구분하여
        // 상태 표시 방식을 다르게 처리할 때 사용한다.
        isMock: true,

        // 목업의 description을 상세 내용처럼 사용
        contentHtml: `<p>${project.description}</p>`
    }));


    // ============================================================
    // 추가: DB 프로젝트 + 목업 프로젝트를 하나의 목록으로 합친다.
    //
    // DB 프로젝트:
    // projects
    //
    // 목업 프로젝트:
    // mockProjects
    //
    // 실제 DB 데이터가 먼저 나오고 그 뒤에 목업 데이터가 나온다.
    // ============================================================
    const allProjects = [
        // 추가: DB 데이터에도 카드에서 사용할 description을 보완
        ...projects.map((project) => ({
            ...project,

            // DB 응답에 description이 있으면 그대로 사용하고,
            // 없으면 contentHtml을 설명으로 사용한다.
            //
            // 추가: contentHtml에 포함된 HTML 태그를 제거한다.
            description:
                project.description ||
                stripHtmlTags(project.contentHtml) ||
                ""
        })),

        ...mockProjects
    ];


    // ============================================================
    // 수정: projects 대신 allProjects를 사용
    // ============================================================
    const projectList = allProjects.map(
        (project) => (
            <ProjectCard
                key={project.projectId}
                project={project}
            />
        )
    );


    return (
        <div>
            <h1>
                프로젝트 목록
            </h1>

            {
                // 수정: projects.length → allProjects.length
                allProjects.length > 0
                    ? (
                        // 추가: 카드 폭에 맞춰 프로젝트 카드를 가로 배치
                        <div className="project-list-grid">
                            {projectList}
                        </div>
                    )
                    : (
                        <p>
                            등록된 프로젝트가 없습니다.
                        </p>
                    )
            }
        </div>
    );
}

export default ProjectListPage;