package com.fundchain.project.service;

import com.fundchain.project.dto.ProjectCreateRequest;
import com.fundchain.project.dto.ProjectResponse;
import com.fundchain.project.dto.ProjectUpdateRequest;

import java.util.List;

public interface ProjectService {

    /**
     * 프로젝트 생성
     *
     * @param request 프로젝트 생성 정보
     * @param creatorId 프로젝트 생성자 ID
     * @return 생성된 프로젝트 정보
     */
    ProjectResponse createProject(
            ProjectCreateRequest request,
            String creatorId
    );


    /**
     * 프로젝트 목록 조회
     *
     * @return 프로젝트 목록
     */
    List<ProjectResponse> getProjects();


    /**
     * 프로젝트 상세 조회
     *
     * @param projectId 프로젝트 ID
     * @return 프로젝트 상세 정보
     */
    ProjectResponse getProject(Long projectId);


    /**
     * 프로젝트 수정
     *
     * @param projectId 프로젝트 ID
     * @param request 수정 정보
     * @param userId 요청 사용자 ID
     * @return 수정된 프로젝트 정보
     */
    ProjectResponse updateProject(
            Long projectId,
            ProjectUpdateRequest request,
            String userId
    );


    /**
     * 프로젝트 삭제
     *
     * @param projectId 프로젝트 ID
     * @param userId 요청 사용자 ID
     */
    void deleteProject(
            Long projectId,
            String userId
    );
}
