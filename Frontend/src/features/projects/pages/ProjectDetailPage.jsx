import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useProjects from "../hooks/useProjects";
import "../../../styles/frame.css";
import { mockCreatorProjects } from "../../mypage/mockData";
import { supportProject } from "../../mypage/services/myPageApi";


function ProjectDetailPage() {

    const { projectId } = useParams();

    // 추가: 목업 프로젝트 상세 데이터를 저장하기 위한 state
    const [mockProject, setMockProject] = useState(null);


    const {
        project,
        loading,
        error,
        fetchProject
    } = useProjects();


    useEffect(() => {

        // ============================================================
        // 추가: 현재 projectId가 목업 프로젝트인지 먼저 확인
        //
        // ProjectListPage에서 목업 프로젝트의 projectId는
        // mockCreatorProjects의 id 값을 그대로 사용하고 있음
        //
        // 예:
        // id: 101 → /projects/101
        // id: 102 → /projects/102
        // ============================================================
        const foundMockProject = mockCreatorProjects.find(
            (item) =>
                String(item.id) === String(projectId)
        );


        // ============================================================
        // 추가: 목업 프로젝트라면 DB 조회를 하지 않고
        // 목업 데이터를 ProjectResponse 형태로 변환
        // ============================================================
        if (foundMockProject) {

            setMockProject({
                projectId: foundMockProject.id,
                creatorId: "mock-creator",
                title: foundMockProject.title,
                thumbnailImage: foundMockProject.imageUrl,
                targetAmount: foundMockProject.targetAmount,

                // 추가: 프로젝트 설명
                description: foundMockProject.description,

                // 목업의 year/month를 이용해 날짜 형태를 만들어준다.
                startDate:
                    `${foundMockProject.year}-${String(
                        foundMockProject.month
                    ).padStart(2, "0")}-01T00:00:00+09:00`,

                endDate:
                    `${foundMockProject.year}-${String(
                        foundMockProject.month
                    ).padStart(2, "0")}-30T23:59:59+09:00`,

                status: foundMockProject.status,

                // 목업의 description을 상세 내용처럼 사용
                contentHtml:
                    `<p>${foundMockProject.description}</p>`
            });

            return;
        }


        // ============================================================
        // 추가: 일반 DB 프로젝트인 경우
        // 기존 방식 그대로 DB에서 상세 프로젝트 조회
        // ============================================================
        setMockProject(null);
        fetchProject(projectId);

    }, [projectId, fetchProject]);


    // ============================================================
    // 추가:
    //
    // 목업 프로젝트가 존재하면 mockProject를 사용하고,
    // 그렇지 않으면 기존 DB 조회 결과인 project를 사용
    //
    // 따라서 아래쪽 JSX는 기존 코드를 거의 수정하지 않아도 됨
    // ============================================================
    const displayProject =
        mockProject || project;


    if (loading && !mockProject) {
        return (
            <div className="ProjectDetailPage">
                <div className="ProjectDetailLoading">
                    프로젝트 정보를 불러오는 중입니다...
                </div>
            </div>
        );
    }


    if (error && !mockProject) {
        return (
            <div className="ProjectDetailPage">
                <div className="ProjectDetailError">
                    {error}
                </div>
            </div>
        );
    }


    if (!displayProject) {
        return (
            <div className="ProjectDetailPage">
                <div className="ProjectDetailError">
                    프로젝트가 존재하지 않습니다.
                </div>
            </div>
        );
    }


    // 수정: project → displayProject
    // DB 프로젝트와 목업 프로젝트 모두 동일한 형태로 처리하기 위함
    const startDate = new Date(displayProject.startDate);
    const endDate = new Date(displayProject.endDate);
    const today = new Date();


    // ============================================================
    // 추가: 프로젝트 상태 표시
    //
    // 목록 카드(ProjectCard)와 동일하게 DB/목업의 status 값을 사용한다.
    //
    // PREPARING → 준비중
    // ONGOING   → 진행중
    // SUCCESS   → 성공
    // FAILED    → 실패
    //
    // status가 없거나 알 수 없는 값이면 "상태 확인중"으로 표시한다.
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
    // 추가: 실제 날짜 기준 마감 여부
    //
    // 기존 코드의 날짜 계산은 그대로 유지한다.
    // 다만 상태 표시와는 별개의 값으로 사용한다.
    // ============================================================
    const isEnded = today > endDate;


    const navigate = useNavigate();
    const [supportAmount, setSupportAmount] = useState(10000);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // 상세 페이지의 "펀딩하기" 버튼 클릭 시 후원 금액 입력 모달이 뜨며 백엔드로 후원 요청을 보낸 후 마이페이지로 이동하는 동적 로직
    const handleSupportSubmit = async () => {
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
            alert(err.response?.data?.message || err.message || "후원 처리 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="ProjectDetailPage">

            <div className="ProjectDetailContainer">

                {/* 프로젝트 이미지 */}
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


                {/* 프로젝트 기본 정보 */}
                <section className="ProjectDetailInfo">

                    {/* 수정: 날짜 기준 "마감/진행중" 대신 DB/목업 status를 표시 */}
                    <div
                        className={`ProjectDetailStatus ${statusInfo.className}`}
                    >
                        {statusInfo.label}
                    </div>


                    <h1 className="ProjectDetailTitle">
                        {displayProject.title}
                    </h1>


                    <div className="ProjectDetailCreator">
                        작성자&nbsp; {displayProject.creatorId}
                    </div>


                    <div className="ProjectDetailAmount">

                        <span>목표 금액</span>

                        <strong>
                            {Number(
                                displayProject.targetAmount
                            ).toLocaleString("ko-KR")}원
                        </strong>

                    </div>


                    <div className="ProjectDetailDate">

                        <div>
                            <span>펀딩 시작</span>

                            <strong>
                                {startDate.toLocaleDateString(
                                    "ko-KR"
                                )}
                            </strong>
                        </div>


                        <div>
                            <span>펀딩 종료</span>

                            <strong>
                                {endDate.toLocaleDateString(
                                    "ko-KR"
                                )}
                            </strong>
                        </div>

                    </div>


                    {/* 수정: 상태에 따라 펀딩 버튼 동작 변경 */}
                    <button
                        className="ProjectDetailFundingBtn"
                        disabled={
                            displayProject.status !== "ONGOING" ||
                            isEnded
                        }
                        onClick={() => setShowSupportModal(true)}
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
                                            : "펀딩하기"
                        }
                    </button>

                </section>

                {showSupportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                        <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-left border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">프로젝트 후원하기</h3>
                            <p className="text-xs text-gray-500 mb-4">{displayProject.title}</p>

                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">후원 금액 (원)</label>
                                <input
                                    type="number"
                                    value={supportAmount}
                                    onChange={(e) => setSupportAmount(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-slate-800"
                                    placeholder="금액 입력"
                                    step="1000"
                                    min="1000"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setShowSupportModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    disabled={submitting}
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSupportSubmit}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                                    disabled={submitting}
                                >
                                    {submitting ? "처리 중..." : "후원 결제"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* 프로젝트 설명 */}
                <section className="ProjectDetailContent">

                    <h2>프로젝트 소개</h2>

                    <div
                        className="ProjectDetailContentBody"
                        dangerouslySetInnerHTML={{
                            __html: displayProject.contentHtml
                        }}
                    />

                </section>

            </div>

        </div>
    );
}

export default ProjectDetailPage;