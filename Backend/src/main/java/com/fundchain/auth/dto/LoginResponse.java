package com.fundchain.auth.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@Table(name = "users")
@AllArgsConstructor
public class LoginResponse {

    @Id
    @Column(name = "USERID", length = 10)
    private String userId;

    @Column(name = "NICKNAME", nullable = false, unique = true)
    private String nickName;

    @Column(name = "USER_ROLE", nullable = false)
    private String userRole;

    private String token; // jwt 토큰
}
