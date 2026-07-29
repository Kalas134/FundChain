import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Navigation from "./Navigation";
import { Outlet, useLocation } from "react-router-dom";

function AppLayout() {
    const location = useLocation();
    const isDarkTheme = location.pathname === "/live-chain";

    useEffect(() => {
        if (isDarkTheme) {
            document.body.setAttribute("data-theme", "dark");
        } else {
            document.body.removeAttribute("data-theme");
        }
        return () => {
            document.body.removeAttribute("data-theme");
        };
    }, [isDarkTheme]);

    return (
        <div className={`app-layout-wrapper ${isDarkTheme ? 'dark-theme' : ''}`}>
            <Header />
            <Navigation />
            <main className="main-content-area">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default AppLayout;