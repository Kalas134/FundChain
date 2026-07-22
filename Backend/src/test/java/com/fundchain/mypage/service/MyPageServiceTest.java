package com.fundchain.mypage.service;

import com.fundchain.entity.User;
import com.fundchain.mypage.dto.MyPageResponse;
import com.fundchain.mypage.dto.MyPageUpdateRequest;
import com.fundchain.mypage.dto.MyPageUpdateResponse;
import com.fundchain.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class MyPageServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private MyPageService myPageService;

    @Test
    @DisplayName("회원정보 조회 성공")
    void getMyPageInfo_Success() {
        // given
        User user = User.builder()
                .userId("user123")
                .userRole("CREATOR")
                .nickname("창작자닉네임")
                .userName("홍길동")
                .birthDate(LocalDate.of(1995, 5, 15))
                .phoneNum("010-1234-5678")
                .email("user123@example.com")
                .bankName("국민은행")
                .accountNum("123-4567-8901-23")
                .build();

        given(userRepository.findByUserId("user123")).willReturn(Optional.of(user));

        // when
        MyPageResponse response = myPageService.getMyPageInfo("user123");

        // then
        assertThat(response.getUserId()).isEqualTo("user123");
        assertThat(response.getUserRole()).isEqualTo("CREATOR");
        assertThat(response.getNickname()).isEqualTo("창작자닉네임");
        assertThat(response.getUsername()).isEqualTo("홍길동");
        assertThat(response.getBirthdate()).isEqualTo(LocalDate.of(1995, 5, 15));
        assertThat(response.getPhoneNum()).isEqualTo("010-1234-5678");
        assertThat(response.getEmail()).isEqualTo("user123@example.com");
        assertThat(response.getBankName()).isEqualTo("국민은행");
        assertThat(response.getAccountNum()).isEqualTo("123-4567-8901-23");
    }

    @Test
    @DisplayName("회원정보 수정 성공")
    void updateMyPageInfo_Success() {
        // given
        User user = User.builder()
                .userId("user123")
                .userRole("CREATOR")
                .nickname("창작자닉네임")
                .userName("홍길동")
                .birthDate(LocalDate.of(1995, 5, 15))
                .phoneNum("010-1234-5678")
                .email("user123@example.com")
                .bankName("국민은행")
                .accountNum("123-4567-8901-23")
                .build();

        MyPageUpdateRequest request = MyPageUpdateRequest.builder()
                .nickname("새로운닉네임")
                .phoneNum("010-9876-5432")
                .bankName("신한은행")
                .accountNum("987-654-321098")
                .build();

        given(userRepository.findByUserId("user123")).willReturn(Optional.of(user));
        given(userRepository.existsByNickname("새로운닉네임")).willReturn(false);
        given(userRepository.existsByPhoneNum("010-9876-5432")).willReturn(false);

        // when
        MyPageUpdateResponse response = myPageService.updateMyPageInfo("user123", request);

        // then
        assertThat(response.getUserId()).isEqualTo("user123");
        assertThat(response.getNickname()).isEqualTo("새로운닉네임");
        assertThat(response.getPhoneNum()).isEqualTo("010-9876-5432");
        assertThat(response.getBankName()).isEqualTo("신한은행");
        assertThat(response.getAccountNum()).isEqualTo("987-654-321098");
    }

    @Test
    @DisplayName("회원정보 수정 실패 - 닉네임 중복")
    void updateMyPageInfo_DuplicateNickname() {
        // given
        User user = User.builder()
                .userId("user123")
                .nickname("창작자닉네임")
                .phoneNum("010-1234-5678")
                .build();

        MyPageUpdateRequest request = MyPageUpdateRequest.builder()
                .nickname("이미있는닉네임")
                .build();

        given(userRepository.findByUserId("user123")).willReturn(Optional.of(user));
        given(userRepository.existsByNickname("이미있는닉네임")).willReturn(true);

        // when & then
        assertThatThrownBy(() -> myPageService.updateMyPageInfo("user123", request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("이미 존재하는 닉네임입니다.");
    }
}
