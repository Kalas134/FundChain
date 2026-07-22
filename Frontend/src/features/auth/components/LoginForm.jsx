import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { login } from "../services/authService";

function LoginForm() {

    const [loginData, setLoginData] = useState({
        email: "",
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

            console.log("로그인 성공 : ", response);

            /*
            JWT 적용 이후 처리 예정

            localStorage.setItem(
                "accessToken",
                response.accessToken
            );

            */

            alert("로그인 성공");

        } catch (error) {

            console.error("로그인 실패 : ", error);

            alert("로그인 실패");
        }
    };


    return (
        <div className="loginBox">

            <form onSubmit={handleSubmit}>

                <h2>로그인</h2>


                <div className="loginEmail">

                    Email :

                    <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleChange}
                        placeholder="이메일 입력"
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

                <Link to="/RegisterPage">
                    회원가입
                </Link>

                {" | "}

                {/* 
                <Link to="/PwUpdate">
                    비밀번호 수정
                </Link> 
                */}

            </div>


        </div>
    );
}


export default LoginForm;