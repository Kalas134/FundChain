import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 라우터 이동을 위한 Link 컴포넌트 추가
import profileImg from '../../assets/profile.png';
import arrowDownImg from '../../assets/arrowdown.svg';
import { getMyPageInfo } from '../../features/mypage/services/myPageApi';

function ProfileMenu(props) {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        imageUrl: profileImg,
        nickname: "",
        name: "",
        email: "",
        userRole: localStorage.getItem("userRole") || "USER",
    });

    // 드롭다운 열림/닫힘 상태 관리
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            try {
                const data = await getMyPageInfo();
                setUserInfo({
                    ...data,
                    imageUrl: profileImg,
                });
                if (data.userRole) {
                    localStorage.setItem("userRole", data.userRole);
                }
            } catch (err) {
                console.error("ProfileMenu 회원 정보 불러오기 실패:", err);
            }
        };

        fetchUserInfo();
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const userRole = userInfo.userRole || localStorage.getItem("userRole");
    const isCreator = userRole === "CREATOR";

    return (
        <div className="relative inline-block text-left">
            {/* 1. 전체를 감싸는 타원형 버튼 */}
            <button
                onClick={toggleDropdown}
                className="flex flex-row items-center gap-2 bg-gray-100 hover:bg-gray-300 active:bg-gray-400 p-2 rounded-full transition-colors duration-200 focus:outline-none"
            >
                {/* 프로필 이미지 */}
                <img
                    src={userInfo.imageUrl || profileImg}
                    alt={userInfo.nickname || "프로필"}
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
                            <p className="font-bold">{userInfo.nickname || userInfo.username || "사용자"}</p>
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

                        {/* USER: 후원한 프로젝트 / CREATOR: 내 프로젝트 */}
                        <Link
                            to={isCreator ? "/myprojects" : "/sponsoredprojects"}
                            onClick={toggleDropdown}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                        >
                            {isCreator ? "내 프로젝트" : "후원한 프로젝트"}
                        </Link>

                        {/* USER: 후원 내역 / CREATOR: 정산 내역 */}
                        <Link
                            to={isCreator ? "/settlement" : "/transactionhistory"}
                            onClick={toggleDropdown}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                        >
                            {isCreator ? "정산 내역" : "후원 내역"}
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