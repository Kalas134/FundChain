package com.fundchain.mypage.controller;

import com.fundchain.mypage.dto.*;
import com.fundchain.mypage.service.MyPageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "MyPage", description = "마이페이지 API")
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;

    /**
     * 회원정보 조회 API
     */
    @Operation(summary = "회원정보 조회", description = "로그인한 회원의 정보를 조회합니다.")
    @GetMapping("/me")
    public ResponseEntity<MyPageResponse> getMyPageInfo(@AuthenticationPrincipal String userId) {
        String currentUserId = resolveUserId(userId);
        MyPageResponse response = myPageService.getMyPageInfo(currentUserId);
        return ResponseEntity.ok(response);
    }

    /**
     * 회원정보 수정 API
     */
    @Operation(summary = "회원정보 수정", description = "로그인한 회원의 정보를 수정합니다.")
    @PutMapping("/me")
    public ResponseEntity<MyPageUpdateResponse> updateMyPageInfo(
            @AuthenticationPrincipal String userId,
            @RequestBody MyPageUpdateRequest request
    ) {
        String currentUserId = resolveUserId(userId);
        MyPageUpdateResponse response = myPageService.updateMyPageInfo(currentUserId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 회원 탈퇴 API
     */
    @Operation(summary = "회원 탈퇴", description = "로그인한 회원의 계정을 탈퇴 처리합니다.")
    @DeleteMapping("/me")
    public ResponseEntity<String> deleteMyAccount(@AuthenticationPrincipal String userId) {
        String currentUserId = resolveUserId(userId);
        myPageService.deleteMyAccount(currentUserId);
        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }

    /**
     * POST /api/mypage/support/{projectId} : 프로젝트 후원 API
     */
    @Operation(summary = "프로젝트 후원하기", description = "특정 프로젝트에 금액을 후원합니다.")
    @PostMapping("/support/{projectId}")
    public ResponseEntity<SponsoredProjectResponse> supportProject(
            @PathVariable Long projectId,
            @RequestBody SupportRequest request,
            @AuthenticationPrincipal String userId
    ) {
        String currentUserId = resolveUserId(userId);
        SponsoredProjectResponse response = myPageService.supportProject(projectId, request.getAmount(), currentUserId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/mypage/sponsored-projects : 후원한 프로젝트 목록 API
     */
    @Operation(summary = "후원한 프로젝트 목록 조회", description = "로그인한 회원의 후원 내역을 조회합니다.")
    @GetMapping("/sponsored-projects")
    public ResponseEntity<List<SponsoredProjectResponse>> getSponsoredProjects(@AuthenticationPrincipal String userId) {
        String currentUserId = resolveUserId(userId);
        List<SponsoredProjectResponse> response = myPageService.getSponsoredProjects(currentUserId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/mypage/transaction-history : 거래 및 결제 내역 API
     */
    @Operation(summary = "거래 및 결제 내역 조회", description = "로그인한 회원의 상세 결제/거래 내역을 조회합니다.")
    @GetMapping("/transaction-history")
    public ResponseEntity<List<TransactionHistoryResponse>> getTransactionHistory(@AuthenticationPrincipal String userId) {
        String currentUserId = resolveUserId(userId);
        List<TransactionHistoryResponse> response = myPageService.getTransactionHistory(currentUserId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/mypage/settlement-history : 크리에이터 정산 내역 API
     */
    @Operation(summary = "크리에이터 정산 내역 조회", description = "로그인한 크리에이터 프로젝트의 정산 내역을 조회합니다.")
    @GetMapping("/settlement-history")
    public ResponseEntity<List<SettlementHistoryResponse>> getSettlementHistory(@AuthenticationPrincipal String userId) {
        String currentUserId = resolveUserId(userId);
        List<SettlementHistoryResponse> response = myPageService.getSettlementHistory(currentUserId);
        return ResponseEntity.ok(response);
    }

    /**
     * 인증된 사용자 ID 확인
     */
    private String resolveUserId(String userId) {
        if (userId != null && !userId.isBlank()) {
            return userId;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getName() != null && !authentication.getName().equals("anonymousUser")) {
            return authentication.getName();
        }

        throw new IllegalArgumentException("인증 정보가 존재하지 않습니다.");
    }
}