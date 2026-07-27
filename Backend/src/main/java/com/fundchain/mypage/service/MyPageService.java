package com.fundchain.mypage.service;

import com.fundchain.entity.Project;
import com.fundchain.entity.SupportHistory;
import com.fundchain.entity.User;
import com.fundchain.hashchain.HashChainService;
import com.fundchain.mypage.dto.*;
import com.fundchain.repository.ProjectRepository;
import com.fundchain.repository.SupportHistoryRepository;
import com.fundchain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final SupportHistoryRepository supportHistoryRepository;
    private final HashChainService hashChainService;

    /**
     * 회원 정보 조회
     */
    public MyPageResponse getMyPageInfo(String userId) {
        User user = userRepository
                .findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        return MyPageResponse.from(user);
    }

    /**
     * 회원 정보 수정
     */
    @Transactional
    public MyPageUpdateResponse updateMyPageInfo(String userId, MyPageUpdateRequest request) {
        User user = userRepository
                .findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        if (request.getNickname() != null && !request.getNickname().equals(user.getNickname())) {
            if (userRepository.existsByNicknameAndIsDeletedFalse(request.getNickname())) {
                throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
            }
        }

        if (request.getPhoneNum() != null && !request.getPhoneNum().equals(user.getPhoneNum())) {
            if (userRepository.existsByPhoneNumAndIsDeletedFalse(request.getPhoneNum())) {
                throw new IllegalArgumentException("이미 존재하는 전화번호입니다.");
            }
        }

        user.updateMyPageInfo(
                request.getNickname(),
                request.getPhoneNum(),
                request.getBankName(),
                request.getAccountNum()
        );

        return MyPageUpdateResponse.from(user);
    }

    /**
     * 회원 탈퇴 (Soft Delete)
     */
    @Transactional
    public void deleteMyAccount(String userId) {
        User user = userRepository
                .findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        user.deleteAccount();
    }

    /**
     * 프로젝트 후원하기
     * - 후원 시 SupportHistory DB 저장 및 TransactionLedger 블록체인 해시 체인 연동 자동 기록
     */
    @Transactional
    public SponsoredProjectResponse supportProject(Long projectId, BigDecimal amount, String userId) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("후원 금액은 0보다 커야 합니다.");
        }

        User user = userRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않거나 탈퇴한 회원입니다."));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 프로젝트입니다."));

        // 1. SupportHistory 저장
        SupportHistory supportHistory = SupportHistory.builder()
                .project(project)
                .user(user)
                .amount(amount)
                .supportedAt(OffsetDateTime.now())
                .build();
        supportHistoryRepository.save(supportHistory);

        // 2. TransactionLedger(해시 체인)에 거래 기록
        hashChainService.createTransaction(projectId, userId, amount.longValue(), "SUPPORT");

        return convertToSponsoredResponse(supportHistory);
    }

    /**
     * 로그인한 사용자 기준 후원 프로젝트 목록 조회
     */
    public List<SponsoredProjectResponse> getSponsoredProjects(String userId) {
        List<SupportHistory> histories = supportHistoryRepository.findByUser_UserIdOrderBySupportedAtDesc(userId);
        return histories.stream()
                .map(this::convertToSponsoredResponse)
                .toList();
    }

    /**
     * 로그인한 사용자 기준 거래 및 결제 내역 조회
     */
    public List<TransactionHistoryResponse> getTransactionHistory(String userId) {
        List<SupportHistory> histories = supportHistoryRepository.findByUser_UserIdOrderBySupportedAtDesc(userId);
        List<TransactionHistoryResponse> result = new ArrayList<>();

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (SupportHistory sh : histories) {
            Project project = sh.getProject();
            User creator = project.getCreator();

            BigDecimal currentAmount = supportHistoryRepository.findTotalSupportedAmountByProjectId(project.getProjectId());

            result.add(TransactionHistoryResponse.builder()
                    .supportId(sh.getSupportId())
                    .projectId(project.getProjectId())
                    .userId(userId)
                    .amount(sh.getAmount().longValue())
                    .supportedAt(sh.getSupportedAt() != null ? sh.getSupportedAt().format(dateFormatter) : "")
                    .title(project.getTitle())
                    .thumbnailImage(project.getThumbnailImage())
                    .targetAmount(project.getTargetAmount())
                    .currentAmount(currentAmount != null ? currentAmount : BigDecimal.ZERO)
                    .startDate(project.getStartDate() != null ? project.getStartDate().format(dateFormatter) : "")
                    .endDate(project.getEndDate() != null ? project.getEndDate().format(dateFormatter) : "")
                    .status(project.getStatus() != null ? project.getStatus().name() : "ONGOING")
                    .creatorId(creator.getUserId())
                    .creatorNickname(creator.getNickname() != null ? creator.getNickname() : creator.getUserId())
                    .bankName(creator.getBankName() != null ? creator.getBankName() : "등록 계좌")
                    .accountNum(creator.getAccountNum() != null ? creator.getAccountNum() : "")
                    .build());
        }

        return result;
    }

    /**
     * 로그인한 크리에이터 기준 프로젝트 정산 내역 조회 (총 모금액, 플랫폼 수수료 5%, PG 수수료 3%, 최종 실지급액 등 자동 계산)
     */
    public List<SettlementHistoryResponse> getSettlementHistory(String creatorId) {
        List<Project> creatorProjects = projectRepository.findByCreator_UserId(creatorId);
        List<SettlementHistoryResponse> result = new ArrayList<>();

        User creator = userRepository.findByUserIdAndIsDeletedFalse(creatorId).orElse(null);

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (Project project : creatorProjects) {
            BigDecimal totalRaised = supportHistoryRepository.findTotalSupportedAmountByProjectId(project.getProjectId());
            if (totalRaised == null) {
                totalRaised = BigDecimal.ZERO;
            }

            Long backerCountLong = supportHistoryRepository.countDistinctBackersByProjectId(project.getProjectId());
            int backerCount = backerCountLong != null ? backerCountLong.intValue() : 0;

            // 수수료 계산: 플랫폼 5%, PG 3%
            BigDecimal platformFee = totalRaised.multiply(new BigDecimal("0.05")).setScale(0, RoundingMode.HALF_UP);
            BigDecimal pgFee = totalRaised.multiply(new BigDecimal("0.03")).setScale(0, RoundingMode.HALF_UP);
            BigDecimal netAmount = totalRaised.subtract(platformFee).subtract(pgFee);

            String statusStr;
            if (project.getStatus() != null) {
                switch (project.getStatus()) {
                    case SUCCESS -> statusStr = "COMPLETED";
                    case ONGOING, PREPARING -> statusStr = "PENDING";
                    case FAILED -> statusStr = "FAILED";
                    default -> statusStr = "PENDING";
                }
            } else {
                statusStr = "PENDING";
            }

            result.add(SettlementHistoryResponse.builder()
                    .settlementId(project.getProjectId())
                    .projectId(project.getProjectId())
                    .title(project.getTitle())
                    .thumbnailImage(project.getThumbnailImage())
                    .targetAmount(project.getTargetAmount())
                    .totalRaised(totalRaised)
                    .backerCount(backerCount)
                    .platformFee(platformFee)
                    .pgFee(pgFee)
                    .netAmount(netAmount)
                    .settledAt(project.getEndDate() != null ? project.getEndDate().format(dateFormatter) : "")
                    .status(statusStr)
                    .bankName(creator != null && creator.getBankName() != null ? creator.getBankName() : "미등록")
                    .accountNum(creator != null && creator.getAccountNum() != null ? creator.getAccountNum() : "미등록")
                    .accountHolder(creator != null && creator.getUserName() != null ? creator.getUserName() : creatorId)
                    .build());
        }

        return result;
    }

    private SponsoredProjectResponse convertToSponsoredResponse(SupportHistory sh) {
        Project project = sh.getProject();
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

        return SponsoredProjectResponse.builder()
                .id(sh.getSupportId())
                .projectId(project.getProjectId())
                .title(project.getTitle())
                .description(project.getProjectContent() != null ? project.getProjectContent().getContentHtml() : "")
                .imageUrl(project.getThumbnailImage())
                .sponsoredDate(supportedAt.format(displayFormatter))
                .price(String.format("%,d원", sh.getAmount().longValue()))
                .amount(sh.getAmount().longValue())
                .status(statusStr)
                .deliveryStatus(deliveryStr)
                .year(supportedAt.getYear())
                .month(supportedAt.getMonthValue())
                .build();
    }
}