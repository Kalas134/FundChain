import { useEffect } from "react";
import useProjects from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";


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
    // fetchProjects();
    // }, [fetchProjects]);
    // 로 변경

    if (loading) {
        return <div>프로젝트 목록을 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const projectList = projects.map(
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
                projects.length > 0
                    ? projectList
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