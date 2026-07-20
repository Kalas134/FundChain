import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <div className="navigation">
            <h2><Link to={"/"}>홈</Link>{" | "}
            <Link to={"/AboutPage"}>소개</Link>{" | "}
            <Link to={"#"}>프로젝트</Link>{" | "}</h2>
        </div>
    );
}

export default Navigation;