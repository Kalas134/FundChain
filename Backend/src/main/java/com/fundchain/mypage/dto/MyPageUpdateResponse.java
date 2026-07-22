package com.fundchain.mypage.dto;

import com.fundchain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPageUpdateResponse {

    private String userId;
    private String nickname;
    private String phoneNum;
    private String bankName;
    private String accountNum;

    public static MyPageUpdateResponse from(User user) {
        return MyPageUpdateResponse.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .phoneNum(user.getPhoneNum())
                .bankName(user.getBankName())
                .accountNum(user.getAccountNum())
                .build();
    }
}
