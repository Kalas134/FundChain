package com.fundchain.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

    private String userId;

    private String userRole;

    private String password;

    private String nickname;


    // API 문서: username
    @JsonProperty("userName")
    private String userName;


    // API 문서: birthdate
    @JsonProperty("birthDate")
    private LocalDate birthDate;



    private String phoneNum;

    private String email;

    private String bankName;

    private String accountNum;
}