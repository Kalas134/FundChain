package com.fundchain.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String userId;

    private String nickname;

    private String userRole;

    private String token;
}