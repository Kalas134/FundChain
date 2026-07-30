package com.fundchain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 거래 내역 (Transaction Ledger) 엔티티
 * <p>
 * 각 거래 내역과 무결성 검증을 위한 이전 해시 및 현재 해시(Hash Chain) 정보를 저장하는 데이터베이스 엔티티입니다.
 */
@Entity
@Table(name = "transaction_ledger")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TransactionLedger {

    /**
     * 거래 내역 고유 식별자 (PK, Auto-Increment)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LEDGER_ID")
    private Long id;

    /**
     * 펀딩 프로젝트 ID
     */
    @Column(name = "PROJECT_ID", nullable = false)
    private Long projectId;

    /**
     * 후원자(사용자) ID (Users 테이블의 USER_ID - String/VARCHAR)
     */
    @Column(name = "USER_ID", nullable = false, length = 50)
    private String userId;

    /**
     * 거래 유형 ('SUPPORT', 'SETTLEMENT', 'REFUND')
     */
    @Column(name = "TRANSACTION_TYPE", nullable = false, length = 20)
    private String transactionType;

    /**
     * 거래 금액
     */
    @Column(name = "AMOUNT", nullable = false)
    private Long amount;

    /**
     * 거래 등록 일시
     */
    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    /**
     * 이전 거래(블록)의 SHA-256 해시값 (체인의 이전 고리)
     */
    @Column(name = "PREVIOUS_HASH", nullable = false, length = 64)
    private String previousHash;

    /**
     * 현재 거래의 데이터를 기반으로 생성된 SHA-256 해시값
     */
    @Column(name = "CURRENT_HASH", nullable = false, length = 64)
    private String currentHash;

    /**
     * TransactionLedger 생성자 (Builder 패턴 지원)
     *
     * @param projectId       펀딩 프로젝트 ID
     * @param userId          후원자 ID (String)
     * @param transactionType 거래 유형 (SUPPORT, SETTLEMENT, REFUND 등)
     * @param amount          후원/거래 금액
     * @param previousHash    이전 거래의 해시값
     * @param currentHash     현재 거래의 계산된 해시값
     */
    @Builder
    public TransactionLedger(Long projectId, String userId, String transactionType, Long amount, String previousHash, String currentHash) {
        this.projectId = projectId;
        this.userId = userId;
        this.transactionType = transactionType != null ? transactionType : "SUPPORT";
        this.amount = amount;
        this.previousHash = previousHash;
        this.currentHash = currentHash;
        this.createdAt = LocalDateTime.now();
    }
}