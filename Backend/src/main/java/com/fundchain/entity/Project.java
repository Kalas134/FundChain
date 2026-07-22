package com.fundchain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "projects")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Project {

    /**
     * 프로젝트 ID (PK)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROJECT_ID")
    private Long projectId;

    /**
     * 프로젝트 생성자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CREATOR_ID", nullable = false)
    private User creator;

    /**
     * 프로젝트 제목
     */
    @Column(name = "TITLE", nullable = false, length = 255)
    private String title;

    /**
     * 썸네일 이미지
     */
    @Column(name = "THUMBNAIL_IMAGE", length = 512)
    private String thumbnailImage;

    /**
     * 목표 금액
     */
    @Column(name = "TARGET_AMOUNT", nullable = false, precision = 15, scale = 2)
    private BigDecimal targetAmount;

    /**
     * 시작일
     */
    @Column(name = "START_DATE", nullable = false)
    private OffsetDateTime startDate;

    /**
     * 종료일
     */
    @Column(name = "END_DATE", nullable = false)
    private OffsetDateTime endDate;

    /**
     * 프로젝트 상태
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false)
    private ProjectStatus status;
//  정해진 값에 대한 오류 방지를 위해 불가피하게 enum 추가됨 (ProjectStatus.java)

    /**
     * 프로젝트 상세 내용 (1:1)
     */
    @OneToOne(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private ProjectContent projectContent;
}