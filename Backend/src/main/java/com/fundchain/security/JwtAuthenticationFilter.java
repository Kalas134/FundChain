package com.fundchain.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    private final JwtProvider jwtProvider;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        String authorization =
                request.getHeader("Authorization");


        /*
         * Authorization 헤더가 없거나
         * Bearer 형식이 아닌 경우
         *
         * 현재는 인증 없이 통과
         */
        if(authorization == null ||
                !authorization.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }


        /*
         * Bearer 제거
         *
         * 예:
         * Bearer eyJhbGciOiJIUzI1...
         *
         * ↓
         *
         * eyJhbGciOiJIUzI1...
         */
        String token =
                authorization.substring(7);



        /*
         * JWT 검증
         */
        if(jwtProvider.validateToken(token)) {


            /*
             * JWT 내부 정보 추출
             */
            String userId =
                    jwtProvider.getUserId(token);

            String userRole =
                    jwtProvider.getUserRole(token);



            /*
             * Spring Security 인증 객체 생성
             *
             * 현재는 userId만 principal로 저장
             *
             * 권한(Role)은 추후
             * GrantedAuthority 적용 예정
             */
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            null
                    );


            /*
             * SecurityContext 저장
             *
             * 이후 Controller에서
             * 인증 사용자 확인 가능
             */
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);
        }


        /*
         * 다음 Security Filter로 이동
         */
        filterChain.doFilter(request, response);
    }
}