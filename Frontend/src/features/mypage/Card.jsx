import React, { useState, useEffect, useRef } from 'react';
import editIcon from '../../assets/edit.svg';
import checkIcon from '../../assets/check.svg';
import closeIcon from '../../assets/close.svg';
import profileImg from '../../assets/profile.png';
import { uploadProfileImage } from '../../services/supabaseClient';

/**
 * 프로필 정보를 카드 형태로 보여주고, 수정/저장 및 지연 이미지 업로드 기능을 제공하는 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.userInfo - 사용자 프로필 정보 객체
 * @param {Function} props.onUpdate - 프로필 정보 저장 시 상위 컴포넌트로 변경된 정보를 전달하는 콜백 함수
 */
function Card({ userInfo, onUpdate }) {
    // 수정 모드 활성화 여부 상태
    const [isEditing, setIsEditing] = useState(false);
    // 저장 중 상태
    const [isSaving, setIsSaving] = useState(false);
    // 선택된 이미지 파일 객체 (지연 업로드용)
    const [selectedFile, setSelectedFile] = useState(null);
    // 로컬 미리보기 Blob URL
    const [previewUrl, setPreviewUrl] = useState(null);
    // 수정 취소 또는 완료 전까지 임시로 입력값을 보관하는 상태
    const [tempInfo, setTempInfo] = useState({ ...userInfo });

    const fileInputRef = useRef(null);

    useEffect(() => {
        setTempInfo({ ...userInfo });
    }, [userInfo]);

    // 컴포넌트 언마운트 또는 미리보기 변경 시 Blob URL 해제
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    /**
     * 카드 클릭 시 수정 모드로 전환하는 핸들러
     */
    const handleCardClick = () => {
        if (!isEditing && !isSaving) {
            setTempInfo({ ...userInfo });
            setSelectedFile(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            setIsEditing(true);
        }
    };

    /**
     * 입력 필드(input) 데이터 변경 시 호출되는 이벤트 핸들러
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * 프로필 사진 수정 클릭 시 파일 탐색기 열기
     */
    const handleProfileImageClick = (e) => {
        if (isEditing && !isSaving) {
            e.stopPropagation();
            fileInputRef.current?.click();
        }
    };

    /**
     * 파일 선택 시 즉시 업로드하지 않고 로컬 미리보기만 생성 (지연 업로드)
     */
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 기존 미리보기 URL 해제
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const localUrl = URL.createObjectURL(file);
        setSelectedFile(file);
        setPreviewUrl(localUrl);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /**
     * 수정 완료 버튼 클릭 시 Supabase Storage 업로드 후 백엔드 DB 저장
     */
    const handleSave = async (e) => {
        e.stopPropagation();
        try {
            setIsSaving(true);

            let finalProfileImage = tempInfo.profileImage || tempInfo.imageUrl;

            // 선택된 새 파일이 있다면 '저장 완료' 시점에만 Supabase Storage에 업로드
            if (selectedFile) {
                const { publicUrl } = await uploadProfileImage(selectedFile);
                finalProfileImage = publicUrl;
            }

            const savePayload = {
                ...tempInfo,
                profileImage: finalProfileImage,
            };

            await onUpdate(savePayload);

            // 상태 초기화
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            setSelectedFile(null);
            setIsEditing(false);

            // Header의 ProfileMenu 갱신용 Custom Event 발송
            window.dispatchEvent(new CustomEvent('userProfileUpdated'));
        } catch (err) {
            console.error("프로필 수정 저장 실패:", err);
            alert(err.message || "프로필 저장 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * 수정 취소 버튼 클릭 시 핸들러
     * 업로드가 전혀 실행되지 않았으므로 로컬 상태만 초기화
     */
    const handleCancel = (e) => {
        e.stopPropagation();
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setSelectedFile(null);
        setTempInfo({ ...userInfo });
        setIsEditing(false);
    };

    const displayImage = isEditing
        ? (previewUrl || tempInfo.profileImage || tempInfo.imageUrl || profileImg)
        : (userInfo.profileImage || userInfo.imageUrl || profileImg);

    const displayName = userInfo.username || userInfo.name || '-';
    const displayBirth = userInfo.birthdate || userInfo.birth || '-';
    const displayPhone = userInfo.phoneNum || userInfo.phone || '-';

    return (
        <div
            onClick={handleCardClick}
            className={`relative flex items-center bg-white gap-5 p-8 rounded-2xl shadow-md transition-all duration-300 mx-auto mt-16 group overflow-hidden ${!isEditing ? 'hover:-translate-y-1 hover:shadow-xl cursor-pointer' : 'shadow-lg'
                }`}
        >
            {/* 프로필 이미지 영역 */}
            <div className="relative mx-8 my-4 flex-shrink-0">
                <img
                    src={displayImage}
                    alt={userInfo.nickname || '프로필'}
                    className="size-48 rounded-full object-cover shadow-inner select-none"
                />

                {/* hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                {/* 수정 모드 시 이미지 클릭 오버레이 및 Edit 아이콘 */}
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleProfileImageClick}
                        disabled={isSaving}
                        className="absolute inset-0 bg-black/40 hover:bg-black/50 rounded-full flex flex-col items-center justify-center text-white transition-all cursor-pointer group/img"
                        title="프로필 사진 변경"
                    >
                        {isSaving ? (
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs font-semibold">업로드 & 저장 중...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1 group-hover/img:scale-110 transition-transform">
                                <img
                                    src={editIcon}
                                    alt="edit photo"
                                    className="w-8 h-8 filter brightness-0 invert"
                                />
                                <span className="text-xs font-bold tracking-wider">사진 선택</span>
                            </div>
                        )}
                    </button>
                )}
            </div>

            {/* 사용자 정보 상세/수정 입력 영역 */}
            <div className="flex-1 mx-8 text-left">
                {!isEditing ? (
                    /* 1. 읽기 전용 모드 (뷰 모드) */
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">{userInfo.nickname || '닉네임 없음'}</h2>
                            {userInfo.userRole && (
                                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-accent/15 text-accent border border-accent/30">
                                    {userInfo.userRole}
                                </span>
                            )}
                        </div>
                        <p className="leading-relaxed text-gray-600 text-sm">
                            <span className="font-semibold text-gray-400 mr-2 inline-block w-20">이름</span>
                            {displayName}
                        </p>
                        <p className="leading-relaxed text-gray-600 text-sm">
                            <span className="font-semibold text-gray-400 mr-2 inline-block w-20">생년월일</span>
                            {displayBirth}
                        </p>
                        <p className="leading-relaxed text-gray-600 text-sm">
                            <span className="font-semibold text-gray-400 mr-2 inline-block w-20">이메일</span>
                            {userInfo.email || '-'}
                        </p>
                        <p className="leading-relaxed text-gray-600 text-sm">
                            <span className="font-semibold text-gray-400 mr-2 inline-block w-20">연락처</span>
                            {displayPhone}
                        </p>
                        <p className="leading-relaxed text-gray-600 text-sm">
                            <span className="font-semibold text-gray-400 mr-2 inline-block w-20">은행명</span>
                            {userInfo.bankName || '-'}
                        </p>
                        <p className="leading-relaxed text-gray-600 text-sm">
                            <span className="font-semibold text-gray-400 mr-2 inline-block w-20">계좌번호</span>
                            {userInfo.accountNum || '-'}
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
                                value={tempInfo.nickname || ''}
                                onChange={handleChange}
                                className="text-xl font-bold border-b-2 border-gray-300 focus:border-accent focus:outline-none w-full bg-transparent pb-1"
                                placeholder="닉네임"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-0.5">이름 (수정 불가)</label>
                            <input
                                type="text"
                                value={displayName}
                                disabled
                                className="text-sm border-b border-gray-200 bg-gray-50 text-gray-500 w-full py-0.5 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-0.5">생년월일 (수정 불가)</label>
                            <input
                                type="text"
                                value={displayBirth}
                                disabled
                                className="text-sm border-b border-gray-200 bg-gray-50 text-gray-500 w-full py-0.5 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-0.5">이메일 (수정 불가)</label>
                            <input
                                type="email"
                                value={userInfo.email || ''}
                                disabled
                                className="text-sm border-b border-gray-200 bg-gray-50 text-gray-500 w-full py-0.5 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-0.5">연락처</label>
                            <input
                                type="text"
                                name="phoneNum"
                                value={tempInfo.phoneNum !== undefined ? tempInfo.phoneNum : (tempInfo.phone || '')}
                                onChange={(e) => {
                                    handleChange({ target: { name: 'phoneNum', value: e.target.value } });
                                    handleChange({ target: { name: 'phone', value: e.target.value } });
                                }}
                                className="text-sm border-b border-gray-300 focus:border-accent focus:outline-none w-full bg-transparent py-0.5 text-gray-700"
                                placeholder="연락처"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-0.5">은행명</label>
                            <input
                                type="text"
                                name="bankName"
                                value={tempInfo.bankName || ''}
                                onChange={handleChange}
                                className="text-sm border-b border-gray-300 focus:border-accent focus:outline-none w-full bg-transparent py-0.5 text-gray-700"
                                placeholder="은행명"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-0.5">계좌번호</label>
                            <input
                                type="text"
                                name="accountNum"
                                value={tempInfo.accountNum || ''}
                                onChange={handleChange}
                                className="text-sm border-b border-gray-300 focus:border-accent focus:outline-none w-full bg-transparent py-0.5 text-gray-700"
                                placeholder="계좌번호"
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
                        disabled={isSaving}
                        className="p-2 bg-accent hover:opacity-90 active:scale-95 text-white rounded-full shadow-md transition-all duration-200 disabled:opacity-50"
                        title="수정 완료"
                    >
                        <img src={checkIcon} alt="check" className="w-5 h-5 filter brightness-0 invert" />
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="p-2 bg-warning hover:opacity-90 active:scale-95 text-white rounded-full shadow-md transition-all duration-200 disabled:opacity-50"
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