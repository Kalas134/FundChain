package com.fundchain.project.controller;

import com.fundchain.project.dto.ProjectCreateRequest;
import com.fundchain.project.dto.ProjectResponse;
import com.fundchain.project.dto.ProjectUpdateRequest;
import com.fundchain.project.service.ProjectService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
     */
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody ProjectCreateRequest request

            /*
             * 현재 JWT 인증 구현 전 임시 처리
             *
             * 추후 변경:
             *
             * @AuthenticationPrincipal CustomUserDetails userDetails
             *
             * 또는
             *
             * SecurityContextHolder.getContext()
             *        .getAuthentication()
             *
             * 을 통해 인증된 사용자의 ID 추출 예정
             */
            ,
            @RequestParam String creatorId
    ) {

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
     */
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects() {

        List<ProjectResponse> response =
                projectService.getProjects();

        return ResponseEntity.ok(response);
    }



    /**
     * 프로젝트 상세 조회
     *
     * GET /api/projects/{projectId}
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
     */
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectUpdateRequest request

            /*
             * 현재 JWT 인증 전 임시 처리
             *
             * 추후 인증 객체에서 userId 추출 예정
             */
            ,
            @RequestParam String userId
    ) {

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
     */
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId

            /*
             * 현재 JWT 인증 전 임시 처리
             *
             * 추후 인증 객체에서 userId 추출 예정
             */
            ,
            @RequestParam String userId
    ) {

        projectService.deleteProject(
                projectId,
                userId
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}