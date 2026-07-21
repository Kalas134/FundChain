import React, { useState } from "react";
import { register } from "../services/authService";


function RegisterForm() {

    const [registerData, setRegisterData] = useState({
        userId:"",
        userRole:"USER",
        password:"",
        nickname:"",
        username:"",
        birthDate:"",
        phoneNum:"",
        email:"",
        bankName:"",
        accountNum:""
    });

    const handleChange = (e)=>{
        const {name,value}=e.target;
        setRegisterData({
            ...registerData,
            [name]:value
        });
    };



    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            const response = await register(registerData);
            console.log("회원가입 성공", response);
            alert("회원가입 완료");
        }catch(error){
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
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    onChange={handleChange}
                />

                <input
                    name="nickname"
                    placeholder="닉네임"
                    onChange={handleChange}
                />

                <input
                    name="username"
                    placeholder="이름"
                    onChange={handleChange}
                />

                <input
                    type="date"
                    name="birthDate"
                    onChange={handleChange}
                />

                <input
                    name="phoneNum"
                    placeholder="전화번호"
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="이메일"
                    onChange={handleChange}
                />

                <h3>회원 유형</h3>
                <label>
                    <input
                        type="radio"
                        name="userRole"
                        value="USER"
                        checked={registerData.userRole==="USER"}
                        onChange={handleChange}
                    />
                    일반 사용자
                </label>

                <label>
                    <input
                        type="radio"
                        name="userRole"
                        value="CREATOR"
                        checked={registerData.userRole==="CREATOR"}
                        onChange={handleChange}
                    />
                    크리에이터
                </label>

                <input
                    name="bankName"
                    placeholder="은행명"
                    onChange={handleChange}
                />

                <input
                    name="accountNum"
                    placeholder="계좌번호"
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