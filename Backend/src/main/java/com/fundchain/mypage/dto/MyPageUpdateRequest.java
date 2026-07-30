package com.fundchain.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPageUpdateRequest {

    private String nickname;
    private String phoneNum;
    private String bankName;
    private String accountNum;
    private String profileImage;
}
