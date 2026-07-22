package com.fundchain.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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


    // API 문서: username
    @JsonProperty("username")
    private String userName;


    // API 문서: birthdate
    @JsonProperty("birthdate")
    private String birthDate;


    private String phoneNum;

    private String email;

    private String bankName;

    private String accountNum;
}