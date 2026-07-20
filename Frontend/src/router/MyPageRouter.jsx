import { Route } from "react-router-dom";
import Mypage from "../features/mypage/MyPage";
import SponsoredProjectsPage from "../features/mypage/SponsoredProjectsPage";
import TransactionHistoryPage from "../features/mypage/TransactionHistoryPage";

const MyPageRouter = (
    <>
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/sponsoredprojects" element={<SponsoredProjectsPage />} />
        <Route path="/transactionhistory" element={<TransactionHistoryPage />} />
    </>
)

export default MyPageRouter;