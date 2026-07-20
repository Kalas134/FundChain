import { Routes, Route } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Common_UIRouter from "./Common_UIRouter";
import AuthRouter from "./AuthRouter";
// import ProjectRouter from "./ProjectRouter";
// import MyPageRouter from "./MyPageRouter";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />} >
                {Common_UIRouter}
                {AuthRouter}
                {/* {ProjectRouter} */}
                {/* {MyPageRouter} */}
            </Route>
        </Routes>
    );
}

export default AppRouter;