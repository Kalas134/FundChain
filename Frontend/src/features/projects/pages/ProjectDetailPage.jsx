import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import "../../../styles/frame.css";
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
    // 3. 페이지에서 사용하는 모든 State
    //
    // 중요:
    // 모든 Hook은 조건부 return보다 위에서 항상 동일한 순서로
    // 호출되어야 한다.
    // ============================================================
    const [mockProject, setMockProject] = useState(null);
    const [supportAmount, setSupportAmount] = useState(10000);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [hasFunded, setHasFunded] = useState(false);

    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        const checkSponsoredStatus = async () => {
            if (!currentUserId || !projectId) {
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
    }, [projectId, currentUserId]);

    // ============================================================
    // 4. 프로젝트 상세 조회
    //
    // - 목업 프로젝트라면 mockCreatorProjects에서 조회
    // - 실제 DB 프로젝트라면 GET /api/projects/{projectId}
    // ============================================================
    useEffect(() => {
        // --------------------------------------------------------
        // 목업 프로젝트 검색
        //
        // mockCreatorProjects의 실제 식별자가
        // id 또는 projectId인 경우 모두 대응
        // --------------------------------------------------------
        const foundMockProject = mockCreatorProjects.find(
            (item) => {
                const itemProjectId =
                    item.projectId ?? item.id;

                return String(item.projectId) === String(projectId);
            }
        );
        // --------------------------------------------------------
        // 목업 프로젝트인 경우
        // --------------------------------------------------------
        if (foundMockProject) {
            const mockProjectId =
                foundMockProject.projectId ??
                foundMockProject.id;
            setMockProject({
                projectId: mockProjectId,
                creatorId:
                    foundMockProject.creatorId ||
                    "mock-creator",
                title:
                    foundMockProject.title || "",
                thumbnailImage:
                    foundMockProject.imageUrl ||
                    foundMockProject.thumbnailImage ||
                    "",
                targetAmount:
                    foundMockProject.targetAmount || 0,
                description:
                    foundMockProject.description || "",
                startDate:
                    `${foundMockProject.year}-${String(
                        foundMockProject.month
                    ).padStart(2, "0")}-01T00:00:00+09:00`,
                endDate:
                    `${foundMockProject.year}-${String(
                        foundMockProject.month
                    ).padStart(2, "0")}-30T23:59:59+09:00`,
                status:
                    foundMockProject.status,
                contentHtml:
                    `<p>${foundMockProject.description || ""}</p>`
            });
            return;
        }
        // --------------------------------------------------------
        // 실제 DB 프로젝트인 경우
        // --------------------------------------------------------
        setMockProject(null);
        if (projectId) {
            fetchProject(projectId);
        }
    }, [projectId, fetchProject]);
    // ============================================================
    // 5. 실제 화면에 사용할 프로젝트
    //
    // 목업 프로젝트가 있으면 mockProject
    // 없으면 DB 조회 결과 project
    // ============================================================
    const displayProject =
        mockProject || project;
    // ============================================================
    // 6. Loading
    //
    // Hook들은 이미 모두 호출된 이후이므로
    // 여기서 return해도 Hook 순서 문제가 발생하지 않는다.
    // ============================================================
    if (loading && !mockProject) {

        return (
            <div className="ProjectDetailPage">

                <div className="ProjectDetailLoading">
                    프로젝트 정보를 불러오는 중입니다...
                </div>

            </div>
        );
    }
    // ============================================================
    // 7. Error
    // ============================================================
    if (error && !mockProject) {

        return (
            <div className="ProjectDetailPage">

                <div className="ProjectDetailError">
                    {error}
                </div>

            </div>
        );
    }
    // ============================================================
    // 8. 프로젝트가 없는 경우
    // ============================================================
    if (!displayProject) {

        return (
            <div className="ProjectDetailPage">

                <div className="ProjectDetailError">
                    프로젝트가 존재하지 않습니다.
                </div>

            </div>
        );
    }
    // ============================================================
    // 9. 날짜 처리
    // ============================================================
    const startDate =
        new Date(displayProject.startDate);

    const endDate =
        new Date(displayProject.endDate);

    const today =
        new Date();
    // ============================================================
    // 10. 프로젝트 상태 설정
    // ============================================================
    const STATUS_CONFIG = {
        PREPARING: {
            label: "준비중",
            className: "status-preparing"
        },
        ONGOING: {
            label: "진행중",
            className: "status-ongoing"
        },
        SUCCESS: {
            label: "성공",
            className: "status-success"
        },
        FAILED: {
            label: "실패",
            className: "status-failed"
        }
    };
    const statusInfo =
        STATUS_CONFIG[displayProject.status] || {
            label: "상태 확인중",
            className: "status-unknown"
        };
    // ============================================================
    // 11. 날짜 및 크리에이터 / 후원 이력 기준 마감/펀딩 불가 여부
    // ============================================================
    const isEnded =
        today > endDate;

    const isCreator = Boolean(
        currentUserId &&
        displayProject?.creatorId &&
        String(displayProject.creatorId) === String(currentUserId)
    );
    // ============================================================
    // 12. 후원 처리
    // ============================================================
    const handleSupportSubmit = async () => {
        if (
            !supportAmount ||
            supportAmount <= 0
        ) {
            alert(
                "유효한 후원 금액을 입력해 주세요."
            );
            return;
        }
        try {
            setSubmitting(true);
            await supportProject(
                displayProject.projectId,
                supportAmount
            );
            alert(
                "후원이 성공적으로 완료되었습니다!"
            );
            setShowSupportModal(false);
            // 후원 완료 후 후원 프로젝트 목록으로 이동
            navigate("/sponsoredprojects");
        } catch (err) {
            console.error(
                "후원 요청 실패:",
                err
            );
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
    // 13. 화면
    // ============================================================
    return (
        <div className="ProjectDetailPage">
            <div className="ProjectDetailContainer">
                {/* ==================================================
                    프로젝트 이미지
                ================================================== */}
                <div className="ProjectDetailImageBox">
                    {displayProject.thumbnailImage ? (
                        <img
                            src={displayProject.thumbnailImage}
                            alt={displayProject.title}
                            className="ProjectDetailImage"
                        />
                    ) : (
                        <div className="ProjectDetailNoImage">
                            이미지가 없습니다.
                        </div>
                    )}
                </div>
                {/* ==================================================
                    프로젝트 기본 정보
                ================================================== */}
                <section className="ProjectDetailInfo">
                    {/* 프로젝트 상태 */}
                    <div
                        className={
                            `ProjectDetailStatus ${statusInfo.className}`
                        }
                    >
                        {statusInfo.label}
                    </div>
                    {/* 프로젝트 제목 */}
                    <h1 className="ProjectDetailTitle">
                        {displayProject.title}
                    </h1>
                    {/* 작성자 */}
                    <div className="ProjectDetailCreator">
                        작성자&nbsp;
                        {displayProject.creatorId}
                    </div>
                    {/* 목표 금액 */}
                    <div className="ProjectDetailAmount">
                        <span>
                            목표 금액
                        </span>
                        <strong>
                            {Number(
                                displayProject.targetAmount
                            ).toLocaleString("ko-KR")}
                            원
                        </strong>
                    </div>
                    {/* 펀딩 기간 */}
                    <div className="ProjectDetailDate">
                        <div>
                            <span>
                                펀딩 시작
                            </span>
                            <strong>
                                {startDate.toLocaleDateString(
                                    "ko-KR"
                                )}
                            </strong>
                        </div>
                        <div>
                            <span>
                                펀딩 종료
                            </span>
                            <strong>
                                {endDate.toLocaleDateString(
                                    "ko-KR"
                                )}
                            </strong>
                        </div>
                    </div>
                    {/* ==================================================
                        펀딩하기 버튼
                    ================================================== */}
                    <button
                        className="ProjectDetailFundingBtn"

                        disabled={
                            displayProject.status !== "ONGOING" ||
                            isEnded ||
                            isCreator ||
                            hasFunded
                        }

                        title={
                            isCreator
                                ? "자신의 프로젝트는 펀딩할 수 없습니다"
                                : hasFunded
                                    ? "이미 펀딩한 프로젝트 입니다"
                                    : ""
                        }

                        onClick={() =>
                            setShowSupportModal(true)
                        }
                    >
                        {
                            displayProject.status === "PREPARING"
                                ? "준비중인 프로젝트"

                                : displayProject.status === "SUCCESS"
                                    ? "성공한 프로젝트"

                                    : displayProject.status === "FAILED"
                                        ? "실패한 프로젝트"

                                        : isEnded
                                            ? "마감된 프로젝트"

                                            : isCreator
                                                ? "자신의 프로젝트는 펀딩할 수 없습니다"

                                                : hasFunded
                                                    ? "이미 펀딩한 프로젝트 입니다"

                                                    : "펀딩하기"
                        }
                    </button>
                </section>
                {/* ==================================================
                    후원 금액 입력 모달
                ================================================== */}
                {showSupportModal && (
                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/50
                            backdrop-blur-xs
                            p-4
                        "
                    >
                        <div
                            className="
                                bg-white
                                w-full
                                max-w-sm
                                rounded-2xl
                                shadow-xl
                                p-6
                                text-left
                                border
                                border-gray-200
                            "
                        >
                            <h3
                                className="
                                    text-lg
                                    font-bold
                                    text-gray-900
                                    mb-2
                                "
                            >
                                프로젝트 후원하기
                            </h3>
                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                    mb-4
                                "
                            >
                                {displayProject.title}
                            </p>
                            {/* 후원 금액 */}
                            <div className="mb-4">
                                <label
                                    className="
                                        block
                                        text-xs
                                        font-semibold
                                        text-gray-700
                                        mb-1
                                    "
                                >
                                    후원 금액 (원)
                                </label>
                                <input
                                    type="number"

                                    value={supportAmount}

                                    onChange={(e) =>
                                        setSupportAmount(
                                            Number(e.target.value)
                                        )
                                    }
                                    className="
                                        w-full
                                        px-3
                                        py-2
                                        border
                                        border-gray-300
                                        rounded-lg
                                        text-sm
                                        focus:outline-none
                                        focus:border-slate-800
                                    "

                                    placeholder="금액 입력"

                                    step="1000"

                                    min="1000"
                                />
                            </div>
                            {/* 모달 버튼 */}
                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-2
                                    pt-2
                                "
                            >
                                {/* 취소 */}
                                <button
                                    onClick={() =>
                                        setShowSupportModal(false)
                                    }
                                    className="
                                        px-4
                                        py-2
                                        border
                                        border-gray-300
                                        rounded-lg
                                        text-xs
                                        font-semibold
                                        text-gray-700
                                        hover:bg-gray-50
                                    "
                                    disabled={submitting}
                                >
                                    취소
                                </button>
                                {/* 결제 */}
                                <button
                                    onClick={
                                        handleSupportSubmit
                                    }
                                    className="
                                        px-4
                                        py-2
                                        bg-slate-900
                                        text-white
                                        rounded-lg
                                        text-xs
                                        font-semibold
                                        hover:bg-slate-800
                                    "
                                    disabled={submitting}
                                >
                                    {
                                        submitting
                                            ? "처리 중..."
                                            : "후원 결제"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* ==================================================
                    프로젝트 설명
                ================================================== */}
                <section className="ProjectDetailContent">
                    <h2>
                        프로젝트 소개
                    </h2>
                    <div
                        className="ProjectDetailContentBody"
                        dangerouslySetInnerHTML={{
                            __html:
                                displayProject.contentHtml ||
                                ""
                        }}
                    />
                </section>
            </div>
        </div>
    );
}
export default ProjectDetailPage;