package com.fundchain.repository;

import com.fundchain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // 아이디 조회
    Optional<User> findByUserId(String userId);

    // 아이디 중복 확인
    boolean existsByUserId(String userId);

    // 닉네임 중복 확인
    boolean existsByNickname(String nickname);

    // 이메일 중복 확인
    boolean existsByEmail(String email);
}
