package com.fundchain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_content")
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
     * 프로젝트 상세 설명(HTML) - PostgreSQL TEXT 컬럼 매핑
     */
    @Column(name = "CONTENT_HTML", nullable = false, columnDefinition = "TEXT")
    private String contentHtml;

    /**
     * Project와 1:1 관계
     * PROJECT_ID를 PK와 FK로 동시에 사용
     */
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "PROJECT_ID")
    private Project project;


    /**
     * 프로젝트 상세 내용 수정
     */
    public void updateContent(String contentHtml) {

        if (contentHtml != null) {
            this.contentHtml = contentHtml;
        }
    }

}