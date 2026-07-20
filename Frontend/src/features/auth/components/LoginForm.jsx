import React from 'react';
import LoginPage from '../pages/LoginPage';

function LoginForm() {
    return (
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
                <div className="UserRule">
                    일반 사용자{" : "}<input
                    type="radio" name="UserRule" value="User" />
                    크리에이터{" : "}<input
                    type="radio" name="UserRule" value="Creator" />
                </div>
            </form>
            <div className="registryAndPwUpdate">
                <Link to="/Resistry">회원가입</Link>{" | "}
                {/* <Link to="/PwUpdate">비밀번호 수정</Link> */}
            </div>
        </div>
    );
}

export default LoginForm;