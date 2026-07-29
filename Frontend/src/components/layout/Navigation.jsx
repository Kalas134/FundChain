import React from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
    return (
        <nav className="navigation">
            <div className="navigation-container">
                <NavLink
                    to="/"
                    className="navigation-link"
                >
                    홈
                </NavLink>
                <NavLink
                    to="/AboutPage"
                    className="navigation-link"
                >
                    소개
                </NavLink>
                <NavLink
                    to="/projects"
                    className="navigation-link"
                >
                    프로젝트
                </NavLink>
                <NavLink
                    to="/live-chain"
                    className="navigation-link inline-flex items-center gap-1.5"
                >
                    <span>실시간 체인</span>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                </NavLink>
            </div>
        </nav>

    );
}

export default Navigation;