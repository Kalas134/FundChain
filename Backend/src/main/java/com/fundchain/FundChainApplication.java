package com.fundchain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

// Spring Scheduler 활성화 (프로젝트 자동 진행/종료/정산 스케줄러)
@EnableScheduling
@SpringBootApplication
public class FundChainApplication {

    public static void main(String[] args) {
        SpringApplication.run(FundChainApplication.class, args);
    }

}

