import React, { useState } from 'react';
import editIcon from '../../assets/edit.svg';
import checkIcon from '../../assets/check.svg';
import closeIcon from '../../assets/close.svg';

/**
 * 프로필 정보를 카드 형태로 보여주고, 수정/저장 기능을 제공하는 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.userInfo - 사용자 프로필 정보 객체 (imageUrl, nickname, name, birth, email, phone)
 * @param {Function} props.onUpdate - 프로필 정보 저장 시 상위 컴포넌트로 변경된 정보를 전달하는 콜백 함수
 */
function Card({ userInfo, onUpdate }) {
    // 수정 모드 활성화 여부 상태
    const [isEditing, setIsEditing] = useState(false);
    // 수정 취소 또는 완료 전까지 임시로 입력값을 보관하는 상태
    const [tempInfo, setTempInfo] = useState({ ...userInfo });

    /**
     * 카드 클릭 시 수정 모드로 전환하는 핸들러
     * 이미 수정 모드인 경우 재전환을 방지합니다.
     */
    const handleCardClick = () => {
        if (!isEditing) {
            setTempInfo({ ...userInfo });
            setIsEditing(true);
        }
    };

    /**
     * 입력 필드(input) 데이터 변경 시 호출되는 이벤트 핸들러
     * @param {React.ChangeEvent<HTMLInputElement>} e - 입력 변경 이벤트 객체
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * 수정 완료 버튼 클릭 시 변경사항 저장 핸들러
     * 이벤트 전파를 중단(e.stopPropagation)하고 상위 컴포넌트의 onUpdate를 호출합니다.
     * @param {React.MouseEvent<HTMLButtonElement>} e - 클릭 이벤트 객체
     */
    const handleSave = (e) => {
        e.stopPropagation();
        onUpdate(tempInfo);
        setIsEditing(false);
    };

    /**
     * 수정 취소 버튼 클릭 시 핸들러
     * 변경 내용을 저정하지 않고 수정 모드를 종료합니다.
     * @param {React.MouseEvent<HTMLButtonElement>} e - 클릭 이벤트 객체
     */
    const handleCancel = (e) => {
        e.stopPropagation();
        setIsEditing(false);
    };

    return (
        <div
            onClick={handleCardClick}
            className={`relative flex items-center bg-white gap-5 p-8 rounded-2xl shadow-md transition-all duration-300 mx-auto mt-16 group overflow-hidden ${!isEditing ? 'hover:-translate-y-1 hover:shadow-xl cursor-pointer' : 'shadow-lg'
                }`}
        >
            {/* 프로필 이미지 영역 */}
            {userInfo.imageUrl && (
                <img
                    src={userInfo.imageUrl}
                    alt={userInfo.nickname}
                    className="size-48 flex-shrink-0 rounded-full object-cover shadow-inner mx-8 my-4 select-none"
                />
            )}

            {/* 사용자 정보 상세/수정 입력 영역 */}
            <div className="flex-1 mx-8 text-left">
                {!isEditing ? (
                    /* 1. 읽기 전용 모드 (뷰 모드) */
                    <div className="space-y-3">
                        <h2 className="mb-4 text-2xl font-bold text-gray-800">{userInfo.nickname}</h2>
                        <p className="leading-relaxed text-gray-600 text-sm">
                            <span className="font-semibold text-gray-400 mr-2 inline-block w-20">이름</span>
                            {userInfo.name}
                        </p>
                        <p className="leading-relaxed text-gray-600 text-sm">
                            <span className="font-semibold text-gray-400 mr-2 inline-block w-20">생년월일</span>
                            {userInfo.birth}
                        </p>
                        <p className="leading-relaxed text-gray-600 text-sm">
                            <span className="font-semibold text-gray-400 mr-2 inline-block w-20">이메일</span>
                            {userInfo.email}
                        </p>
                        <p className="leading-relaxed text-gray-600 text-sm">
                            <span className="font-semibold text-gray-400 mr-2 inline-block w-20">연락처</span>
                            {userInfo.phone}
                        </p>
                    </div>
                ) : (
                    /* 2. 편집 모드 (수정 양식) */
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">닉네임</label>
                            <input
                                type="text"
                                name="nickname"
                                value={tempInfo.nickname}
                                onChange={handleChange}
                                className="text-xl font-bold border-b-2 border-gray-300 focus:border-accent focus:outline-none w-full bg-transparent pb-1"
                                placeholder="닉네임"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-0.5">이름</label>
                            <input
                                type="text"
                                name="name"
                                value={tempInfo.name}
                                onChange={handleChange}
                                className="text-sm border-b border-gray-300 focus:border-accent focus:outline-none w-full bg-transparent py-0.5 text-gray-700"
                                placeholder="이름"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-0.5">생년월일</label>
                            <input
                                type="text"
                                name="birth"
                                value={tempInfo.birth}
                                onChange={handleChange}
                                className="text-sm border-b border-gray-300 focus:border-accent focus:outline-none w-full bg-transparent py-0.5 text-gray-700"
                                placeholder="생년월일"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-0.5">이메일</label>
                            <input
                                type="email"
                                name="email"
                                value={tempInfo.email}
                                onChange={handleChange}
                                className="text-sm border-b border-gray-300 focus:border-accent focus:outline-none w-full bg-transparent py-0.5 text-gray-700"
                                placeholder="이메일"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-0.5">연락처</label>
                            <input
                                type="text"
                                name="phone"
                                value={tempInfo.phone}
                                onChange={handleChange}
                                className="text-sm border-b border-gray-300 focus:border-accent focus:outline-none w-full bg-transparent py-0.5 text-gray-700"
                                placeholder="연락처"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* 3. 수정 모드 시 상단 우측 액션 버튼 (확인 / 취소) */}
            {isEditing && (
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="p-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-full shadow-md transition-all duration-200"
                        title="수정 완료"
                    >
                        <img src={checkIcon} alt="check" className="w-5 h-5 filter brightness-0 invert" />
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="p-2 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-full shadow-md transition-all duration-200"
                        title="수정 취소"
                    >
                        <img src={closeIcon} alt="close" className="w-5 h-5 filter brightness-0 invert" />
                    </button>
                </div>
            )}

            {/* 4. 비수정 모드일 때 카드 위에 노출되는 마우스 호버 오버레이 */}
            {!isEditing && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2 pointer-events-none select-none">
                    <img
                        src={editIcon}
                        alt="edit"
                        className="w-10 h-10 filter brightness-0 invert transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="font-semibold text-lg tracking-wider">수정하기</span>
                </div>
            )}
        </div>
    );
}

export default Card;