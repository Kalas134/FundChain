import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { login } from "../services/authService";

function LoginForm() {

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await login(loginData);
            console.log("로그인 성공 : ", response);

            const token = response.token || response.accessToken;
            if (token) {
                localStorage.setItem("accessToken", token);
            }
            if (response.userRole) {
                localStorage.setItem("userRole", response.userRole);
            }
            if (response.userId) {
                localStorage.setItem("userId", response.userId);
            }

            alert("로그인되었습니다.");
            window.location.href = "/";
        } catch (error) {
            console.error("로그인 실패 : ", error);
            alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-left">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-thcolor">로그인</h2>
                <p className="mt-1 text-sm text-slate-500">
                    FundChain 서비스 이용을 위해 로그인해주세요.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        이메일 주소
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={loginData.email}
                        onChange={handleChange}
                        placeholder="example@fundchain.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        비밀번호
                    </label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={loginData.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 rounded-xl bg-accent py-3.5 text-base font-bold text-white shadow-md hover:bg-emerald-400 hover:shadow-lg transition-all active:translate-y-0 disabled:opacity-50"
                >
                    {isLoading ? "로그인 중..." : "로그인"}
                </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center text-sm text-slate-500 gap-2">
                <span>아직 계정이 없으신가요?</span>
                <Link
                    to="/RegisterPage"
                    className="font-semibold text-accent hover:text-emerald-500 underline underline-offset-2"
                >
                    회원가입
                </Link>
            </div>
        </div>
    );
}

export default LoginForm;