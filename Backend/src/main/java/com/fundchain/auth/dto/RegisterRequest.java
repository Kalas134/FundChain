package com.fundchain.auth.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Table(name="users")
@Setter
@NoArgsConstructor
public class RegisterRequest {

    @Id
    @Column(name = "USERID", length = 10)
    private String userId;

    @Column(name = "USER_ROLE", nullable = false)
    private String userRole;

    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @Column(name = "NICKNAME", nullable = false, unique = true)
    private String nickname;

    @Column(name = "USERNAME", nullable = false)
    private String userName;

    @Column(name = "BIRTHDATE", nullable = false)
    private String birthDate;

    @Column(name = "PHONE_NUM", nullable = false)
    private String phoneNum;

    @Column(name = "EMAIL", nullable = false)
    private String email;

    @Column(name = "BANK_NAME", nullable = false)
    private String bankName;

    @Column(name = "ACCOUNT_NUM", nullable = false)
    private String accountNum;
}
