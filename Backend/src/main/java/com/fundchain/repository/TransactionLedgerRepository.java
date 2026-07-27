package com.fundchain.repository;

import com.fundchain.entity.TransactionLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * 거래 내역 (TransactionLedger) 리포지토리 인터페이스
 */
@Repository
public interface TransactionLedgerRepository extends JpaRepository<TransactionLedger, Long> {

    /**
     * 가장 최근에 등록된 거래 내역 1건 조회 (이전 해시 참조용)
     */
    Optional<TransactionLedger> findFirstByOrderByIdDesc();

    /**
     * 특정 프로젝트의 거래 유형별 총 금액 계산 (예: 후원금 총액 SUM)
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM TransactionLedger t WHERE t.projectId = :projectId AND t.transactionType = :transactionType")
    BigDecimal findTotalAmountByProjectIdAndTransactionType(@Param("projectId") Long projectId, @Param("transactionType") String transactionType);

    /**
     * 특정 프로젝트의 거래 목록 조회 (예: 환불 시 후원 내역 조회)
     */
    List<TransactionLedger> findByProjectIdAndTransactionType(Long projectId, String transactionType);

    /**
     * 특정 프로젝트의 정산/환불 거래가 이미 존재하는지 중복 확인
     */
    boolean existsByProjectIdAndTransactionType(Long projectId, String transactionType);
}
