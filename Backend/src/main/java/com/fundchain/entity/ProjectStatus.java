package com.fundchain.entity;

public enum ProjectStatus {

    PREPARING, // 등록 완료, 시작 전
    ONGOING,   // 진행 중
    SUCCESS,   // 목표 금액 달성
    FAILED     // 목표 금액 미달
}