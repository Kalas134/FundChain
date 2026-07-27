package com.fundchain.auth.service;

import com.fundchain.auth.dto.LoginRequest;
import com.fundchain.auth.dto.LoginResponse;
import com.fundchain.auth.dto.RegisterRequest;
import com.fundchain.entity.User;
import com.fundchain.repository.UserRepository;
import com.fundchain.security.JwtProvider;
import lombok.RequiredArgsConstructor;
// import org.springframework.security.crypto.password.PasswordEncoder; // 인코더 적용 시 사용
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    // JWT 생성 담당
    private final JwtProvider jwtProvider;


    /*
     * 비밀번호 암호화 세팅
     * 현재는 테스트를 위해 평문 비교 사용
     *
     * PasswordEncoder 적용 시 사용
     *
     * private final PasswordEncoder passwordEncoder;
     */


    // ============================================================
    // 회원가입
    // ============================================================

    public void register(RegisterRequest request) {

        /*
         * 탈퇴하지 않은 사용자만 중복 검사
         *
         * IS_DELETED = false
         * → 현재 사용 중인 계정이므로 중복 처리
         *
         * IS_DELETED = true
         * → 탈퇴한 계정이므로 중복 검사에서 제외
         */

        if (userRepository.existsByUserIdAndIsDeletedFalse(
                request.getUserId()
        )) {
            throw new IllegalArgumentException(
                    "이미 존재하는 아이디입니다."
            );
        }


        if (userRepository.existsByNicknameAndIsDeletedFalse(
                request.getNickname()
        )) {
            throw new IllegalArgumentException(
                    "이미 존재하는 닉네임입니다."
            );
        }


        if (userRepository.existsByEmailAndIsDeletedFalse(
                request.getEmail()
        )) {
            throw new IllegalArgumentException(
                    "이미 존재하는 이메일입니다."
            );
        }


        if (userRepository.existsByPhoneNumAndIsDeletedFalse(
                request.getPhoneNum()
        )) {
            throw new IllegalArgumentException(
                    "이미 존재하는 전화번호입니다."
            );
        }


        User user = User.builder()
                .userId(request.getUserId())
                .userRole(request.getUserRole())
                .password(request.getPassword())

                /*
                 * PasswordEncoder 적용 예정
                 *
                 * .password(
                 *     passwordEncoder.encode(request.getPassword())
                 * )
                 */

                .nickname(request.getNickname())
                .userName(request.getUserName())
                .birthDate(request.getBirthDate())
                .phoneNum(request.getPhoneNum())
                .email(request.getEmail())
                .bankName(request.getBankName())
                .accountNum(request.getAccountNum())

                // 신규 가입자는 정상 계정
                .isDeleted(false)

                .build();


        userRepository.save(user);
    }


    // ============================================================
    // 로그인
    // ============================================================

    public LoginResponse login(LoginRequest request) {

        /*
         * 탈퇴하지 않은 사용자만 조회
         *
         * IS_DELETED = false → 로그인 가능
         * IS_DELETED = true  → 조회되지 않음 → 로그인 불가
         */

        User user = userRepository
                .findByEmailAndIsDeletedFalse(
                        request.getEmail()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "존재하지 않는 이메일입니다."
                        )
                );


        // 현재 테스트용 비밀번호 비교
        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException(
                    "비밀번호가 일치하지 않습니다."
            );
        }


        /*
         * PasswordEncoder 적용 예정
         *
         * if (!passwordEncoder.matches(
         *         request.getPassword(),
         *         user.getPassword()
         * )) {
         *     throw new IllegalArgumentException(
         *             "비밀번호가 일치하지 않습니다."
         *     );
         * }
         */


        // ========================================================
        // JWT 생성
        // ========================================================

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