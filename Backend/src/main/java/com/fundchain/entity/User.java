package com.fundchain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {
    /* 회원 아이디 (PK) */
    @Id
    @Column(name = "USERID", length = 10)
    private String userId;

    /**
     * 회원 권한 (USER, CREATOR, ADMIN)
     */
    @Column(name = "USER_ROLE", nullable = false, length = 20)
    private String userRole;

    /**
     * 암호화된 비밀번호
     */
    @Column(name = "PASSWORD", nullable = false, length = 100)
    private String password;

    /**
     * 닉네임
     */
    @Column(name = "NICKNAME", nullable = false, unique = true, length = 30)
    private String nickname;

    /**
     * 이름
     */
    @Column(name = "USERNAME", nullable = false, length = 30)
    private String userName;

    /**
     * 생년월일
     */
    @Column(name = "BIRTHDATE", nullable = false)
    private LocalDate birthDate;

    /**
     * 전화번호
     */
    @Column(name = "PHONE_NUM", nullable = false, length = 20)
    private String phoneNum;

    /**
     * 이메일
     */
    @Column(name = "EMAIL", nullable = false, length = 100)
    private String email;

    /**
     * 은행명
     */
    @Column(name = "BANK_NAME", nullable = false, length = 30)
    private String bankName;

    /**
     * 계좌번호
     */
    @Column(name = "ACCOUNT_NUM", nullable = false, length = 25)
    private String accountNum;
}
