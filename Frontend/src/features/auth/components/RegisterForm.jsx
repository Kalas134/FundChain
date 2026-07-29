import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function RegisterForm() {
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        userId: "",
        userRole: "USER",
        password: "",
        nickname: "",
        userName: "",
        birthDate: "",
        phoneNum: "",
        email: "",
        bankName: "",
        accountNum: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value
        });
    };

    const handleRoleSelect = (role) => {
        setRegisterData({
            ...registerData,
            userRole: role
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await register(registerData);
            console.log("회원가입 성공", response);
            alert("회원가입이 완료되었습니다. 로그인 해주세요.");
            navigate("/login");
        } catch (error) {
            console.error(error);
            alert("회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm text-left">
            <div className="mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-thcolor">회원가입</h2>
                <p className="mt-1.5 text-sm text-slate-500">
                    FundChain과 함께 창의적인 크라우드 펀딩을 시작하세요.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. 회원 유형 선택 */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        회원 유형 선택
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleRoleSelect("USER")}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                registerData.userRole === "USER"
                                    ? "border-accent bg-emerald-50/50 text-emerald-600 font-bold"
                                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                            }`}
                        >
                            <span className="text-base font-bold">일반 사용자</span>
                            <span className="text-xs text-slate-500 mt-1">프로젝트 후원 및 정보 참여</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleRoleSelect("CREATOR")}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                registerData.userRole === "CREATOR"
                                    ? "border-funding bg-indigo-50/50 text-funding font-bold"
                                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                            }`}
                        >
                            <span className="text-base font-bold">크리에이터</span>
                            <span className="text-xs text-slate-500 mt-1">프로젝트 직접 생성 및 모금</span>
                        </button>
                    </div>
                </div>

                {/* 2. 계정 기본 정보 */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
                        계정 정보
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                아이디 <span className="text-rose-500">*</span>
                            </label>
                            <input
                                name="userId"
                                required
                                placeholder="아이디 입력"
                                value={registerData.userId}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                비밀번호 <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="비밀번호 입력"
                                value={registerData.password}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                이메일 <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="example@email.com"
                                value={registerData.email}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                닉네임 <span className="text-rose-500">*</span>
                            </label>
                            <input
                                name="nickname"
                                required
                                placeholder="사용할 닉네임"
                                value={registerData.nickname}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. 개인 정보 */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
                        개인 정보
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                이름 <span className="text-rose-500">*</span>
                            </label>
                            <input
                                name="userName"
                                required
                                placeholder="실명 입력"
                                value={registerData.userName}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                생년월일
                            </label>
                            <input
                                type="date"
                                name="birthDate"
                                value={registerData.birthDate}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                전화번호
                            </label>
                            <input
                                name="phoneNum"
                                placeholder="010-0000-0000"
                                value={registerData.phoneNum}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* 4. 환급 / 정산 계좌 정보 */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
                        계좌 정보 <span className="text-xs font-normal text-slate-400">(정산 및 환불용)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                은행명
                            </label>
                            <input
                                name="bankName"
                                placeholder="예: 국민은행, 카카오뱅크"
                                value={registerData.bankName}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                계좌번호
                            </label>
                            <input
                                name="accountNum"
                                placeholder="'-' 없이 숫자만 입력"
                                value={registerData.accountNum}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* 제출 버튼 */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 rounded-xl bg-accent py-3.5 text-base font-bold text-white shadow-md hover:bg-emerald-400 hover:shadow-lg transition-all active:translate-y-0 disabled:opacity-50"
                >
                    {isLoading ? "가입 처리 중..." : "회원가입 완료하기"}
                </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center text-sm text-slate-500 gap-2">
                <span>이미 계정이 있으신가요?</span>
                <Link
                    to="/login"
                    className="font-semibold text-accent hover:text-emerald-500 underline underline-offset-2"
                >
                    로그인 하기
                </Link>
            </div>
        </div>
    );
}

export default RegisterForm;