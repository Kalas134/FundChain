import React from 'react';
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="min-h-[calc(100vh-140px)] w-full bg-bg text-tcolor">

            {/* 홈 메인 영역 */}
            <main className="container-custom flex flex-col items-center pt-12 pb-16 md:pt-16 text-center">

                {/* 메인 히어로 섹션 */}
                <section className="flex w-full max-w-[900px] flex-col items-center py-6">

                    <span className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold tracking-widest text-accent uppercase">
                        FUNDCHAIN
                    </span>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-thcolor tracking-tight">
                        함께 만드는 프로젝트,
                        <br className="hidden sm:inline" />
                        <span className="text-accent"> 함께 성장하는</span> 크라우드 펀딩
                    </h1>

                    <p className="mt-4 max-w-[620px] text-base leading-relaxed text-slate-600 md:text-lg">
                        창작자와 후원자를 연결하고,
                        프로젝트의 시작부터 후원까지 투명하게 관리하는
                        크라우드 펀딩 플랫폼입니다.
                    </p>

                    {/* 버튼 영역 */}
                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">

                        <Link to={"/projects"}>
                            <button
                                type="button"
                                className="rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-emerald-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                            >
                                프로젝트 둘러보기
                            </button>
                        </Link>

                        <Link to={"/AboutPage"}>
                            <button
                                type="button"
                                className="rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-thcolor shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                FundChain 소개
                            </button>
                        </Link>

                    </div>

                </section>


                {/* 서비스 특징 카드 목록 */}
                <section className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-3">

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
                            전체 과정을 체계적으로 관리합니다.
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
                            SHA-256 기반 검증 구조로
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
                            새로운 프로젝트를 만들어갑니다.
                        </p>

                    </article>

                </section>

            </main>

        </div>
    );
}

export default HomePage;