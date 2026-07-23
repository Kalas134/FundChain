package com.fundchain.project.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ProjectCreateRequest {

    /**
     * 프로젝트 제목
     */
    private String title;

    /**
     * 썸네일 이미지 경로
     */
    private String thumbnailImage;

    /**
     * 목표 금액
     */
    private BigDecimal targetAmount;

    /**
     * 프로젝트 시작일
     */
    private OffsetDateTime startDate;

    /**
     * 프로젝트 종료일
     */
    private OffsetDateTime endDate;

    /**
     * 프로젝트 상세 내용
     */
    private String contentHtml;
}
