import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 라우터 이동을 위한 Link 컴포넌트 추가
import profileImg from '../../assets/profile.png';
import arrowDownImg from '../../assets/arrowdown.svg';

function ProfileMenu(props) {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        imageUrl: profileImg,
        nickname: "동구리",
        name: "이동구",
        birth: "2001.04.01",
        email: "cucu0401@naver.com",
        phone: "010-4444-4444",
    });

    // 드롭다운 열림/닫힘 상태 관리
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative inline-block text-left">
            {/* 1. 전체를 감싸는 타원형 버튼 */}
            <button
                onClick={toggleDropdown}
                className="flex flex-row items-center gap-2 bg-gray-100 hover:bg-gray-300 active:bg-gray-400 p-2 rounded-full transition-colors duration-200 focus:outline-none"
            >
                {/* 프로필 이미지 */}
                <img
                    src={userInfo.imageUrl}
                    alt={userInfo.nickname}
                    className="size-8 flex-shrink-0 rounded-full object-cover shadow-inner select-none"
                />

                {/* 화살표 아이콘 (클릭 시 180도 회전) */}
                <img
                    src={arrowDownImg}
                    alt="dropdownmenu"
                    className={`size-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>

            {/* 2. 드롭다운 메뉴 */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {/* 사용자 정보 간략 표시 */}
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                            <p className="font-bold">{userInfo.nickname}</p>
                            <p className="text-xs text-gray-400 truncate">{userInfo.email}</p>
                        </div>

                        {/* 내 프로필 */}
                        <Link
                            to="/mypage"
                            onClick={toggleDropdown}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                        >
                            내 프로필
                        </Link>

                        {/* 내가 후원한 프로젝트 */}
                        <Link
                            to="/sponsoredprojects"
                            onClick={toggleDropdown}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                        >
                            후원한 프로젝트
                        </Link>

                        {/* 후원 내역 */}
                        <Link
                            to="/transactionhistory"
                            onClick={toggleDropdown}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                        >
                            후원 내역
                        </Link>

                        {/* 로그아웃 (마지막 위치 유지) */}
                        <button
                            onClick={() => {

                                // JWT delete
                                localStorage.removeItem("accessToken");

                                // 사용자 권한 삭제
                                localStorage.removeItem("userRole");

                                // Dropdown closed
                                toggleDropdown();

                                alert('로그아웃 되었습니다.');

                                // 메인페이지 이동
                                window.location.href = "/";
                            }}
                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                            role="menuitem"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;