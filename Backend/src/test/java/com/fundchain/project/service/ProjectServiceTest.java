package com.fundchain.project.service;

import com.fundchain.entity.Project;
import com.fundchain.entity.ProjectStatus;
import com.fundchain.entity.TransactionLedger;
import com.fundchain.entity.User;
import com.fundchain.hashchain.HashChainService;
import com.fundchain.repository.ProjectRepository;
import com.fundchain.repository.TransactionLedgerRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TransactionLedgerRepository transactionLedgerRepository;

    @Mock
    private HashChainService hashChainService;

    @InjectMocks
    private ProjectServiceImpl projectService;

    @Test
    @DisplayName("종료일이 지나고 목표 금액을 달성한 경우 SUCCESS 상태로 변경되고 SETTLEMENT 트랜잭션이 생성된다")
    void processProjectStatusUpdates_Success() {
        // given
        Long projectId = 1L;
        String creatorId = "creator01";
        User creator = mock(User.class);
        given(creator.getUserId()).willReturn(creatorId);

        Project mockProject = mock(Project.class);
        given(mockProject.getProjectId()).willReturn(projectId);
        given(mockProject.getTargetAmount()).willReturn(new BigDecimal("1000000"));
        given(mockProject.getCreator()).willReturn(creator);

        given(projectRepository.findByStatusAndStartDateLessThanEqual(eq(ProjectStatus.PREPARING), any()))
                .willReturn(Collections.emptyList());
        given(projectRepository.findByStatusAndEndDateLessThanEqual(eq(ProjectStatus.ONGOING), any()))
                .willReturn(List.of(mockProject));
        given(projectRepository.findByStatusAndEndDateLessThanEqual(eq(ProjectStatus.PREPARING), any()))
                .willReturn(Collections.emptyList());

        given(transactionLedgerRepository.findTotalAmountByProjectIdAndTransactionType(projectId, "SUPPORT"))
                .willReturn(new BigDecimal("1500000"));
        given(transactionLedgerRepository.existsByProjectIdAndTransactionType(projectId, "SETTLEMENT"))
                .willReturn(false);

        // when
        projectService.processProjectStatusUpdates();

        // then
        verify(mockProject).updateProject(null, null, null, null, null, ProjectStatus.SUCCESS);
        verify(hashChainService).createTransaction(projectId, creatorId, 1500000L, "SETTLEMENT");
    }

    @Test
    @DisplayName("종료일이 지나고 목표 금액을 달성하지 못한 경우 FAILED 상태로 변경되고 REFUND 트랜잭션이 생성된다")
    void processProjectStatusUpdates_Failed() {
        // given
        Long projectId = 2L;
        Project mockProject = mock(Project.class);
        given(mockProject.getProjectId()).willReturn(projectId);
        given(mockProject.getTargetAmount()).willReturn(new BigDecimal("1000000"));

        given(projectRepository.findByStatusAndStartDateLessThanEqual(eq(ProjectStatus.PREPARING), any()))
                .willReturn(Collections.emptyList());
        given(projectRepository.findByStatusAndEndDateLessThanEqual(eq(ProjectStatus.ONGOING), any()))
                .willReturn(List.of(mockProject));
        given(projectRepository.findByStatusAndEndDateLessThanEqual(eq(ProjectStatus.PREPARING), any()))
                .willReturn(Collections.emptyList());

        given(transactionLedgerRepository.findTotalAmountByProjectIdAndTransactionType(projectId, "SUPPORT"))
                .willReturn(new BigDecimal("500000"));
        given(transactionLedgerRepository.existsByProjectIdAndTransactionType(projectId, "REFUND"))
                .willReturn(false);

        TransactionLedger supportLedger = TransactionLedger.builder()
                .projectId(projectId)
                .userId("backer01")
                .amount(500000L)
                .transactionType("SUPPORT")
                .previousHash("0000")
                .currentHash("1111")
                .build();

        given(transactionLedgerRepository.findByProjectIdAndTransactionType(projectId, "SUPPORT"))
                .willReturn(List.of(supportLedger));

        // when
        projectService.processProjectStatusUpdates();

        // then
        verify(mockProject).updateProject(null, null, null, null, null, ProjectStatus.FAILED);
        verify(hashChainService).createTransaction(projectId, "backer01", 500000L, "REFUND");
    }
}
