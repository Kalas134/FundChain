package com.fundchain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "projectcontent")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProjectContent {

    /**
     * Projects.PROJECT_ID를 PK이자 FK로 사용
     */
    @Id
    @Column(name = "PROJECT_ID")
    private Long projectId;

    /**
     * 프로젝트 상세 설명(HTML)
     */
    @Lob
    @Column(name = "CONTENT_HTML", nullable = false)
    private String contentHtml;

    /**
     * Project와 1:1 관계
     * PROJECT_ID를 PK와 FK로 동시에 사용
     */
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "PROJECT_ID")
    private Project project;
}