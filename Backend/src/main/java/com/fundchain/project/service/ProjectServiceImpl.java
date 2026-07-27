package com.fundchain.project.service;

import com.fundchain.entity.Project;
import com.fundchain.entity.ProjectContent;
import com.fundchain.entity.ProjectStatus;
import com.fundchain.entity.TransactionLedger;
import com.fundchain.entity.User;
import com.fundchain.hashchain.HashChainService;
import com.fundchain.project.dto.ProjectCreateRequest;
import com.fundchain.project.dto.ProjectResponse;
import com.fundchain.project.dto.ProjectUpdateRequest;
import com.fundchain.repository.ProjectContentRepository;
import com.fundchain.repository.ProjectRepository;
import com.fundchain.repository.TransactionLedgerRepository;
import com.fundchain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService {


    private final UserRepository userRepository;

    private final ProjectRepository projectRepository;

    private final ProjectContentRepository projectContentRepository;

    private final TransactionLedgerRepository transactionLedgerRepository;

    private final HashChainService hashChainService;




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
     * 크리에이터의 프로젝트 목록 조회
     */
    @Override
    public List<ProjectResponse> getProjectsByCreator(
            String creatorId
    ) {

        return projectRepository
                .findByCreator_UserId(creatorId)
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
     * 프로젝트 상태 배치 업데이트 (스케줄러에 의해 호출)
     */
    @Override
    @Transactional
    public void processProjectStatusUpdates() {
        OffsetDateTime now = OffsetDateTime.now();

        // 1. PREPARING -> ONGOING (시작일이 도래했고 종료일이 지나지 않은 프로젝트)
        List<Project> preparingProjects = projectRepository.findByStatusAndStartDateLessThanEqual(ProjectStatus.PREPARING, now);
        for (Project project : preparingProjects) {
            if (project.getEndDate().isAfter(now)) {
                project.updateProject(null, null, null, null, null, ProjectStatus.ONGOING);
            }
        }

        // 2. ONGOING -> SUCCESS / FAILED (종료일이 지난 진행 중 프로젝트)
        List<Project> ongoingProjects = projectRepository.findByStatusAndEndDateLessThanEqual(ProjectStatus.ONGOING, now);
        for (Project project : ongoingProjects) {
            updateEndedProjectStatus(project);
        }

        // 3. PREPARING -> SUCCESS / FAILED (종료일마저 지난 시작 전 방치 프로젝트)
        List<Project> expiredPreparingProjects = projectRepository.findByStatusAndEndDateLessThanEqual(ProjectStatus.PREPARING, now);
        for (Project project : expiredPreparingProjects) {
            updateEndedProjectStatus(project);
        }
    }

    private void updateEndedProjectStatus(Project project) {
        BigDecimal totalSupported = transactionLedgerRepository.findTotalAmountByProjectIdAndTransactionType(project.getProjectId(), "SUPPORT");
        if (totalSupported == null) {
            totalSupported = BigDecimal.ZERO;
        }

        if (totalSupported.compareTo(project.getTargetAmount()) >= 0) {
            // 1. 목표 금액 달성 -> SUCCESS
            project.updateProject(null, null, null, null, null, ProjectStatus.SUCCESS);

            // 2. 자동 정산 (SETTLEMENT) 해시체인 트랜잭션 기록 (중복 생성 방지)
            if (totalSupported.compareTo(BigDecimal.ZERO) > 0 &&
                    !transactionLedgerRepository.existsByProjectIdAndTransactionType(project.getProjectId(), "SETTLEMENT")) {
                String creatorId = project.getCreator().getUserId();
                hashChainService.createTransaction(
                        project.getProjectId(),
                        creatorId,
                        totalSupported.longValue(),
                        "SETTLEMENT"
                );
            }
        } else {
            // 1. 목표 금액 미달 -> FAILED
            project.updateProject(null, null, null, null, null, ProjectStatus.FAILED);

            // 2. 자동 환불 (REFUND) 해시체인 트랜잭션 기록 (중복 생성 방지)
            if (!transactionLedgerRepository.existsByProjectIdAndTransactionType(project.getProjectId(), "REFUND")) {
                List<TransactionLedger> supportLedgers = transactionLedgerRepository.findByProjectIdAndTransactionType(project.getProjectId(), "SUPPORT");
                for (TransactionLedger ledger : supportLedgers) {
                    hashChainService.createTransaction(
                            project.getProjectId(),
                            ledger.getUserId(),
                            ledger.getAmount(),
                            "REFUND"
                    );
                }
            }
        }
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
