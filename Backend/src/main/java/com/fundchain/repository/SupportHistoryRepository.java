package com.fundchain.repository;

import com.fundchain.entity.SupportHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * SupportHistory Repository
 * 사용자별 후원 내역 최신순 조회, 프로젝트별 총 모금액 합계 및 후원자 수 계산 쿼리 제공
 */
@Repository
public interface SupportHistoryRepository extends JpaRepository<SupportHistory, Long> {

    /**
     * 특정 후원자의 후원 내역 최신순 조회 (프로젝트 조인 페치)
     */
    @Query("SELECT s FROM SupportHistory s JOIN FETCH s.project p WHERE s.user.userId = :userId ORDER BY s.supportedAt DESC")
    List<SupportHistory> findByUser_UserIdOrderBySupportedAtDesc(@Param("userId") String userId);

    /**
     * 특정 프로젝트의 후원 내역 목록 조회
     */
    List<SupportHistory> findByProject_ProjectId(Long projectId);

    /**
     * 특정 프로젝트의 총 후원 금액 합계
     */
    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM SupportHistory s WHERE s.project.projectId = :projectId")
    BigDecimal findTotalSupportedAmountByProjectId(@Param("projectId") Long projectId);

    /**
     * 특정 프로젝트의 후원자 수
     */
    @Query("SELECT COUNT(DISTINCT s.user.userId) FROM SupportHistory s WHERE s.project.projectId = :projectId")
    Long countDistinctBackersByProjectId(@Param("projectId") Long projectId);
}
