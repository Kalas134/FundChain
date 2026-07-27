package com.fundchain.mypage.service;

import com.fundchain.entity.User;
import com.fundchain.mypage.dto.MyPageResponse;
import com.fundchain.mypage.dto.MyPageUpdateRequest;
import com.fundchain.mypage.dto.MyPageUpdateResponse;
import com.fundchain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageService {

    private final UserRepository userRepository;


    /**
     * 회원 정보 조회
     */
    public MyPageResponse getMyPageInfo(String userId) {

        /*
         * 탈퇴하지 않은 회원만 조회
         *
         * IS_DELETED = false → 조회 가능
         * IS_DELETED = true  → 조회되지 않음
         */
        User user = userRepository
                .findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "존재하지 않는 회원입니다."
                        )
                );

        return MyPageResponse.from(user);
    }


    /**
     * 회원 정보 수정
     */
    @Transactional
    public MyPageUpdateResponse updateMyPageInfo(
            String userId,
            MyPageUpdateRequest request
    ) {

        /*
         * 탈퇴하지 않은 회원만 조회
         */
        User user = userRepository
                .findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "존재하지 않는 회원입니다."
                        )
                );


        // ========================================================
        // 닉네임 변경 시 중복 검사
        // ========================================================

        if (
                request.getNickname() != null
                        && !request.getNickname().equals(user.getNickname())
        ) {

            /*
             * 탈퇴하지 않은 회원의 닉네임만 중복으로 판단
             */
            if (
                    userRepository
                            .existsByNicknameAndIsDeletedFalse(
                                    request.getNickname()
                            )
            ) {
                throw new IllegalArgumentException(
                        "이미 존재하는 닉네임입니다."
                );
            }
        }


        // ========================================================
        // 전화번호 변경 시 중복 검사
        // ========================================================

        if (
                request.getPhoneNum() != null
                        && !request.getPhoneNum().equals(user.getPhoneNum())
        ) {

            /*
             * 탈퇴하지 않은 회원의 전화번호만 중복으로 판단
             */
            if (
                    userRepository
                            .existsByPhoneNumAndIsDeletedFalse(
                                    request.getPhoneNum()
                            )
            ) {
                throw new IllegalArgumentException(
                        "이미 존재하는 전화번호입니다."
                );
            }
        }


        // ========================================================
        // 회원 정보 수정
        // ========================================================

        user.updateMyPageInfo(
                request.getNickname(),
                request.getPhoneNum(),
                request.getBankName(),
                request.getAccountNum()
        );


        return MyPageUpdateResponse.from(user);
    }


    /**
     * 회원 탈퇴
     *
     * 실제 User 데이터를 삭제하지 않고
     * IS_DELETED 값을 true로 변경한다.
     */
    @Transactional
    public void deleteMyAccount(String userId) {

        /*
         * 탈퇴하지 않은 회원만 조회
         *
         * 이미 탈퇴한 회원은 여기서 조회되지 않는다.
         */
        User user = userRepository
                .findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "존재하지 않는 회원입니다."
                        )
                );


        /*
         * 실제 DELETE가 아니라
         *
         * IS_DELETED
         * false → true
         *
         * 로 변경한다.
         */
        user.deleteAccount();
    }
}