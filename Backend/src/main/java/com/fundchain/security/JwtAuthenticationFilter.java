package com.fundchain.security;

import com.fundchain.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    /*
     * JWT의 userId가 실제로 존재하는 회원인지,
     * 그리고 탈퇴하지 않은 회원인지 확인하기 위해 사용
     */
    private final UserRepository userRepository;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        // ============================================================
        // 1. Authorization 헤더 확인
        // ============================================================

        String authorization =
                request.getHeader("Authorization");


        /*
         * JWT가 없는 요청은 인증 처리하지 않고
         * 다음 필터로 그대로 전달
         *
         * 프로젝트 목록 / 상세 조회처럼
         * 비로그인 사용자도 접근 가능한 API가 존재하기 때문
         */
        if (
                authorization == null
                        || !authorization.startsWith("Bearer ")
        ) {

            filterChain.doFilter(request, response);
            return;
        }


        // ============================================================
        // 2. Bearer 제거
        // ============================================================

        String token =
                authorization.substring(7);


        // ============================================================
        // 3. JWT 검증
        // ============================================================

        if (!jwtProvider.validateToken(token)) {

            /*
             * 유효하지 않은 JWT라면
             * 인증 객체를 생성하지 않고 다음 필터로 이동
             *
             * 이후 SecurityConfig의
             * .authenticated()
             * 에 의해 접근이 거부됨
             */
            filterChain.doFilter(request, response);
            return;
        }


        // ============================================================
        // 4. JWT에서 userId 추출
        // ============================================================

        String userId =
                jwtProvider.getUserId(token);


        // ============================================================
        // 5. 탈퇴 여부 확인
        // ============================================================

        boolean validUser =
                userRepository
                        .findByUserIdAndIsDeletedFalse(userId)
                        .isPresent();


        /*
         * 탈퇴한 회원이라면
         * JWT 자체가 유효하더라도 인증시키지 않는다.
         *
         * 즉,
         *
         * JWT 유효
         *      +
         * IS_DELETED = false
         *      ↓
         * 인증 성공
         *
         * JWT 유효
         *      +
         * IS_DELETED = true
         *      ↓
         * 인증 실패
         */
        if (!validUser) {

            filterChain.doFilter(request, response);
            return;
        }


        // ============================================================
        // 6. JWT에서 Role 추출
        // ============================================================

        String userRole =
                jwtProvider.getUserRole(token);


        /*
         * Role이 비어 있다면 권한을 부여하지 않는다.
         */
        if (
                userRole == null
                        || userRole.isBlank()
        ) {

            filterChain.doFilter(request, response);
            return;
        }


        // ============================================================
        // 7. Spring Security Authority 생성
        // ============================================================

        /*
         * DB:
         *
         * USER
         * CREATOR
         * ADMIN
         *
         * ↓
         *
         * Spring Security:
         *
         * ROLE_USER
         * ROLE_CREATOR
         * ROLE_ADMIN
         *
         * 이렇게 만들어야
         *
         * hasRole("CREATOR")
         *
         * 형태로 사용할 수 있다.
         */
        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(
                        "ROLE_" + userRole
                );


        // ============================================================
        // 8. Spring Security 인증 객체 생성
        // ============================================================

        /*
         * principal
         * → userId
         *
         * credentials
         * → null
         *
         * authorities
         * → ROLE_USER
         * → ROLE_CREATOR
         * → ROLE_ADMIN
         */
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        List.of(authority)
                );


        // ============================================================
        // 9. SecurityContext에 인증 정보 저장
        // ============================================================

        SecurityContextHolder
                .getContext()
                .setAuthentication(authentication);


        // ============================================================
        // 10. 다음 필터로 이동
        // ============================================================

        filterChain.doFilter(request, response);
    }
}