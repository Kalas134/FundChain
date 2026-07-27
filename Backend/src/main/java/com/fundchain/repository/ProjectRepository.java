package com.fundchain.repository;

import com.fundchain.entity.Project;
import com.fundchain.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCreator_UserId(String userId);

    /**
     * 특정 상태이면서 시작일이 지난 프로젝트 목록 조회 (시작 처리용)
     */
    List<Project> findByStatusAndStartDateLessThanEqual(ProjectStatus status, OffsetDateTime now);

    /**
     * 특정 상태이면서 종료일이 지난 프로젝트 목록 조회 (종료 및 정산/환불 처리용)
     */
    List<Project> findByStatusAndEndDateLessThanEqual(ProjectStatus status, OffsetDateTime now);
}

