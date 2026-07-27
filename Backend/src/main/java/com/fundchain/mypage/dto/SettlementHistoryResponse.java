package com.fundchain.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 크리에이터 프로젝트 정산 명세 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SettlementHistoryResponse {

    private Long settlementId;
    private Long projectId;
    private String title;
    private String thumbnailImage;
    private BigDecimal targetAmount;
    private BigDecimal totalRaised;
    private Integer backerCount;
    private BigDecimal platformFee;
    private BigDecimal pgFee;
    private BigDecimal netAmount;
    private String settledAt;
    private String status; // COMPLETED, IN_PROGRESS, PENDING, FAILED
    private String bankName;
    private String accountNum;
    private String accountHolder;
}
