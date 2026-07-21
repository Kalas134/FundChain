package com.fundchain.auth.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Table(name = "users")
@Setter
@NoArgsConstructor
public class LoginRequest {

    @Id
    @Column(name = "USERID", length = 10)
    private String userId;

    @Column(name = "PASSWORD", nullable = false)
    private String password;
}
