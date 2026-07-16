import Header from "./Header";
import Footer from "./Footer";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";

function AppLayout() {
    return (
        <>
            <Header />
            <Navigation />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default AppLayout;