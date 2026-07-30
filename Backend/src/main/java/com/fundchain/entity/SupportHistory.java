package com.fundchain.entity;

import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * 후원 내역 (Support History) 엔티티
 * DB 테이블(SupportHistory) 매핑: SUPPORT_ID, PROJECT_ID, USER_ID, AMOUNT, SUPPORTED_AT
 */
@Entity
@Table(name = "support_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SupportHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUPPORT_ID")
    private Long supportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROJECT_ID", nullable = false)
    @NotFound(action = NotFoundAction.IGNORE)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "AMOUNT", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "SUPPORTED_AT", nullable = false)
    private OffsetDateTime supportedAt;

    @PrePersist
    public void prePersist() {
        if (this.supportedAt == null) {
            this.supportedAt = OffsetDateTime.now();
        }
    }
}
