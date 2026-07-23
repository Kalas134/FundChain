import { Route } from "react-router-dom";

import ProjectDetailPage from "../features/projects/pages/ProjectDetailPage";
import ProjectCreatePage from "../features/projects/pages/ProjectCreatePage";

const ProjectRouter = (
    <>
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/projects" element={<ProjectCreatePage />} />
    </>
)

export default ProjectRouter;