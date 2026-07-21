package com.fundchain.controller;

import com.fundchain.service.HashChainService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 거래 해시 체인 관리 REST 컨트롤러
 * <p>
 * 신규 거래(후원) 등록 요청 처리 및 거래 내역 무결성 검증 API를 제공합니다.
 */
@Tag(name = "거래 해시 체인 관리 API", description = "거래 내역 기록 및 무결성 검증 담당")
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class HashChainServiceController {

    private final HashChainService hashChainService;

    /**
     * 새로운 거래(후원) 발생 및 해시 체이닝 저장 API
     *
     * @param projectId 펀딩 프로젝트 ID
     * @param userId    후원자 ID
     * @param amount    후원 금액
     * @return 거래 기록 처리 결과 메시지
     */
    @Operation(summary = "새로운 거래(후원) 발생 및 해시 체이닝 저장")
    @PostMapping
    public ResponseEntity<String> createTransaction(
            @RequestParam Long projectId,
            @RequestParam Long userId,
            @RequestParam Long amount) {

        Long ledgerId = hashChainService.createTransaction(projectId, userId, amount);
        return ResponseEntity.ok("거래가 성공적으로 기록되었습니다. 거래 내역 번호: " + ledgerId);
    }

    /**
     * 전체 거래 내역 해시 무결성 검증 API
     * <p>
     * DB에 기록된 해시 체인의 모든 거래 데이터와 링크가 위변조되지 않았는지 검증합니다.
     *
     * @return 검증 성공 시 200 OK, 위변조 감지 시 500 Internal Server Error 응답
     */
    @Operation(summary = "전체 거래 내역 Hash 검증", description = "DB에 기록된 해시 체인이 변조되지 않았는지 검증합니다.")
    @GetMapping("/verify")
    public ResponseEntity<String> verifyHashChain() {
        boolean isValid = hashChainService.verifyChain();

        if (isValid) {
            return ResponseEntity.ok("✅ 거래 내역 검증 완료: 모든 거래 데이터의 무결성이 보장된 상태입니다.");
        } else {
            return ResponseEntity.status(500).body("🚨 거래 내역 위변조 경고: 데이터 정합성이 깨졌습니다. 즉시 확인이 필요합니다.");
        }
    }
}