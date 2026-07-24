import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";
import ProfileMenu from "../common/ProfileMenu";

function Header() {

    const token = localStorage.getItem("accessToken");

    const userRole = localStorage.getItem("userRole");

    const roleMenu = {
        USER: (
            <>
            </>
        ),

        CREATOR: (
            <>
                <Link 
                    to="/projects/create"
                    className="header-action-btn"
                >
                    프로젝트 올리기
                </Link>
            </>
        ),

        ADMIN: (
            <>
                <Link 
                    to="/admin"
                    className="header-action-btn"
                >
                    관리자 페이지
                </Link>
            </>
        )
    };

    return (
        <header className="header">
            {/* 좌측 : 로고 */}
            <div className="header_left">
                <Link to="/">
                    <img
                        src={logo}
                        alt="FundChain Logo"
                        className="header_logo"
                    />
                </Link>
            </div>
            <div className="header_search">
                {/* 검색기능란 */}
            </div>
            <div className="header_right1">
                {
                    token &&
                    roleMenu[userRole]
                }
            </div>
            <div className="header_right2">
                {
                    token
                    ?
                    <ProfileMenu />
                    :
                    (
                        <p><Link to="/login">
                            로그인/회원가입
                        </Link></p>
                    )
                }
            </div>
        </header>
    );
}

export default Header;