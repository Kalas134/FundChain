import React from "react";

function AboutPage() {
    return (
        <div className="min-h-[calc(100vh-140px)] w-full bg-bg text-tcolor">

            {/* 소개 페이지 전체 컨테이너 */}
            <main className="container-custom flex w-full flex-col items-center pt-12 pb-16 md:pt-16">

                {/* 소개 Hero */}
                <section className="flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 md:p-12 text-center shadow-sm">

                    <span className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold tracking-widest text-accent uppercase">
                        ABOUT FUNDCHAIN
                    </span>

                    <h1 className="text-3xl sm:text-4xl font-bold text-thcolor my-2">
                        FundChain
                    </h1>

                    <p className="mt-1 text-lg font-medium text-slate-600">
                        투명하고 안전한 크라우드 펀딩 플랫폼
                    </p>

                    <p className="mt-4 max-w-[650px] text-sm md:text-base leading-relaxed text-slate-500">
                        FundChain은 창작자와 후원자를 연결하여
                        다양한 프로젝트가 안정적으로 진행될 수 있도록 지원합니다.
                    </p>

                </section>


                {/* 서비스 핵심 가치 (3개 카드) */}
                <section className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-3">

                    {/* 01 */}
                    <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 font-bold text-accent text-sm mb-4">
                            01
                        </div>

                        <h3 className="text-xl font-bold text-thcolor">
                            신뢰할 수 있는 펀딩
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            프로젝트 생성부터 후원까지
                            필요한 과정을 체계적으로 관리합니다.
                        </p>

                    </article>


                    {/* 02 */}
                    <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 font-bold text-accent text-sm mb-4">
                            02
                        </div>

                        <h3 className="text-xl font-bold text-thcolor">
                            투명한 거래 기록
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            SHA-256 기반 검증 구조를 통해
                            거래 데이터의 무결성을 관리합니다.
                        </p>

                    </article>


                    {/* 03 */}
                    <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 font-bold text-accent text-sm mb-4">
                            03
                        </div>

                        <h3 className="text-xl font-bold text-thcolor">
                            함께 만드는 프로젝트
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            창작자와 후원자를 연결하여
                            새로운 프로젝트와 아이디어를 지원합니다.
                        </p>

                    </article>

                </section>


                {/* FundChain의 방향 */}
                <section className="mt-8 flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 md:p-10 text-center shadow-sm">

                    <h2 className="text-2xl font-bold text-thcolor">
                        FundChain이 만드는 가치
                    </h2>

                    <p className="mt-4 max-w-[700px] text-sm md:text-base leading-relaxed text-slate-500">
                        창작자는 자신의 아이디어를 프로젝트로 발전시키고,
                        후원자는 새로운 프로젝트에 참여할 수 있습니다.
                        FundChain은 그 사이를 연결하는 신뢰 높은 플랫폼을 지향합니다.
                    </p>

                </section>

            </main>

        </div>
    );
}

export default AboutPage;