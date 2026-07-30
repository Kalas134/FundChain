import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import { mockCreatorProjects } from "../../mypage/mockData";
import { getSponsoredProjects } from "../../mypage/services/myPageApi";
import { supportProject } from "../services/projectService";

function ProjectDetailPage() {
    // ============================================================
    // 1. Router Hook
    // ============================================================
    const { projectId } = useParams();
    const navigate = useNavigate();

    // ============================================================
    // 2. 프로젝트 조회 Hook
    // ============================================================
    const {
        project,
        loading,
        error,
        fetchProject
    } = useProjects();

    // ============================================================
    // 3. 페이지에서 사용하는 State
    // ============================================================
    const [mockProject, setMockProject] = useState(null);
    const [supportAmount, setSupportAmount] = useState(10000);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [hasFunded, setHasFunded] = useState(false);

    const token = localStorage.getItem("accessToken");
    const currentUserId = localStorage.getItem("userId");
    const currentUserRole = localStorage.getItem("userRole");
    const isLoggedIn = Boolean(token && currentUserId);

    useEffect(() => {
        const checkSponsoredStatus = async () => {
            if (!isLoggedIn || !projectId) {
                setHasFunded(false);
                return;
            }
            try {
                const sponsoredProjects = await getSponsoredProjects();
                if (Array.isArray(sponsoredProjects)) {
                    const funded = sponsoredProjects.some(
                        (item) => String(item.projectId ?? item.id) === String(projectId)
                    );
                    setHasFunded(funded);
                }
            } catch (err) {
                console.error("후원 내역 조회 실패:", err);
                setHasFunded(false);
            }
        };

        checkSponsoredStatus();
    }, [projectId, isLoggedIn]);

    // ============================================================
    // 4. 프로젝트 상세 조회
    // ============================================================
    useEffect(() => {
        const foundMockProject = mockCreatorProjects.find(
            (item) => String(item.projectId ?? item.id) === String(projectId)
        );

        if (foundMockProject) {
            const mockProjectId = foundMockProject.projectId ?? foundMockProject.id;
            setMockProject({
                projectId: mockProjectId,
                creatorId: foundMockProject.creatorId || "mock-creator",
                title: foundMockProject.title || "",
                thumbnailImage: foundMockProject.imageUrl || foundMockProject.thumbnailImage || "",
                targetAmount: foundMockProject.targetAmount || 0,
                currentAmount: foundMockProject.currentAmount || 0,
                description: foundMockProject.description || "",
                startDate: `${foundMockProject.year}-${String(foundMockProject.month).padStart(2, "0")}-01T00:00:00+09:00`,
                endDate: `${foundMockProject.year}-${String(foundMockProject.month).padStart(2, "0")}-30T23:59:59+09:00`,
                status: foundMockProject.status,
                contentHtml: `<p>${foundMockProject.description || ""}</p>`
            });
            return;
        }

        setMockProject(null);
        if (projectId) {
            fetchProject(projectId);
        }
    }, [projectId, fetchProject]);

    // ============================================================
    // 5. 실제 화면에 사용할 프로젝트
    // ============================================================
    const displayProject = mockProject || project;

    // ============================================================
    // 6. Loading
    // ============================================================
    if (loading && !mockProject) {
        return (
            <div className="min-h-[calc(100vh-140px)] w-full bg-bg font-sans">
                <main className="w-full max-w-[1080px] mx-auto px-6 py-20 flex justify-center items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 border-3 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 text-base font-medium">
                            프로젝트 정보를 불러오는 중입니다...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    // ============================================================
    // 7. Error
    // ============================================================
    if (error && !mockProject) {
        return (
            <div className="min-h-[calc(100vh-140px)] w-full bg-bg font-sans">
                <main className="w-full max-w-[1080px] mx-auto px-6 py-20 flex flex-col justify-center items-center">
                    <p className="text-rose-500 font-semibold text-lg mb-4">{error}</p>
                    <button
                        onClick={() => navigate("/projects")}
                        className="px-4 py-2.5 bg-funding text-white text-sm font-semibold rounded-xl shadow hover:bg-indigo-600 transition-all cursor-pointer"
                    >
                        프로젝트 목록으로 돌아가기
                    </button>
                </main>
            </div>
        );
    }

    // ============================================================
    // 8. 프로젝트가 없는 경우
    // ============================================================
    if (!displayProject) {
        return (
            <div className="min-h-[calc(100vh-140px)] w-full bg-bg font-sans">
                <main className="w-full max-w-[1080px] mx-auto px-6 py-20 flex flex-col justify-center items-center">
                    <p className="text-slate-600 font-medium text-lg mb-4">프로젝트가 존재하지 않습니다.</p>
                    <button
                        onClick={() => navigate("/projects")}
                        className="px-4 py-2.5 bg-funding text-white text-sm font-semibold rounded-xl shadow hover:bg-indigo-600 transition-all cursor-pointer"
                    >
                        프로젝트 목록으로 돌아가기
                    </button>
                </main>
            </div>
        );
    }

    // ============================================================
    // 9. 날짜 처리
    // ============================================================
    const startDate = new Date(displayProject.startDate);
    const endDate = new Date(displayProject.endDate);
    const today = new Date();

    // ============================================================
    // 10. 프로젝트 상태 설정
    // ============================================================
    const STATUS_CONFIG = {
        PREPARING: {
            label: "준비중",
            badgeClass: "bg-amber-100 text-amber-800 border-amber-300"
        },
        ONGOING: {
            label: "진행중",
            badgeClass: "bg-blue-100 text-blue-800 border-blue-300"
        },
        SUCCESS: {
            label: "성공",
            badgeClass: "bg-accent/15 text-accent font-bold border-accent/40"
        },
        FAILED: {
            label: "실패",
            badgeClass: "bg-warning/15 text-warning font-bold border-warning/40"
        }
    };

    const statusInfo = STATUS_CONFIG[displayProject.status] || {
        label: "상태 확인중",
        badgeClass: "bg-gray-100 text-gray-700 border-gray-300"
    };

    // ============================================================
    // 11. 날짜 및 크리에이터 / 후원 이력 기준 마감/펀딩 불가 여부
    // ============================================================
    const isEnded = today > endDate;

    const isCreatorUser = isLoggedIn && (
        currentUserRole === "CREATOR" || Boolean(
            currentUserId &&
            displayProject?.creatorId &&
            String(displayProject.creatorId) === String(currentUserId)
        )
    );

    // ============================================================
    // 12. 후원 달성률 및 금액 계산
    // ============================================================
    const targetAmount = Number(displayProject?.targetAmount || 0);
    const currentAmount = Number(displayProject?.currentAmount || 0);
    const achievementRate =
        targetAmount > 0
            ? Math.round((currentAmount / targetAmount) * 100)
            : 0;

    // ============================================================
    // 13. 후원 처리
    // ============================================================
    const handleFundingButtonClick = () => {
        if (!isLoggedIn) {
            alert("회원만 펀딩할 수 있습니다.");
            return;
        }
        setShowSupportModal(true);
    };

    const handleSupportSubmit = async () => {
        if (!isLoggedIn) {
            alert("회원만 펀딩할 수 있습니다.");
            setShowSupportModal(false);
            return;
        }
        if (!supportAmount || supportAmount <= 0) {
            alert("유효한 후원 금액을 입력해 주세요.");
            return;
        }
        try {
            setSubmitting(true);
            await supportProject(displayProject.projectId, supportAmount);
            alert("후원이 성공적으로 완료되었습니다!");
            setShowSupportModal(false);
            navigate("/sponsoredprojects");
        } catch (err) {
            console.error("후원 요청 실패:", err);
            alert(
                err.response?.data?.message ||
                err.message ||
                "후원 처리 중 오류가 발생했습니다."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ============================================================
    // 14. 화면
    // ============================================================
    return (
        <div className="min-h-[calc(100vh-140px)] w-full bg-bg font-sans">
            <main className="w-full max-w-[1080px] mx-auto px-4 sm:px-6 py-8">
                {/* 헤더 네비게이션 영역 */}
                <div className="mb-6 text-left flex items-center justify-between">
                    <span className="inline-block text-xs font-bold tracking-widest text-accent uppercase">
                        PROJECT DETAIL
                    </span>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        목록으로 돌아가기
                    </button>
                </div>

                {/* 상단 2열 그리드 레이아웃 (썸네일 이미지 & 주요 정보 카드) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* 프로젝트 이미지 영역 */}
                    <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm overflow-hidden">
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                            {displayProject.thumbnailImage ? (
                                <img
                                    src={displayProject.thumbnailImage}
                                    alt={displayProject.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-slate-400 text-sm font-medium">
                                    이미지가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 프로젝트 기본 정보 & 펀딩 액션 카드 */}
                    <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col space-y-5 text-left">
                        {/* 상태 배지 & 작성자 */}
                        <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}>
                                {statusInfo.label}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                작성자 <strong className="text-slate-700 font-semibold">{displayProject.creatorId}</strong>
                            </span>
                        </div>

                        {/* 프로젝트 제목 */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                            {displayProject.title}
                        </h1>

                        {/* 후원 금액 및 바형 인디케이터 */}
                        <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 space-y-3">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-xs text-slate-500 block mb-1 font-medium">현재 모금액</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-bold text-slate-900">
                                            {currentAmount.toLocaleString("ko-KR")}원
                                        </span>
                                        <span className="text-accent font-extrabold text-base">
                                            ({achievementRate}%)
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-400 font-medium block mb-1">목표 금액</span>
                                    <span className="text-sm font-semibold text-slate-600">
                                        {targetAmount.toLocaleString("ko-KR")}원
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        displayProject.status === "FAILED" ? "bg-warning" : "bg-accent"
                                    }`}
                                    style={{ width: `${Math.min(achievementRate, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* 펀딩 기간 정보 */}
                        <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
                            <div>
                                <span className="text-slate-400 block mb-1 font-medium">펀딩 시작</span>
                                <strong className="text-sm font-semibold text-slate-800">
                                    {startDate.toLocaleDateString("ko-KR")}
                                </strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block mb-1 font-medium">펀딩 종료</span>
                                <strong className="text-sm font-semibold text-slate-800">
                                    {endDate.toLocaleDateString("ko-KR")}
                                </strong>
                            </div>
                        </div>

                        {/* 펀딩하기 버튼 */}
                        <button
                            className="w-full rounded-xl bg-funding py-3.5 text-base font-bold text-white shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            disabled={
                                displayProject.status !== "ONGOING" ||
                                isEnded ||
                                isCreatorUser ||
                                hasFunded
                            }
                            title={
                                isCreatorUser
                                    ? "크리에이터 회원은 후원을 할 수 없습니다."
                                    : hasFunded
                                        ? "이미 펀딩한 프로젝트 입니다"
                                        : ""
                            }
                            onClick={handleFundingButtonClick}
                        >
                            {
                                isCreatorUser
                                    ? "크리에이터 회원은 후원을 할 수 없습니다."
                                    : displayProject.status === "PREPARING"
                                        ? "준비중인 프로젝트"
                                        : displayProject.status === "SUCCESS"
                                            ? "성공한 프로젝트"
                                            : displayProject.status === "FAILED"
                                                ? "실패한 프로젝트"
                                                : isEnded
                                                    ? "마감된 프로젝트"
                                                    : hasFunded
                                                        ? "이미 펀딩한 프로젝트 입니다"
                                                        : "펀딩하기"
                            }
                        </button>
                    </div>
                </div>

                {/* 후원 금액 입력 모달 */}
                {showSupportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                        <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-left border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                프로젝트 후원하기
                            </h3>
                            <p className="text-xs text-slate-500 mb-4 line-clamp-1">
                                {displayProject.title}
                            </p>

                            {/* 후원 금액 입력 */}
                            <div className="mb-5">
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    후원 금액 (원)
                                </label>
                                <input
                                    type="number"
                                    value={supportAmount}
                                    onChange={(e) => setSupportAmount(Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-funding focus:outline-none focus:ring-2 focus:ring-funding/20 transition-all"
                                    placeholder="금액 입력"
                                    step="1000"
                                    min="1000"
                                />
                            </div>

                            {/* 모달 버튼 */}
                            <div className="flex justify-end gap-2.5 pt-2">
                                <button
                                    onClick={() => setShowSupportModal(false)}
                                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                    disabled={submitting}
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSupportSubmit}
                                    className="px-4 py-2 bg-funding text-white rounded-xl text-xs font-semibold hover:bg-indigo-600 transition-colors cursor-pointer disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    {submitting ? "처리 중..." : "후원 결제"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 프로젝트 상세 설명 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm mt-8 text-left">
                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-4 mb-6">
                        프로젝트 소개
                    </h2>
                    <div
                        className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{
                            __html: displayProject.contentHtml || ""
                        }}
                    />
                </div>
            </main>
        </div>
    );
}

export default ProjectDetailPage;