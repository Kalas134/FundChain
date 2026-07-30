import { Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import CustomerSupportPage from "../pages/CustomerSupportPage";
import LiveChainPage from "../pages/LiveChainPage";
import LuckyDrawPage from "../pages/LuckyDrawPage";
import ProjectProposalPage from "../pages/ProjectProposalPage";

const Common_UIRouter = (
    <>
        <Route path="/" element={<HomePage />} />
        <Route path="/AboutPage" element={<AboutPage />} />
        <Route path="/support" element={<CustomerSupportPage />} />
        <Route path="/live-chain" element={<LiveChainPage />} />
        <Route path="/lucky-draw" element={<LuckyDrawPage />} />
        <Route path="/proposals" element={<ProjectProposalPage />} />
    </>
)


export default Common_UIRouter;