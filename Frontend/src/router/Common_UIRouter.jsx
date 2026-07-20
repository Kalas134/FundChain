import { Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import AuthRouter from "./AuthRouter";

const Common_UIRouter = (
    <>
         <Route path="/" element={<HomePage />} />
        <Route path="/AboutPage" element={<AboutPage />} />
    </>
)

export default Common_UIRouter;