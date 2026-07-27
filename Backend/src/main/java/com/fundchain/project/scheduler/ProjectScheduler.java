package com.fundchain.project.scheduler;

import com.fundchain.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 프로젝트 상태 자동 업데이트 스케줄러
 * - 시작일이 도래한 프로젝트의 상태를 PREPARING -> ONGOING으로 전환
 * - 종료일이 지난 프로젝트의 누적 후원 금액을 집계하여 목표 금액 달성 여부에 따라 SUCCESS / FAILED 상태로 업데이트
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ProjectScheduler {

    private final ProjectService projectService;

    /**
     * 주기적으로 프로젝트 상태 업데이트를 수행합니다.
     * 기본 설정: 매 분 0초마다 실행 (cron = "0 * * * * *")
     */
    @Scheduled(cron = "0 * * * * *")
    public void scheduleProjectStatusUpdate() {
        log.info("[Scheduler] 프로젝트 상태 업데이트 작업을 시작합니다.");
        try {
            projectService.processProjectStatusUpdates();
            log.info("[Scheduler] 프로젝트 상태 업데이트 작업이 성공적으로 완료되었습니다.");
        } catch (Exception e) {
            log.error("[Scheduler] 프로젝트 상태 업데이트 중 오류가 발생했습니다.", e);
        }
    }
}
