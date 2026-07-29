package com.fundchain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    /**
     * 회원 아이디 (PK)
     */
    @Id
    @Column(name = "USER_ID", length = 50)
    private String userId;


    /**
     * 회원 권한 (USER, CREATOR, ADMIN)
     */
    @Column(
            name = "USER_ROLE",
            nullable = false,
            length = 20
    )
    private String userRole;


    /**
     * 암호화된 비밀번호 (탈퇴 1년 후 파기 시 null 가능)
     */
    @Column(
            name = "PASSWORD",
            length = 100
    )
    private String password;


    /**
     * 닉네임 (탈퇴 1년 후 파기 시 deleted_userId 형태 변경)
     */
    @Column(
            name = "NICKNAME",
            unique = true,
            length = 50
    )
    private String nickname;


    /**
     * 사용자 이름 (탈퇴 1년 후 파기 시 null 가능)
     */
    @Column(
            name = "USERNAME",
            length = 50
    )
    private String userName;


    /**
     * 생년월일 (탈퇴 1년 후 파기 시 null 가능)
     */
    @Column(
            name = "BIRTHDATE"
    )
    private LocalDate birthDate;


    /**
     * 전화번호 (탈퇴 1년 후 파기 시 null 가능)
     */
    @Column(
            name = "PHONE_NUM",
            unique = true,
            length = 20
    )
    private String phoneNum;


    /**
     * 이메일 (탈퇴 1년 후 파기 시 null 가능)
     */
    @Column(
            name = "EMAIL",
            unique = true,
            length = 100
    )
    private String email;


    /**
     * 은행명
     * USER는 없을 수 있음
     * CREATOR는 필요
     */
    @Column(
            name = "BANK_NAME",
            length = 30
    )
    private String bankName;


    /**
     * 계좌번호
     * USER는 없을 수 있음
     * CREATOR는 필요
     */
    @Column(
            name = "ACCOUNT_NUM",
            length = 25
    )
    private String accountNum;


    /**
     * Soft Delete 여부
     *
     * false → 정상 회원
     * true  → 탈퇴 회원
     */
    @Column(
            name = "IS_DELETED",
            nullable = false
    )
    @Builder.Default
    private Boolean isDeleted = false;


    /**
     * 탈퇴 신청 일시 (Soft Delete 시점)
     */
    @Column(name = "DELETED_AT")
    private OffsetDateTime deletedAt;


    /**
     * 회원 정보 수정 (마이페이지)
     */
    public void updateMyPageInfo(
            String nickname,
            String phoneNum,
            String bankName,
            String accountNum
    ) {

        if (nickname != null && !nickname.isBlank()) {
            this.nickname = nickname;
        }

        if (phoneNum != null && !phoneNum.isBlank()) {
            this.phoneNum = phoneNum;
        }

        if (bankName != null) {
            this.bankName = bankName;
        }

        if (accountNum != null) {
            this.accountNum = accountNum;
        }
    }


    /**
     * 회원 탈퇴 (Soft Delete)
     *
     * 실제 DB 레코드는 삭제하지 않는다.
     * IS_DELETED만 false → true로 변경하고 DELETED_AT에 탈퇴 일시를 기록한다.
     */
    public void deleteAccount() {
        this.isDeleted = true;
        this.deletedAt = OffsetDateTime.now();
    }

    /**
     * 탈퇴 후 1년 지난 사용자 개인정보 익명화 (파기)
     */
    public void anonymizeUserInfo() {
        this.password = null;
        this.userName = null;
        this.nickname = "deleted_" + this.userId;
        this.email = null;
        this.phoneNum = null;
        this.birthDate = null;
        this.bankName = null;
        this.accountNum = null;
    }
}