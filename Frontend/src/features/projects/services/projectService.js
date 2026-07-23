import api from "../../../services/api";

// 프로젝트 목록 조회

export const getProjects = async () => {
    const response = await api.get(
        "/api/projects"
    );
    return response.data;
};

// 프로젝트 상세 조회

export const getProject = async(projectId) => {
    const response = await api.get(
        `/api/projects/${projectId}`
    );
    return response.data;
};

// 프로젝트 등록

export const createProject = async (
    projectData,
    creatorId
) => {
    const response = await api.post(
        `/api/projects?creatorId=${creatorId}`,
        projectData
    );
    return response.data;
}

// 프로젝트 수정

export const updateProject = async (
    projectId,
    projectData,
    userId
) => {
    const response = await api.put(
        `/api/projects/${projectId}?userId=${userId}`,
        projectData
    );
    return response.data;
}

// 프로젝트 삭제

export const deleteProject = async (
    projectId,
    userId
) => {
    await api.delete(
        `/api/projects/${projectId}?userId=${userId}`
    );
};