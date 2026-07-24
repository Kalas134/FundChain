import { useState, useCallback } from "react";

import {
    getProjects,
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
     * 프로젝트 목록 조회
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
     * 프로젝트 상세 조회
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
        fetchProject,
        addProject,
        editProject,
        removeProject

    };
};


export default useProjects;