import { Route } from "react-router-dom";

import ProjectListPage from "../features/projects/pages/ProjectListPage";
import ProjectDetailPage from "../features/projects/pages/ProjectDetailPage";
import ProjectCreatePage from "../features/projects/pages/ProjectCreatePage";
import ProjectEditPage from "../features/projects/pages/ProjectEditPage";

const ProjectRouter = (
    <>
        {/* 프로젝트 목록 */}
        <Route
            path="/projects"
            element={<ProjectListPage />}
        />

        {/* 프로젝트 상세 */}
        <Route
            path="/projects/:projectId"
            element={<ProjectDetailPage />}
        />

        {/* 프로젝트 등록 */}
        <Route
            path="/projects/create"
            element={<ProjectCreatePage />}
        />

        {/* 프로젝트 수정 */}
        <Route
            path="/projects/:projectId/edit"
            element={<ProjectEditPage />}
        />
    </>
);

export default ProjectRouter;