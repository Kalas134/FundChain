package com.fundchain.project.controller;

import com.fundchain.mypage.dto.SponsoredProjectResponse;
import com.fundchain.mypage.dto.SupportRequest;
import com.fundchain.project.dto.ProjectCreateRequest;
import com.fundchain.project.dto.ProjectResponse;
import com.fundchain.project.dto.ProjectUpdateRequest;
import com.fundchain.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@Tag(name = "프로젝트 API", description = "프로젝트 CRUD")
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {


    private final ProjectService projectService;


    /**
     * 프로젝트 등록
     *
     * POST /api/projects
     *
     * 로그인한 사용자의 JWT에서 userId를 가져온다.
     */
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody ProjectCreateRequest request,
            Authentication authentication
    ) {

        String creatorId = authentication.getName();


        ProjectResponse response =
                projectService.createProject(
                        request,
                        creatorId
                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    /**
     * 프로젝트 목록 조회
     *
     * GET /api/projects
     *
     * 비로그인 사용자도 조회 가능
     */
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects() {

        List<ProjectResponse> response =
                projectService.getProjects();

        return ResponseEntity.ok(response);
    }


    /**
     * 특정 크리에이터의 프로젝트 목록 조회
     *
     * GET /api/projects/creator/{creatorId}
     *
     * 비로그인 사용자도 조회 가능
     */
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByCreator(
            @PathVariable String creatorId
    ) {

        List<ProjectResponse> response =
                projectService.getProjectsByCreator(
                        creatorId
                );

        return ResponseEntity.ok(response);
    }


    /**
     * 프로젝트 상세 조회
     *
     * GET /api/projects/{projectId}
     *
     * 비로그인 사용자도 조회 가능
     */
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable Long projectId
    ) {

        ProjectResponse response =
                projectService.getProject(projectId);

        return ResponseEntity.ok(response);
    }


    /**
     * 프로젝트 수정
     *
     * PUT /api/projects/{projectId}
     *
     * 로그인한 사용자의 JWT에서 userId를 가져온다.
     */
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectUpdateRequest request,
            Authentication authentication
    ) {

        String userId = authentication.getName();


        ProjectResponse response =
                projectService.updateProject(
                        projectId,
                        request,
                        userId
                );


        return ResponseEntity.ok(response);
    }


    /**
     * 프로젝트 삭제
     *
     * DELETE /api/projects/{projectId}
     *
     * 로그인한 사용자의 JWT에서 userId를 가져온다.
     */
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId,
            Authentication authentication
    ) {

        String userId = authentication.getName();


        projectService.deleteProject(
                projectId,
                userId
        );


        return ResponseEntity
                .noContent()
                .build();
    }

    /**
     * 프로젝트 후원 API
     *
     * POST /api/projects/{projectId}/support
     *
     * 로그인한 사용자의 JWT에서 userId를 가져와 특정 프로젝트에 금액을 후원합니다.
     */
    @Operation(summary = "프로젝트 후원하기", description = "특정 프로젝트에 금액을 후원합니다.")
    @PostMapping("/{projectId}/support")
    public ResponseEntity<SponsoredProjectResponse> supportProject(
            @PathVariable Long projectId,
            @RequestBody SupportRequest request,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        SponsoredProjectResponse response = projectService.supportProject(projectId, request.getAmount(), userId);
        return ResponseEntity.ok(response);
    }
}