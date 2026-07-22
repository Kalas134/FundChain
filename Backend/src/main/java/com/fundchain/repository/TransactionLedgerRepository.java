package com.fundchain.repository;

import com.fundchain.entity.TransactionLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 거래 내역 (TransactionLedger) 리포지토리 인터페이스
 * <p>
 * TransactionLedger 엔티티의 데이터베이스 조회 및 저장 기능을 제공하는 Spring Data JPA Repository입니다.
 */
@Repository
public interface TransactionLedgerRepository extends JpaRepository<TransactionLedger, Long> {

    /**
     * 가장 최근에 등록된 거래 내역 1건을 조회합니다.
     * <p>
     * 신규 거래 등록 시 이전 블록의 해시값(previousHash) 참조를 위해 ID 내림차순으로 첫 번째 레코드를 가져옵니다.
     *
     * @return 가장 최근의 거래 내역 (없을 경우 Optional.empty())
     */
    Optional<TransactionLedger> findFirstByOrderByIdDesc();
}