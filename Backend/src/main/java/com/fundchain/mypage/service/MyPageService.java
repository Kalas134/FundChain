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
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new IllegalArgumentException("탈퇴한 회원입니다.");
        }

        return MyPageResponse.from(user);
    }

    /**
     * 회원 정보 수정
     */
    @Transactional
    public MyPageUpdateResponse updateMyPageInfo(String userId, MyPageUpdateRequest request) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new IllegalArgumentException("탈퇴한 회원입니다.");
        }

        // 닉네임 변경 시 중복 검사
        if (request.getNickname() != null && !request.getNickname().equals(user.getNickname())) {
            if (userRepository.existsByNickname(request.getNickname())) {
                throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
            }
        }

        // 전화번호 변경 시 중복 검사
        if (request.getPhoneNum() != null && !request.getPhoneNum().equals(user.getPhoneNum())) {
            if (userRepository.existsByPhoneNum(request.getPhoneNum())) {
                throw new IllegalArgumentException("이미 존재하는 전화번호입니다.");
            }
        }

        user.updateMyPageInfo(
                request.getNickname(),
                request.getPhoneNum(),
                request.getBankName(),
                request.getAccountNum()
        );

        return MyPageUpdateResponse.from(user);
    }
}
