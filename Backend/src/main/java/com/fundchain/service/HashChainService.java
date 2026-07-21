package com.fundchain.service;

import com.fundchain.entity.TransactionLedger;
import com.fundchain.repository.TransactionLedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

/**
 * 해시 체인 기반 거래 내역 비즈니스 로직 서비스
 * <p>
 * 거래 발생 시 이전 해시와 결합하여 새로운 해시를 생성(해시 체이닝)하고,
 * 전체 거래 내역의 데이터 위변조 여부를 무결성 검증하는 역할을 수행합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HashChainService {

    private final TransactionLedgerRepository ledgerRepository;

    /**
     * 1. 신규 거래 등록 (해시 체인 생성 및 거래 내역 저장)
     * <p>
     * 직전 거래의 해시값을 가져와 현재 거래 정보와 조합한 후 SHA-256 해시를 산출하여 DB에 저장합니다.
     *
     * @param projectId 펀딩 프로젝트 ID
     * @param userId    후원자 ID
     * @param amount    후원 금액
     * @return 생성된 거래 내역의 PK (ID)
     */
    @Transactional
    public Long createTransaction(Long projectId, Long userId, Long amount) {
        // [Step 1] 이전 거래 내역 조회 (없으면 최초 거래이므로 64자리 0으로 구성된 제네시스 해시 세팅)
        String previousHash = ledgerRepository.findFirstByOrderByIdDesc()
                .map(TransactionLedger::getCurrentHash)
                .orElse("0000000000000000000000000000000000000000000000000000000000000000");

        // [Step 2] 현재 거래 정보와 이전 해시를 조합하여 고유 문자열 생성
        String dataToHash = previousHash + "_" + projectId + "_" + userId + "_" + amount;

        // [Step 3] SHA-256 해시값 생성
        String currentHash = calculateSha256(dataToHash);

        // [Step 4] 엔티티 객체 생성 및 거래 내역 기록
        TransactionLedger ledger = TransactionLedger.builder()
                .projectId(projectId)
                .userId(userId)
                .amount(amount)
                .previousHash(previousHash)
                .currentHash(currentHash)
                .build();

        return ledgerRepository.save(ledger).getId();
    }

    /**
     * 2. 해시 체인 무결성 검증 (전체 거래 내역 위변조 여부 검사)
     * <p>
     * 저장된 모든 거래 데이터를 ID 순서대로 순회하며,
     * 각 레코드의 데이터로 재계산한 해시값 검증 및 블록 간 체인 연결 고리(이전 해시 링크) 검증을 수행합니다.
     *
     * @return 검증 성공(무결성 보장) 시 true, 데이터 위변조 또는 체인 이탈 감지 시 false
     */
    public boolean verifyChain() {
        // DB에 기록된 모든 거래 데이터를 정렬(ID순)해서 가져옴
        List<TransactionLedger> chain = ledgerRepository.findAll();

        for (int i = 0; i < chain.size(); i++) {
            TransactionLedger current = chain.get(i);

            // 검증 A: 현재 장부의 데이터를 가지고 새로 계산한 해시가 저장된 해시와 일치하는가?
            String dataToHash = current.getPreviousHash() + "_" + current.getProjectId() + "_" + current.getUserId() + "_" + current.getAmount();
            String calculatedHash = calculateSha256(dataToHash);

            if (!current.getCurrentHash().equals(calculatedHash)) {
                System.out.println("❌ 위변조 감지! [ID: " + current.getId() + "]의 데이터 혹은 현재 해시가 조작되었습니다.");
                return false;
            }

            // 검증 B: 두 번째 블록부터는 '이전 블록의 현재 해시'와 '현재 블록의 이전 해시'가 일치하는가?
            if (i > 0) {
                TransactionLedger previous = chain.get(i - 1);
                if (!current.getPreviousHash().equals(previous.getCurrentHash())) {
                    System.out.println("❌ 위변조 감지! [ID: " + current.getId() + "]의 연결 고리(이전 해시 링크)가 깨졌습니다.");
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * SHA-256 해시 계산 유틸리티 메서드
     *
     * @param text 해시화할 대상 문자열
     * @return 64자리 16진수 SHA-256 해시 문자열
     * @throws RuntimeException SHA-256 알고리즘을 지원하지 않는 환경일 경우 발생
     */
    private String calculateSha256(String text) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(text.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 알고리즘을 찾을 수 없습니다.", e);
        }
    }
}