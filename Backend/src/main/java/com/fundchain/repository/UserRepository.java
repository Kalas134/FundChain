package com.fundchain.repository;

import com.fundchain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // ============================================================
    // 사용자 조회
    // ============================================================

    // 아이디로 사용자 조회
    Optional<User> findByUserId(String userId);

    // 탈퇴하지 않은 사용자만 아이디로 조회
    Optional<User> findByUserIdAndIsDeletedFalse(String userId);


    // ============================================================
    // 로그인
    // ============================================================

    // 탈퇴하지 않은 사용자만 이메일로 조회
    Optional<User> findByEmailAndIsDeletedFalse(String email);


    // ============================================================
    // 회원가입 중복 확인
    // ============================================================

    // 탈퇴하지 않은 사용자 기준 아이디 중복 확인
    boolean existsByUserIdAndIsDeletedFalse(String userId);

    // 탈퇴하지 않은 사용자 기준 닉네임 중복 확인
    boolean existsByNicknameAndIsDeletedFalse(String nickname);

    // 탈퇴하지 않은 사용자 기준 이메일 중복 확인
    boolean existsByEmailAndIsDeletedFalse(String email);

    // 탈퇴하지 않은 사용자 기준 전화번호 중복 확인
    boolean existsByPhoneNumAndIsDeletedFalse(String phoneNum);


    // ============================================================
    // 스케줄러: 탈퇴 후 1년 이상 경과된 회원 조회
    // ============================================================

    List<User> findByIsDeletedTrueAndDeletedAtBefore(OffsetDateTime dateTime);

}