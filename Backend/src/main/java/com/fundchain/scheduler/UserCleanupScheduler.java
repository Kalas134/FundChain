package com.fundchain.scheduler;

import com.fundchain.entity.User;
import com.fundchain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * 회원 탈퇴 후 1년이 경과된 사용자의 개인정보를 주기적으로 파기(익명화)하는 스케줄러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class UserCleanupScheduler {

    private final UserRepository userRepository;

    /**
     * 매일 새벽 3시에 실행되어 탈퇴 후 1년이 지난 회원의 개인정보를 파기(익명화)합니다.
     * Cron 표현식: 초 분 시 일 월 요일
     */
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void anonymizeExpiredUsers() {
        OffsetDateTime oneYearAgo = OffsetDateTime.now().minusYears(1);
        List<User> expiredUsers = userRepository.findByIsDeletedTrueAndDeletedAtBefore(oneYearAgo);

        if (expiredUsers.isEmpty()) {
            return;
        }

        log.info("탈퇴 후 1년 이상 경과된 회원 {}명의 개인정보 파기를 시작합니다.", expiredUsers.size());

        for (User user : expiredUsers) {
            user.anonymizeUserInfo();
        }

        userRepository.saveAll(expiredUsers);

        log.info("회원 개인정보 파기(익명화) 완료: 총 {}명 처리됨.", expiredUsers.size());
    }
}
