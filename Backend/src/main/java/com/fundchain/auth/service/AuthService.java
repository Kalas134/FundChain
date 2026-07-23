package com.fundchain.auth.service;

import com.fundchain.auth.dto.LoginRequest;
import com.fundchain.auth.dto.LoginResponse;
import com.fundchain.auth.dto.RegisterRequest;
import com.fundchain.entity.User;
import com.fundchain.repository.UserRepository;
import com.fundchain.security.JwtProvider;
import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.password.PasswordEncoder; //인코더 적용 시 사용
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    // JWT 생성 담당
    private final JwtProvider jwtProvider;


    /*
    비번 암호화 세팅
    현재는 테스트를 위해 평문 비교 사용

    private final PasswordEncoder passwordEncoder;
    */


    // 회원 가입 메서드
    public void register(RegisterRequest request) {

        if(userRepository.existsByUserId(request.getUserId())){
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        if(userRepository.existsByNickname(request.getNickname())){
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        if(userRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        if(userRepository.existsByPhoneNum(request.getPhoneNum())){
            throw new IllegalArgumentException("이미 존재하는 전화번호입니다.");
        }


        User user = User.builder()
                .userId(request.getUserId())
                .userRole(request.getUserRole())
                .password(request.getPassword())

                /*
                PasswordEncoder 적용 예정

                .password(
                    passwordEncoder.encode(request.getPassword())
                )
                */

                .nickname(request.getNickname())
                .userName(request.getUserName())
                .birthDate(LocalDate.parse(request.getBirthDate()))
                .phoneNum(request.getPhoneNum())
                .email(request.getEmail())
                .bankName(request.getBankName())
                .accountNum(request.getAccountNum())
                .build();


        userRepository.save(user);
    }



    // 로그인 메서드
    public LoginResponse login(LoginRequest request) {


        // API 문서 기준 로그인 : Email + Password
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 이메일입니다.")
                );


        // 현재 테스트용 비밀번호 비교
        if(!user.getPassword().equals(request.getPassword())){
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }


        /*
        PasswordEncoder 적용 예정

        if(!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )){
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        */


        // JWT 생성
        String token =
                jwtProvider.createToken(
                        user.getUserId(),
                        user.getUserRole()
                );


        return new LoginResponse(
                user.getUserId(),
                user.getNickname(),
                user.getUserRole(),
                token
        );
    }
}