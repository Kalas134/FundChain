import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useProjects from "../hooks/useProjects";
import "../../../styles/frame.css";

// 추가: 크리에이터 마이페이지에서 사용하던 목업 프로젝트 데이터
import { mockCreatorProjects } from "../../mypage/mockData";


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

    const isEnded = today > endDate;


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

                    <div className="ProjectDetailStatus">
                        {isEnded ? "마감" : "진행중"}
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


                    <button
                        className="ProjectDetailFundingBtn"
                        disabled={isEnded}
                    >
                        {isEnded
                            ? "마감된 프로젝트"
                            : "펀딩하기"
                        }
                    </button>

                </section>


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