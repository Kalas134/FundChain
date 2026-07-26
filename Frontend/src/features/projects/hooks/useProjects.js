import { useState, useCallback } from "react";

import {
    getProjects,
    getProjectsByCreator,
    getProject,
    createProject,
    updateProject,
    deleteProject
} from "../services/projectService";


const useProjects = () => {

    // 프로젝트 목록
    const [projects, setProjects] = useState([]);

    // 프로젝트 상세
    const [project, setProject] = useState(null);

    // 로딩 상태
    const [loading, setLoading] = useState(false);

    // 에러 상태
    const [error, setError] = useState(null);


    /**
     * 프로젝트 전체 목록 조회
     *
     * GET /api/projects
     *
     * 로그인 사용자와 관계없이
     * 모든 프로젝트를 조회할 때 사용
     */
    const fetchProjects = useCallback(
        async () => {

            try {

                setLoading(true);
                setError(null);

                const data = await getProjects();

                setProjects(data);

            } catch (err) {

                setError(
                    err.response?.data ||
                    "프로젝트 목록 조회 실패"
                );

            } finally {

                setLoading(false);

            }

        },
        []
    );


    /**
     * 로그인한 크리에이터의 프로젝트 목록 조회
     *
     * GET /api/projects/creator/{creatorId}
     *
     * localStorage에 저장된 userId를 사용하여
     * 현재 로그인한 사용자가 만든 프로젝트만 조회
     */
    const fetchMyProjects = useCallback(
        async () => {

            try {

                setLoading(true);
                setError(null);

                // localStorage에서 현재 로그인 사용자 ID 조회
                const userId = localStorage.getItem("userId");

                if (!userId) {
                    throw new Error(
                        "로그인 사용자 정보가 없습니다."
                    );
                }

                // 현재 로그인한 사용자의 프로젝트만 조회
                const data = await getProjectsByCreator(userId);

                setProjects(data);

            } catch (err) {

                setError(
                    err.response?.data ||
                    err.message ||
                    "내 프로젝트 목록 조회 실패"
                );

            } finally {

                setLoading(false);

            }

        },
        []
    );


    /**
     * 프로젝트 상세 조회
     *
     * GET /api/projects/{projectId}
     */
    const fetchProject = useCallback(
        async (
            projectId
        ) => {

            try {

                setLoading(true);
                setError(null);

                const data = await getProject(
                    projectId
                );

                setProject(data);

            } catch (err) {

                setError(
                    err.response?.data ||
                    "프로젝트 조회 실패"
                );

            } finally {

                setLoading(false);

            }

        },
        []
    );


    /**
     * 프로젝트 등록
     *
     * POST /api/projects?creatorId={creatorId}
     */
    const addProject = useCallback(
        async (
            projectData,
            creatorId
        ) => {

            try {

                setLoading(true);
                setError(null);

                const data = await createProject(
                    projectData,
                    creatorId
                );

                return data;

            } catch (err) {

                setError(
                    err.response?.data ||
                    "프로젝트 등록 실패"
                );

                throw err;

            } finally {

                setLoading(false);

            }

        },
        []
    );


    /**
     * 프로젝트 수정
     *
     * PUT /api/projects/{projectId}?userId={userId}
     */
    const editProject = useCallback(
        async (
            projectId,
            projectData,
            userId
        ) => {

            try {

                setLoading(true);
                setError(null);

                const data = await updateProject(
                    projectId,
                    projectData,
                    userId
                );

                return data;

            } catch (err) {

                setError(
                    err.response?.data ||
                    "프로젝트 수정 실패"
                );

                throw err;

            } finally {

                setLoading(false);

            }

        },
        []
    );


    /**
     * 프로젝트 삭제
     *
     * DELETE /api/projects/{projectId}?userId={userId}
     */
    const removeProject = useCallback(
        async (
            projectId,
            userId
        ) => {

            try {

                setLoading(true);
                setError(null);

                await deleteProject(
                    projectId,
                    userId
                );

            } catch (err) {

                setError(
                    err.response?.data ||
                    "프로젝트 삭제 실패"
                );

                throw err;

            } finally {

                setLoading(false);

            }

        },
        []
    );


    return {

        // state
        projects,
        project,
        loading,
        error,


        // methods
        fetchProjects,
        fetchMyProjects,
        fetchProject,
        addProject,
        editProject,
        removeProject

    };
};


export default useProjects;