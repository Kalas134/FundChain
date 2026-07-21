import React, { useState } from 'react';
import Card from './Card';
import profileImg from '../../assets/profile.png';

/**
 * 마이페이지 메인 컴포넌트
 * 사용자 프로필 정보를 관리하고 프로필 카드(Card) 컴포넌트를 렌더링합니다.
 */
function Mypage(props) {
    // 사용자 개인정보 상태 관리 (프로필 이미지, 닉네임, 이름, 생년월일, 이메일, 연락처)
    const [userInfo, setUserInfo] = useState({
        imageUrl: profileImg,
        nickname: "동구리",
        name: "이동구",
        birth: "2001.04.01",
        email: "cucu0401@naver.com",
        phone: "010-4444-4444",
    });

    /**
     * 프로필 정보 수정 시 호출되는 핸들러 함수
     * @param {Object} updatedInfo - 수정된 사용자 정보 객체
     */
    const handleUpdate = (updatedInfo) => {
        setUserInfo(updatedInfo);
    };

    return (
        <div className='px-16'>
            {/* 사용자 정보 표시 및 수정 기능을 제공하는 프로필 카드 컴포넌트 */}
            <Card
                userInfo={userInfo}
                onUpdate={handleUpdate}
            />
        </div>
    );
}

export default Mypage;