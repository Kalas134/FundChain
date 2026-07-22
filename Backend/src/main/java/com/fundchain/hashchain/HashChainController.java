package com.fundchain.hashchain;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fundchain.hashchain.dto.HashChainVerifyResponseDto;

/**
 * 거래 해시 체인 관리 REST 컨트롤러
 * <p>
 * 신규 거래(후원/정산/환불) 등록 요청 처리 및 거래 내역 무결성 검증 API를 제공합니다.
 */
@Tag(name = "거래 해시 체인 관리 API", description = "거래 내역 기록 및 무결성 검증 담당")
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class HashChainController {

    private final HashChainService hashChainService;

    /**
     * 새로운 거래(후원, 정산, 환불) 발생 및 해시 체이닝 저장 API
     *
     * @param projectId       펀딩 프로젝트 ID
     * @param userId          사용자 ID
     * @param amount          거래 금액
     * @param transactionType 거래 유형 (기본값: SUPPORT)
     * @return 거래 기록 처리 결과 메시지
     */
    @Operation(summary = "새로운 거래 발생 및 해시 체이닝 저장")
    @PostMapping
    public ResponseEntity<String> createTransaction(
            @RequestParam Long projectId,
            @RequestParam String userId,
            @RequestParam Long amount,
            @RequestParam(required = false, defaultValue = "SUPPORT") String transactionType) {

        Long ledgerId = hashChainService.createTransaction(projectId, userId, amount, transactionType);
        return ResponseEntity.ok("거래가 성공적으로 기록되었습니다. 거래 내역 번호: " + ledgerId);
    }

    /**
     * 전체 거래 내역 해시 무결성 검증 API
     * <p>
     * DB에 기록된 해시 체인의 모든 거래 데이터와 링크가 위변조되지 않았는지 검증합니다.
     *
     * @return 무결성 검증 결과 DTO 응답
     */
    @Operation(summary = "전체 거래 내역 Hash 검증", description = "DB에 기록된 해시 체인이 변조되지 않았는지 검증합니다.")
    @GetMapping("/verify")
    public ResponseEntity<HashChainVerifyResponseDto> verifyHashChain() {
        HashChainVerifyResponseDto result = hashChainService.verifyChain();
        return ResponseEntity.ok(result);
    }
}