import React from "react";

function AboutPage() {
    return (
        <div className="min-h-screen w-full bg-bg text-tcolor">

            {/* 소개 페이지 전체 컨테이너 */}
            <main className="flex w-full flex-col items-center px-6 py-16">

                {/* 소개 Hero */}
                <section className="flex w-full max-w-[1080px] flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                    <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-accent">
                        ABOUT FUNDCHAIN
                    </p>

                    <h1 className="text-4xl font-bold text-tcolor md:text-5xl">
                        FundChain
                    </h1>

                    <p className="mt-5 text-lg text-gray-500">
                        투명하고 안전한 크라우드 펀딩 플랫폼
                    </p>

                    <p className="mt-6 max-w-[650px] text-sm leading-7 text-gray-500">
                        FundChain은 창작자와 후원자를 연결하여
                        <br />
                        다양한 프로젝트가 안정적으로 진행될 수 있도록 지원합니다.
                    </p>

                </section>


                {/* 서비스 소개 */}
                <section className="mt-12 grid w-full max-w-[1080px] grid-cols-1 gap-6 md:grid-cols-3">

                    {/* 01 */}
                    <article className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                            01
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            신뢰할 수 있는 펀딩
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-500">
                            프로젝트 생성부터 후원까지
                            <br />
                            필요한 과정을 체계적으로 관리합니다.
                        </p>

                    </article>


                    {/* 02 */}
                    <article className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                            02
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            투명한 거래 기록
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-500">
                            SHA-256 기반 검증 구조를 통해
                            <br />
                            거래 데이터의 무결성을 관리합니다.
                        </p>

                    </article>


                    {/* 03 */}
                    <article className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                            03
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            함께 만드는 프로젝트
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-500">
                            창작자와 후원자를 연결하여
                            <br />
                            새로운 프로젝트와 아이디어를 지원합니다.
                        </p>

                    </article>

                </section>


                {/* FundChain의 방향 */}
                <section className="mt-12 flex w-full max-w-[1080px] flex-col items-center rounded-2xl bg-white px-6 py-14 text-center">

                    <h2 className="text-2xl font-bold">
                        FundChain이 만드는 가치
                    </h2>

                    <p className="mt-5 max-w-[700px] text-sm leading-7 text-gray-500">
                        창작자는 자신의 아이디어를 프로젝트로 발전시키고,
                        <br />
                        후원자는 새로운 프로젝트에 참여할 수 있습니다.
                        <br />
                        FundChain은 그 사이를 연결하는 플랫폼을 지향합니다.
                    </p>

                </section>

            </main>

        </div>
    );
}

export default AboutPage;