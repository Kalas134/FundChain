package com.fundchain.auth.service;

import com.fundchain.auth.dto.LoginRequest;
import com.fundchain.auth.dto.LoginResponse;
import com.fundchain.auth.dto.RegisterRequest;
import com.fundchain.entity.User;
import com.fundchain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    // 회원 가입 메서드
    public void register(RegisterRequest request) {

        if(userRepository.existsByUserId(request.getUserId())){
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        if(userRepository.existsByNickname(request.getNickname())){
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        User user = User.builder()
                .userId(request.getUserId())
                .userRole(request.getUserRole())
                .password(request.getPassword())
                .nickname(request.getNickname())
                .userName(request.getUserName())
                .birthDate(LocalDate.parse(request.getBirthDate()))
                .phoneNum(request.getPhoneNum())
                .bankName(request.getBankName())
                .accountNum(request.getAccountNum())
                .build();

        userRepository.save(user);
    }

    // 로그인 메서드
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 아이디입니다."));
        if(!user.getPassword().equals(request.getPassword())){
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return new LoginResponse(
                user.getUserId(),
                user.getNickname(),
                user.getUserRole(),
                ""
        );
    }
}
