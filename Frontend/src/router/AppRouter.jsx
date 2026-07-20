import { Routes, Route } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Common_UIRouter from "./Common_UIRouter";
import AuthRouter from "./AuthRouter";
import MyPageRouter from "./MyPageRouter";
// import ProjectRouter from "./ProjectRouter";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />} >
                {Common_UIRouter}
                {AuthRouter}
                {MyPageRouter}
                {/* {ProjectRouter} */}
            </Route>
        </Routes>
    );
}

export default AppRouter;