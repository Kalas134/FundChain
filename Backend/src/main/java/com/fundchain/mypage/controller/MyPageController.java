package com.fundchain.mypage.controller;

import com.fundchain.mypage.dto.MyPageResponse;
import com.fundchain.mypage.dto.MyPageUpdateRequest;
import com.fundchain.mypage.dto.MyPageUpdateResponse;
import com.fundchain.mypage.service.MyPageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<MyPageResponse> getMyPageInfo(
            @AuthenticationPrincipal String userId
    ) {
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
