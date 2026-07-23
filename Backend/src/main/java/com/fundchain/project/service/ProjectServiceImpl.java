package com.fundchain.project.service;

import com.fundchain.entity.Project;
import com.fundchain.entity.ProjectContent;
import com.fundchain.entity.ProjectStatus;
import com.fundchain.entity.User;
import com.fundchain.project.dto.ProjectCreateRequest;
import com.fundchain.project.dto.ProjectResponse;
import com.fundchain.project.dto.ProjectUpdateRequest;
import com.fundchain.repository.ProjectContentRepository;
import com.fundchain.repository.ProjectRepository;
import com.fundchain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService {


    private final UserRepository userRepository;

    private final ProjectRepository projectRepository;

    private final ProjectContentRepository projectContentRepository;


    /**
     * 프로젝트 생성
     */
    @Override
    @Transactional
    public ProjectResponse createProject(
            ProjectCreateRequest request,
            String creatorId
    ) {

        // 1. 생성자 조회
        User creator = userRepository.findByUserId(creatorId)
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 사용자입니다.")
                );


        // 2. 프로젝트 Entity 생성
        Project project = Project.builder()
                .creator(creator)
                .title(request.getTitle())
                .thumbnailImage(request.getThumbnailImage())
                .targetAmount(request.getTargetAmount())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(ProjectStatus.PREPARING)
                .build();


        // 3. 프로젝트 저장
        Project savedProject = projectRepository.save(project);


        // 4. 상세 내용 저장
        ProjectContent content = ProjectContent.builder()
                .project(savedProject)
                .contentHtml(request.getContentHtml())
                .build();


        savedProject.addProjectContent(content);

        projectContentRepository.save(content);


        return convertToResponse(savedProject);
    }


    /**
     * 프로젝트 목록 조회
     */
    @Override
    public List<ProjectResponse> getProjects() {

        return projectRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    /**
     * 프로젝트 상세 조회
     */
    @Override
    public ProjectResponse getProject(Long projectId) {


        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new IllegalArgumentException("프로젝트가 존재하지 않습니다.")
                );


        return convertToResponse(project);
    }


    /**
     * 프로젝트 수정
     */
    @Override
    @Transactional
    public ProjectResponse updateProject(
            Long projectId,
            ProjectUpdateRequest request,
            String userId
    ) {


        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new IllegalArgumentException("프로젝트가 존재하지 않습니다.")
                );


        // 작성자 검증
        if (!project.getCreator()
                .getUserId()
                .equals(userId)) {

            throw new IllegalArgumentException(
                    "수정 권한이 없습니다."
            );
        }



        project.updateProject(
                request.getTitle(),
                request.getThumbnailImage(),
                request.getTargetAmount(),
                request.getStartDate(),
                request.getEndDate(),
                request.getStatus()
        );

        if (project.getProjectContent() != null) {

            project.getProjectContent()
                    .updateContent(request.getContentHtml());
        }


        return convertToResponse(project);
    }


    /**
     * 프로젝트 삭제
     */
    @Override
    @Transactional
    public void deleteProject(
            Long projectId,
            String userId
    ) {


        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new IllegalArgumentException("프로젝트가 존재하지 않습니다.")
                );


        // 작성자 확인
        if (!project.getCreator()
                .getUserId()
                .equals(userId)) {

            throw new IllegalArgumentException(
                    "삭제 권한이 없습니다."
            );
        }


        projectRepository.delete(project);
    }


    /**
     * Entity -> DTO 변환
     */
    private ProjectResponse convertToResponse(Project project) {


        return ProjectResponse.builder()
                .projectId(project.getProjectId())
                .creatorId(
                        project.getCreator()
                                .getUserId()
                )
                .title(project.getTitle())
                .thumbnailImage(project.getThumbnailImage())
                .targetAmount(project.getTargetAmount())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus())
                .contentHtml(
                        project.getProjectContent() != null
                                ? project.getProjectContent()
                                .getContentHtml()
                                : null
                )
                .build();
    }
}
