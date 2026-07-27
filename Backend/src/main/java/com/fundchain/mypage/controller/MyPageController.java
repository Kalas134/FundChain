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
    @Operation(
            summary = "회원정보 조회",
            description = "로그인한 회원의 정보를 조회합니다."
    )
    @GetMapping("/me")
    public ResponseEntity<MyPageResponse> getMyPageInfo(
            @AuthenticationPrincipal String userId
    ) {

        String currentUserId = resolveUserId(userId);

        MyPageResponse response =
                myPageService.getMyPageInfo(currentUserId);

        return ResponseEntity.ok(response);
    }


    /**
     * 회원정보 수정 API
     */
    @Operation(
            summary = "회원정보 수정",
            description = "로그인한 회원의 정보를 수정합니다."
    )
    @PutMapping("/me")
    public ResponseEntity<MyPageUpdateResponse> updateMyPageInfo(
            @AuthenticationPrincipal String userId,
            @RequestBody MyPageUpdateRequest request
    ) {

        String currentUserId = resolveUserId(userId);

        MyPageUpdateResponse response =
                myPageService.updateMyPageInfo(
                        currentUserId,
                        request
                );

        return ResponseEntity.ok(response);
    }


    /**
     * 회원 탈퇴 API
     *
     * 실제 User 데이터를 삭제하지 않고
     * IS_DELETED 값을 true로 변경한다.
     */
    @Operation(
            summary = "회원 탈퇴",
            description = "로그인한 회원의 계정을 탈퇴 처리합니다."
    )
    @DeleteMapping("/me")
    public ResponseEntity<String> deleteMyAccount(
            @AuthenticationPrincipal String userId
    ) {

        String currentUserId = resolveUserId(userId);

        myPageService.deleteMyAccount(currentUserId);

        return ResponseEntity.ok(
                "회원 탈퇴가 완료되었습니다."
        );
    }


    /**
     * 인증된 사용자 ID 확인
     *
     * JWT Filter에서 userId를 principal로 저장하는 경우
     * @AuthenticationPrincipal String userId로 받을 수 있다.
     *
     * 혹시 직접 주입되지 않는 경우에는
     * SecurityContext에서 다시 확인한다.
     */
    private String resolveUserId(String userId) {

        if (userId != null && !userId.isBlank()) {
            return userId;
        }


        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (
                authentication != null
                        && authentication.getName() != null
                        && !authentication
                        .getName()
                        .equals("anonymousUser")
        ) {

            return authentication.getName();
        }


        throw new IllegalArgumentException(
                "인증 정보가 존재하지 않습니다."
        );
    }
}