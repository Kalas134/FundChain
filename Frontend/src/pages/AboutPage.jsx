import React from "react";

function AboutPage() {

    return (
        <div className="about-page">
            <section className="about-hero">
                <h1>
                    FundChain
                </h1>
                <p>
                    투명하고 안전한 크라우드 펀딩 플랫폼
                </p>
            </section>

            <section className="about-section">
                <h2>
                    신뢰할 수 있는 펀딩
                </h2>
                <p>
                    프로젝트 생성부터 후원까지
                    모든 과정을 관리합니다.
                </p>
            </section>

            <section className="about-section">
                <h2>
                    투명한 거래 기록
                </h2>
                <p>
                    SHA-256 기반 검증 구조를 통해
                    데이터 변경을 방지합니다.
                </p>
            </section>

            <section className="about-section">
                <h2>
                    함께 만드는 프로젝트
                </h2>
                <p>
                    창작자와 후원자를 연결합니다.
                </p>
            </section>
        </div>
    );
}

export default AboutPage;