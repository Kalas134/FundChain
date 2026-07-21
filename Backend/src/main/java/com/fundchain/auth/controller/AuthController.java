package com.fundchain.auth.controller;

import com.fundchain.auth.dto.LoginRequest;
import com.fundchain.auth.dto.LoginResponse;
import com.fundchain.auth.dto.RegisterRequest;
import com.fundchain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 회원가입 API
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {

        authService.register(request);

        return ResponseEntity.ok("회원가입이 완료 되었습니다.");
    }

    // 로그인 API
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }
}
