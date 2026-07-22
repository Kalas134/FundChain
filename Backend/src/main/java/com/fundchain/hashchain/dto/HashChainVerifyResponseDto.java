package com.fundchain.hashchain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 해시 체인 무결성 검증 결과 Response DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "해시 체인 무결성 검증 결과 응답")
public class HashChainVerifyResponseDto {

    @Schema(description = "검증 통과 여부 (true: 정상, false: 위변조 감지)", example = "true")
    private boolean isValid;

    @Schema(description = "검증 결과 메시지", example = "모든 거래 데이터의 무결성이 보장된 상태입니다.")
    private String message;

    @Schema(description = "검증된 총 거래 내역 수", example = "42")
    private int totalCheckedCount;

    @Schema(description = "위변조가 감지된 거래 내역 번호 (정상일 경우 null)", example = "15")
    private Long invalidLedgerId;

    @Schema(description = "위변조 감지 사유 (정상일 경우 null)", example = "해시값 불일치 (데이터 변조 감지)")
    private String failureReason;

    public static HashChainVerifyResponseDto success(int totalCheckedCount) {
        return HashChainVerifyResponseDto.builder()
                .isValid(true)
                .message("✅ 거래 내역 검증 완료: 모든 거래 데이터의 무결성이 보장된 상태입니다.")
                .totalCheckedCount(totalCheckedCount)
                .invalidLedgerId(null)
                .failureReason(null)
                .build();
    }

    public static HashChainVerifyResponseDto fail(int totalCheckedCount, Long invalidLedgerId, String failureReason) {
        return HashChainVerifyResponseDto.builder()
                .isValid(false)
                .message("🚨 거래 내역 위변조 경고: 데이터 정합성이 깨졌습니다. 즉시 확인이 필요합니다.")
                .totalCheckedCount(totalCheckedCount)
                .invalidLedgerId(invalidLedgerId)
                .failureReason(failureReason)
                .build();
    }
}
