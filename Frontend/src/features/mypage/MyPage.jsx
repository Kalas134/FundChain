import React, { useState, useEffect } from 'react';
import Card from './Card';
import profileImg from '../../assets/profile.png';
import { getMyPageInfo, updateMyPageInfo, deleteMyAccount } from './services/myPageApi';

/**
 * 마이페이지 메인 컴포넌트
 * 백엔드 API와 연동하여 사용자 프로필 정보를 불러오고 수정합니다.
 */
function Mypage(props) {
    const [userInfo, setUserInfo] = useState({
        imageUrl: profileImg,
        nickname: "",
        username: "",
        birthdate: "",
        email: "",
        phoneNum: "",
        bankName: "",
        accountNum: "",
        userRole: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 컴포넌트 마운트 시 사용자 정보 불러오기
    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMyPageInfo();
            setUserInfo({
                ...data,
                imageUrl: profileImg, // 이미지는 고정
            });
        } catch (err) {
            console.error("회원정보 조회 실패:", err);
            const msg = err.response?.data?.message || "회원 정보를 불러오지 못했습니다. 로그인 상태를 확인해 주세요.";
            if (
                err.response?.status === 400 ||
                err.response?.status === 401 ||
                msg.includes("존재하지 않는 회원") ||
                msg.includes("인증 정보")
            ) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("userRole");
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    /**
     * 프로필 정보 수정 시 호출되는 핸들러 함수
     * @param {Object} updatedInfo - 수정된 사용자 정보 객체
     */
    const handleUpdate = async (updatedInfo) => {
        try {
            const updatePayload = {
                nickname: updatedInfo.nickname,
                phoneNum: updatedInfo.phoneNum || updatedInfo.phone,
                bankName: updatedInfo.bankName,
                accountNum: updatedInfo.accountNum,
            };

            const updatedData = await updateMyPageInfo(updatePayload);

            setUserInfo((prev) => ({
                ...prev,
                ...updatedData,
                imageUrl: profileImg,
            }));

            alert("회원 정보가 성공적으로 수정되었습니다.");
        } catch (err) {
            console.error("회원정보 수정 실패:", err);
            const msg = err.response?.data?.message || err.message || "회원정보 수정 중 오류가 발생했습니다.";
            alert(`수정 실패: ${msg}`);
            throw err;
            }
    };

    /**
     * 회원 탈퇴 핸들러 함수
     */
    const handleDeleteAccount = async () => {
        const confirmWithdraw = window.confirm(
            "정말로 회원 탈퇴하시겠습니까?\n\n- 탈퇴 즉시 로그인 및 서비스 이용이 중단됩니다.\n- 관련 법령에 따라 거래 및 결제 내역은 5년간 보관됩니다.\n- 개인정보는 1년 후 스케줄러를 통해 완전히 파기됩니다."
        );
        if (!confirmWithdraw) return;

        try {
            await deleteMyAccount();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userRole");
            alert("회원 탈퇴가 성공적으로 완료되었습니다. 이용해 주셔서 감사합니다.");
            window.location.href = "/";
        } catch (err) {
            console.error("회원 탈퇴 실패:", err);
            const msg = err.response?.data?.message || err.response?.data || "회원 탈퇴 처리 중 오류가 발생했습니다.";
            alert(`탈퇴 실패: ${msg}`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                마이페이지 정보를 불러오는 중입니다...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center py-20 text-gray-600">
                <p className="text-lg font-semibold text-rose-600 mb-4">{error}</p>
                <div className="flex gap-4">
                    <button
                        onClick={fetchUserInfo}
                        className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg shadow hover:bg-opacity-90 transition-all"
                    >
                        다시 시도
                    </button>
                    <button
                        onClick={() => { window.location.href = "/LoginPage"; }}
                        className="px-4 py-2 bg-primary text-white font-medium rounded-lg shadow hover:bg-opacity-90 transition-all shadow-md"
                    >
                        다시 로그인하기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='px-16 pb-20'>
            {/* 사용자 정보 표시 및 수정 기능을 제공하는 프로필 카드 컴포넌트 */}
            <Card
                userInfo={userInfo}
                onUpdate={handleUpdate}
            />

            {/* 카드 오른쪽 아래 회원 탈퇴 버튼 */}
            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 text-sm font-semibold text-warning bg-white border border-warning/40 rounded-lg hover:bg-warning hover:text-white transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                >
                    회원 탈퇴
                </button>
            </div>
        </div>
    );
}

export default Mypage;