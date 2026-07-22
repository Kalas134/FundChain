package com.fundchain.mypage.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fundchain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPageResponse {

    private String userId;
    private String userRole;
    private String nickname;

    @JsonProperty("username")
    private String username;

    @JsonProperty("birthdate")
    private LocalDate birthdate;

    private String phoneNum;
    private String email;
    private String bankName;
    private String accountNum;

    public static MyPageResponse from(User user) {
        return MyPageResponse.builder()
                .userId(user.getUserId())
                .userRole(user.getUserRole())
                .nickname(user.getNickname())
                .username(user.getUserName())
                .birthdate(user.getBirthDate())
                .phoneNum(user.getPhoneNum())
                .email(user.getEmail())
                .bankName(user.getBankName())
                .accountNum(user.getAccountNum())
                .build();
    }
}
