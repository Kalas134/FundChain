import React from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
    return (
        <nav className="navigation">
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
        </nav>
    );
}

export default Navigation;