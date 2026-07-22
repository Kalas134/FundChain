import { Route } from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";

const AuthRouter = (
    <>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
    </>
)

export default AuthRouter;