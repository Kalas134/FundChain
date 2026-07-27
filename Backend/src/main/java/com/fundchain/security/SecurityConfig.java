package com.fundchain.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    // ============================================================
    // 비밀번호 암호화 Bean
    // ============================================================

    @Bean
    public PasswordEncoder passwordEncoder(
            SHA256PasswordEncoder encoder
    ) {
        return encoder;
    }


    // ============================================================
    // Spring Security 설정
    // ============================================================

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // ====================================================
                // CORS
                // ====================================================

                .cors(Customizer.withDefaults())


                // ====================================================
                // JWT 방식이므로 CSRF 비활성화
                // ====================================================

                .csrf(csrf -> csrf.disable())


                // ====================================================
                // 요청별 인증 / 권한 설정
                // ====================================================

                .authorizeHttpRequests(auth -> auth


                        // ------------------------------------------------
                        // Swagger
                        // ------------------------------------------------

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()


                        // ------------------------------------------------
                        // 회원가입 / 로그인
                        // ------------------------------------------------

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        ).permitAll()


                        // ------------------------------------------------
                        // 프로젝트 조회
                        //
                        // 비로그인 사용자도 프로젝트를 볼 수 있어야 함
                        // ------------------------------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/projects",
                                "/api/projects/**"
                        ).permitAll()


                        // ------------------------------------------------
                        // 프로젝트 생성
                        //
                        // CREATOR만 프로젝트 생성 가능
                        // ------------------------------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/projects"
                        ).hasRole("CREATOR")


                        // ------------------------------------------------
                        // 프로젝트 수정
                        //
                        // 로그인 필요
                        //
                        // 실제 프로젝트 소유자 여부는
                        // ProjectServiceImpl에서 검증
                        // ------------------------------------------------

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/projects/**"
                        ).authenticated()


                        // ------------------------------------------------
                        // 프로젝트 삭제
                        //
                        // 로그인 필요
                        //
                        // 실제 프로젝트 소유자 여부는
                        // ProjectServiceImpl에서 검증
                        // ------------------------------------------------

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/projects/**"
                        ).authenticated()


                        // ------------------------------------------------
                        // 마이페이지
                        //
                        // 로그인한 사용자만 접근 가능
                        // ------------------------------------------------

                        .requestMatchers(
                                "/api/mypage/**"
                        ).authenticated()


                        // ------------------------------------------------
                        // 그 외 모든 API
                        // ------------------------------------------------

                        .anyRequest().authenticated()
                )


                // ====================================================
                // JWT Filter 연결
                // ====================================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}