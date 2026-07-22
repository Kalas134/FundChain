package com.fundchain.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {


    /*
     * 현재 테스트용 응답 구조
     *
     * Swagger에서 JWT 발급 확인을 위해
     * 사용자 정보 + token을 함께 반환하고 있음.
     *
     * TODO:
     * API 문서 기준으로 변경 필요
     *
     * 변경 예정 형태:
     *
     * {
     *     "accessToken": "JWT TOKEN",
     *     "tokenType": "Bearer",
     *     "expiresIn": 86400
     * }
     *
     * 변경 시:
     * - userId 제거
     * - nickname 제거
     * - userRole 제거
     * - token -> accessToken 변경 예정 : 이유 여러 토큰 존재 가능성 높기 때문
     * - tokenType 추가
     * - expiresIn 추가
     *
     */


    private String userId;

    private String nickname;

    private String userRole;

    private String token;
}