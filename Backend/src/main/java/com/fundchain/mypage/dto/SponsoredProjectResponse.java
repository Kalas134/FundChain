package com.fundchain.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 후원한 프로젝트 목록 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SponsoredProjectResponse {

    private Long id;
    private Long projectId;
    private String title;
    private String description;
    private String imageUrl;
    private String sponsoredDate;
    private String price;
    private Long amount;
    private String status; // 'reserved', 'success', 'canceled'
    private String deliveryStatus; // e.g. "선물 전달 완료", "펀딩 진행 중", "환불 처리"
    private Integer year;
    private Integer month;
}
