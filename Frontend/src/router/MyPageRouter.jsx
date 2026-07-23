import { Route } from "react-router-dom";
import Mypage from "../features/mypage/MyPage";
import SponsoredProjectsPage from "../features/mypage/SponsoredProjectsPage";
import TransactionHistoryPage from "../features/mypage/TransactionHistoryPage";
import CreatorProjectsPage from "../features/mypage/CreatorProjectsPage";
import SettlementHistoryPage from "../features/mypage/SettlementHistoryPage";

const MyPageRouter = (
    <>
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/sponsoredprojects" element={<SponsoredProjectsPage />} />
        <Route path="/myprojects" element={<CreatorProjectsPage />} />
        <Route path="/createdprojects" element={<CreatorProjectsPage />} />
        <Route path="/transactionhistory" element={<TransactionHistoryPage />} />
        <Route path="/settlement" element={<SettlementHistoryPage />} />
    </>
)

export default MyPageRouter;