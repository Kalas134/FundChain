import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { login } from "../services/authService";

function LoginForm() {

    const [loginData, setLoginData] = useState({
        userId: "",
        password: ""
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setLoginData({
            ...loginData,
            [name]: value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await login(loginData);

            console.log("로그인 성공: ", response);

        } catch (error) {

            console.error("로그인 실패, error");
        }
    };

    return (
        <div className="loginBox">
            <form onSubmit={handleSubmit}>
                <h2>로그인</h2>
                <div className="loginId">
                    ID :
                    <input
                        type="text"
                        name="userId"
                        value={loginData.userId}
                        onChange={handleChange}
                        placeholder="아이디 입력"
                    />
                </div>

                <div className="loginPw">
                    Password :
                    <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="비밀번호 입력"
                />
                </div>

                <button type="submit">
                    로그인
                </button>
            </form>
            <div className="registryAndPwUpdate">
                <Link to="/RegisterPage">회원가입</Link>{" | "}
                {/* <Link to="/PwUpdate">비밀번호 수정</Link> */}
            </div>
        </div>
    );
}

export default LoginForm;