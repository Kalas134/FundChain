package com.fundchain.hashchain;

import com.fundchain.hashchain.dto.HashChainVerifyResponseDto;

/**
 * 해시 체인 기반 거래 내역 인터페이스
 * - 인터페이스 작성 및 구현: 김충영 (Settlement & Security 파트)
 * - 인터페이스 호출: 김동주 (Core 파트 - 후원 처리 API 서비스)
 *
 * 동주 님의 후원 생성 API 완료 시 이 인터페이스의 createTransaction()을 호출하여
 * 무결성 해시 체인을 저장하게 됩니다.
 */
public interface HashChainService {

    /**
     * 1. 신규 거래 등록 (해시 체인 생성 및 거래 내역 저장)
     *
     * @param projectId 펀딩 프로젝트 ID
     * @param userId    후원자 ID
     * @param amount    후원 금액
     * @return 생성된 거래 내역의 PK (ID)
     */
    Long createTransaction(Long projectId, Long userId, Long amount);

    /**
     * 2. 해시 체인 무결성 검증 (전체 거래 내역 위변조 여부 검사)
     *
     * @return 무결성 검증 결과 DTO (HashChainVerifyResponseDto)
     */
    HashChainVerifyResponseDto verifyChain();
}
