package com.fundchain.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

    private String userId;

    private String userRole;

    private String password;

    private String nickname;

    private String userName;

    private String birthDate;

    private String phoneNum;

    private String email;

    private String bankName;

    private String accountNum;
}
