import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";

function Header() {
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
                <Link>{/* 프로젝트 올리는 링크 */}</Link>
            </div>
            <div className="header_right2">
                <Link to="/login">로그인/회원가입</Link>
            </div>
        </header>
    );
}

export default Header;