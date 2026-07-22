import React, { useState } from "react";
import { register } from "../services/authService";


function RegisterForm() {

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


    const handleChange = (e) => {
        const { name, value } = e.target;

        setRegisterData({
            ...registerData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("전송 데이터: ", registerData);

        try {

            const response = await register(registerData);

            console.log("회원가입 성공", response);

            alert("회원가입 완료");

        } catch (error) {

            console.error(error);

            alert("회원가입 실패");
        }
    };


    return (
        <div className="registerBox">

            <form onSubmit={handleSubmit}>

                <h2>회원가입</h2>


                <input
                    name="userId"
                    placeholder="아이디"
                    value={registerData.userId}
                    onChange={handleChange}
                />


                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={registerData.password}
                    onChange={handleChange}
                />


                <input
                    name="nickname"
                    placeholder="닉네임"
                    value={registerData.nickname}
                    onChange={handleChange}
                />


                <input
                    name="userName"
                    placeholder="이름"
                    value={registerData.userName}
                    onChange={handleChange}
                />


                <input
                    type="date"
                    name="birthDate"
                    value={registerData.birthDate}
                    onChange={handleChange}
                />


                <input
                    name="phoneNum"
                    placeholder="전화번호"
                    value={registerData.phoneNum}
                    onChange={handleChange}
                />


                <input
                    name="email"
                    placeholder="이메일"
                    value={registerData.email}
                    onChange={handleChange}
                />


                <h3>회원 유형</h3>


                <label>
                    <input
                        type="radio"
                        name="userRole"
                        value="USER"
                        checked={registerData.userRole === "USER"}
                        onChange={handleChange}
                    />
                    일반 사용자
                </label>


                <label>
                    <input
                        type="radio"
                        name="userRole"
                        value="CREATOR"
                        checked={registerData.userRole === "CREATOR"}
                        onChange={handleChange}
                    />
                    크리에이터
                </label>



                <input
                    name="bankName"
                    placeholder="은행명"
                    value={registerData.bankName}
                    onChange={handleChange}
                />


                <input
                    name="accountNum"
                    placeholder="계좌번호"
                    value={registerData.accountNum}
                    onChange={handleChange}
                />


                <button type="submit">
                    가입하기
                </button>

            </form>

        </div>
    );
}


export default RegisterForm;