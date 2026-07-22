package com.fundchain.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;


@Component
public class JwtProvider {


    private final SecretKey secretKey;

    private final long expiration;


    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration
    ) {

        this.secretKey =
                Keys.hmacShaKeyFor(secret.getBytes());

        this.expiration = expiration;
    }



    /**
     * JWT 생성
     */
    public String createToken(String userId, String userRole) {


        Date now = new Date();

        Date expiryDate =
                new Date(now.getTime() + expiration);



        return Jwts.builder()
                .subject(userId)
                .claim("role", userRole)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }



    /**
     * JWT 검증
     */
    public boolean validateToken(String token) {

        try {

            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);

            return true;


        } catch (Exception e) {

            return false;
        }
    }



    /**
     * JWT에서 사용자 ID 추출
     */
    public String getUserId(String token) {


        Claims claims =
                Jwts.parser()
                        .verifyWith(secretKey)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();


        return claims.getSubject();
    }



    /**
     * JWT에서 권한 추출
     */
    public String getUserRole(String token) {


        Claims claims =
                Jwts.parser()
                        .verifyWith(secretKey)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();


        return claims.get("role", String.class);
    }

}