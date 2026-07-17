import React from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
    return (
        <div className="loginPage">
            <div className="loginBox">
                <form>
                    <h2>로그인</h2>
                    <div className="loginId">
                        ID{" : "}<input
                            type="text" /* value={User.Id} onChange={(e) => setValue(e.target.value)} */ placeholder="아이디 입력"
                        />
                    </div>
                    <div className="loginPw">
                        Password{" : "}<input
                        type="text" /* value={User.Pw} onChange={(e) => setValue(e.target.value)} */placeholder="비밀번호 입력"
                    />
                    </div>
                </form>
                <div className="registryAndPwUpdate">
                    <Link to="/Resistry">회원가입</Link>{" | "}
                    <Link to="PwUpdate">비밀번호 수정</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;