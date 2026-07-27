package com.fundchain.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 상세 거래/결제 내역 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionHistoryResponse {

    private Long supportId;
    private Long projectId;
    private String userId;
    private Long amount;
    private String supportedAt;
    private String title;
    private String thumbnailImage;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private String startDate;
    private String endDate;
    private String status; // ONGOING, SUCCESS, FAILED
    private String creatorId;
    private String creatorNickname;
    private String bankName;
    private String accountNum;
}
