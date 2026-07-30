package com.fundchain.project.service;

import com.fundchain.entity.Project;
import com.fundchain.entity.ProjectContent;
import com.fundchain.entity.ProjectStatus;
import com.fundchain.entity.SupportHistory;
import com.fundchain.entity.TransactionLedger;
import com.fundchain.entity.User;
import com.fundchain.hashchain.HashChainService;
import com.fundchain.mypage.dto.SponsoredProjectResponse;
import com.fundchain.project.dto.ProjectCreateRequest;
import com.fundchain.project.dto.ProjectResponse;
import com.fundchain.project.dto.ProjectUpdateRequest;
import com.fundchain.repository.ProjectContentRepository;
import com.fundchain.repository.ProjectRepository;
import com.fundchain.repository.TransactionLedgerRepository;
import com.fundchain.repository.SupportHistoryRepository;
import com.fundchain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService {


    private final UserRepository userRepository;

    private final ProjectRepository projectRepository;

    private final ProjectContentRepository projectContentRepository;

    private final TransactionLedgerRepository transactionLedgerRepository;

    private final SupportHistoryRepository supportHistoryRepository;

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

        // ========================================================
        // 1. 생성자 조회
        //
        // 탈퇴하지 않은 회원만 조회
        // ========================================================

        User creator = userRepository
                .findByUserIdAndIsDeletedFalse(creatorId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "존재하지 않는 회원이거나 탈퇴한 회원입니다."
                        )
                );


        // ========================================================
        // 2. CREATOR 권한 검증
        //
        // USER → 프로젝트 생성 불가
        // CREATOR → 프로젝트 생성 가능
        // ADMIN → 현재 프로젝트 생성 권한 없음
        // ========================================================

        if (!"CREATOR".equals(creator.getUserRole())) {

            throw new IllegalArgumentException(
                    "크리에이터만 프로젝트를 생성할 수 있습니다."
            );
        }


        // ========================================================
        // 3. 프로젝트 Entity 생성
        //
        // 시작일(startDate)이 현재 일시 이하인 경우 즉시 ONGOING으로 설정,
        // 미래 시점인 경우 PREPARING으로 설정
        // ========================================================

        OffsetDateTime now = OffsetDateTime.now();
        ProjectStatus initialStatus = ProjectStatus.PREPARING;
        if (request.getStartDate() != null && !request.getStartDate().isAfter(now)) {
            initialStatus = ProjectStatus.ONGOING;
        }

        Project project = Project.builder()
                .creator(creator)
                .title(request.getTitle())
                .thumbnailImage(request.getThumbnailImage())
                .targetAmount(request.getTargetAmount())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(initialStatus)
                .build();


        // ========================================================
        // 4. 프로젝트 저장
        // ========================================================

        Project savedProject =
                projectRepository.save(project);


        // ========================================================
        // 5. 프로젝트 상세 내용 저장
        // ========================================================

        ProjectContent content =
                ProjectContent.builder()
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

        Project project =
                projectRepository.findById(projectId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "프로젝트가 존재하지 않습니다."
                                )
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

        Project project =
                projectRepository.findById(projectId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "프로젝트가 존재하지 않습니다."
                                )
                        );


        // ========================================================
        // 프로젝트 작성자 확인
        // ========================================================

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
                    .updateContent(
                            request.getContentHtml()
                    );
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

        Project project =
                projectRepository.findById(projectId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "프로젝트가 존재하지 않습니다."
                                )
                        );


        // ========================================================
        // 프로젝트 작성자 확인
        // ========================================================

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
     * 프로젝트 상태 배치 업데이트
     *
     * 스케줄러에 의해 호출
     */
    @Override
    @Transactional
    public void processProjectStatusUpdates() {

        OffsetDateTime now =
                OffsetDateTime.now();


        // ========================================================
        // 1. PREPARING → ONGOING
        // ========================================================

        List<Project> preparingProjects =
                projectRepository
                        .findByStatusAndStartDateLessThanEqual(
                                ProjectStatus.PREPARING,
                                now
                        );


        for (Project project : preparingProjects) {

            if (project.getEndDate().isAfter(now)) {

                project.updateProject(
                        null,
                        null,
                        null,
                        null,
                        null,
                        ProjectStatus.ONGOING
                );
            }
        }


        // ========================================================
        // 2. ONGOING → SUCCESS / FAILED
        // ========================================================

        List<Project> ongoingProjects =
                projectRepository
                        .findByStatusAndEndDateLessThanEqual(
                                ProjectStatus.ONGOING,
                                now
                        );


        for (Project project : ongoingProjects) {

            updateEndedProjectStatus(project);
        }


        // ========================================================
        // 3. PREPARING → SUCCESS / FAILED
        //
        // 시작하지 않았지만 종료일까지 지난 경우
        // ========================================================

        List<Project> expiredPreparingProjects =
                projectRepository
                        .findByStatusAndEndDateLessThanEqual(
                                ProjectStatus.PREPARING,
                                now
                        );


        for (Project project : expiredPreparingProjects) {

            updateEndedProjectStatus(project);
        }
    }


    /**
     * 종료된 프로젝트 상태 처리
     */
    private void updateEndedProjectStatus(
            Project project
    ) {

        BigDecimal totalSupported =
                transactionLedgerRepository
                        .findTotalAmountByProjectIdAndTransactionType(
                                project.getProjectId(),
                                "SUPPORT"
                        );


        if (totalSupported == null) {

            totalSupported =
                    BigDecimal.ZERO;
        }


        // ========================================================
        // 목표 금액 달성
        // ========================================================

        if (totalSupported.compareTo(
                project.getTargetAmount()
        ) >= 0) {

            project.updateProject(
                    null,
                    null,
                    null,
                    null,
                    null,
                    ProjectStatus.SUCCESS
            );


            // 자동 정산
            if (
                    totalSupported.compareTo(
                            BigDecimal.ZERO
                    ) > 0
                            &&
                            !transactionLedgerRepository
                                    .existsByProjectIdAndTransactionType(
                                            project.getProjectId(),
                                            "SETTLEMENT"
                                    )
            ) {

                String creatorId =
                        project.getCreator()
                                .getUserId();


                hashChainService.createTransaction(
                        project.getProjectId(),
                        creatorId,
                        totalSupported.longValue(),
                        "SETTLEMENT"
                );
            }


            // ========================================================
            // 목표 금액 미달
            // ========================================================

        } else {

            project.updateProject(
                    null,
                    null,
                    null,
                    null,
                    null,
                    ProjectStatus.FAILED
            );


            // 자동 환불
            if (
                    !transactionLedgerRepository
                            .existsByProjectIdAndTransactionType(
                                    project.getProjectId(),
                                    "REFUND"
                            )
            ) {

                List<TransactionLedger> supportLedgers =
                        transactionLedgerRepository
                                .findByProjectIdAndTransactionType(
                                        project.getProjectId(),
                                        "SUPPORT"
                                );


                for (TransactionLedger ledger :
                        supportLedgers) {

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
     * Entity → DTO 변환
     */
    private ProjectResponse convertToResponse(
            Project project
    ) {

        // 프로젝트별 DB 누적 후원 금액 집계
        BigDecimal currentAmount =
                supportHistoryRepository.findTotalSupportedAmountByProjectId(
                        project.getProjectId()
                );

        if (currentAmount == null) {
            currentAmount = BigDecimal.ZERO;
        }

        return ProjectResponse.builder()
                .projectId(
                        project.getProjectId()
                )
                .creatorId(
                        project.getCreator()
                                .getUserId()
                )
                .title(
                        project.getTitle()
                )
                .thumbnailImage(
                        project.getThumbnailImage()
                )
                .targetAmount(
                        project.getTargetAmount()
                )
                .currentAmount(
                        currentAmount
                )
                .startDate(
                        project.getStartDate()
                )
                .endDate(
                        project.getEndDate()
                )
                .status(
                        project.getStatus()
                )
                .contentHtml(
                        project.getProjectContent() != null
                                ? project.getProjectContent()
                                .getContentHtml()
                                : null
                )
                .build();
    }

    /**
     * 프로젝트 후원하기
     */
    @Override
    @Transactional
    public SponsoredProjectResponse supportProject(Long projectId, BigDecimal amount, String userId) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("후원 금액은 0보다 커야 합니다.");
        }

        User user = userRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않거나 탈퇴한 회원입니다."));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 프로젝트입니다."));

        // 1. 크리에이터 회원 후원 금지 검증 (자기 프로젝트 및 모든 타인 프로젝트 포함)
        if ("CREATOR".equalsIgnoreCase(user.getUserRole()) || (project.getCreator() != null && userId.equals(project.getCreator().getUserId()))) {
            throw new IllegalArgumentException("크리에이터 회원은 후원을 할 수 없습니다.");
        }

        // 2. 이미 펀딩한 프로젝트 재펀딩 금지 검증
        if (supportHistoryRepository.existsByProject_ProjectIdAndUser_UserId(projectId, userId)) {
            throw new IllegalArgumentException("이미 펀딩한 프로젝트 입니다.");
        }

        // 3. SupportHistory 저장
        SupportHistory supportHistory = SupportHistory.builder()
                .project(project)
                .user(user)
                .amount(amount)
                .supportedAt(OffsetDateTime.now())
                .build();
        supportHistoryRepository.save(supportHistory);

        // 4. TransactionLedger(해시 체인)에 거래 기록
        hashChainService.createTransaction(projectId, userId, amount.longValue(), "SUPPORT");

        return convertToSponsoredResponse(supportHistory);
    }

    private SponsoredProjectResponse convertToSponsoredResponse(SupportHistory sh) {
        Project project = sh.getProject();
        if (project == null) return null;

        DateTimeFormatter displayFormatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");

        String statusStr;
        String deliveryStr;

        if (project.getStatus() != null) {
            switch (project.getStatus()) {
                case SUCCESS -> {
                    statusStr = "success";
                    deliveryStr = "선물 전달 완료";
                }
                case FAILED -> {
                    statusStr = "canceled";
                    deliveryStr = "환불 처리 완료";
                }
                default -> {
                    statusStr = "reserved";
                    deliveryStr = "후원 예약 (진행중)";
                }
            }
        } else {
            statusStr = "reserved";
            deliveryStr = "후원 예약 (진행중)";
        }

        OffsetDateTime supportedAt = sh.getSupportedAt() != null ? sh.getSupportedAt() : OffsetDateTime.now();
        Long amountVal = sh.getAmount() != null ? sh.getAmount().longValue() : 0L;

        return SponsoredProjectResponse.builder()
                .id(sh.getSupportId())
                .projectId(project.getProjectId())
                .title(project.getTitle() != null ? project.getTitle() : "제목 없음")
                .description(project.getProjectContent() != null && project.getProjectContent().getContentHtml() != null 
                        ? project.getProjectContent().getContentHtml() : "")
                .imageUrl(project.getThumbnailImage())
                .sponsoredDate(supportedAt.format(displayFormatter))
                .price(String.format("%,d원", amountVal))
                .amount(amountVal)
                .status(statusStr)
                .deliveryStatus(deliveryStr)
                .year(supportedAt.getYear())
                .month(supportedAt.getMonthValue())
                .build();
    }
}