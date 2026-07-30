import api from "../../../services/api";

// 프로젝트 목록 조회

export const getProjects = async () => {
    const response = await api.get(
        "/projects"
    );
    return response.data;
};

// 프로젝트 상세 조회

export const getProject = async(projectId) => {
    const response = await api.get(
        `/projects/${projectId}`
    );
    return response.data;
};

// 크리에이터의 프로젝트 조회

export const getProjectsByCreator = async (
    creatorId
) => {
    const response = await api.get(
        `/projects/creator/${creatorId}`
    );

    return response.data;
};

// 프로젝트 등록

export const createProject = async (
    projectData,
    creatorId
) => {
    const response = await api.post(
        `/projects?creatorId=${creatorId}`,
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
        `/projects/${projectId}?userId=${userId}`,
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
        `/projects/${projectId}?userId=${userId}`
    );
};

// 프로젝트 후원

export const supportProject = async (
    projectId,
    amount
) => {
    const response = await api.post(
        `/projects/${projectId}/support`,
        { amount }
    );
    return response.data;
};