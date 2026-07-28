import React from 'react';
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="min-h-screen w-full bg-bg text-tcolor">

            {/* 홈 메인 영역 */}
            <main className="flex min-h-[calc(100vh-160px)] w-full flex-col items-center justify-center px-6 py-10 text-center">

                {/* 메인 타이틀 */}
                <section className="flex w-full max-w-[1080px] flex-col items-center">

                    <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-accent">
                        FUNDCHAIN
                    </p>

                    <h2 className="text-4xl font-bold leading-tight text-tcolor">
                        함께 만드는 프로젝트,
                        <br />
                        함께 성장하는 크라우드 펀딩
                    </h2>

                    <p className="mt-3 max-w-[650px] text-base leading-7 text-gray-500 md:text-lg">
                        창작자와 후원자를 연결하고,
                        <br />
                        프로젝트의 시작부터 후원까지 투명하게 관리하는
                        <br />
                        크라우드 펀딩 플랫폼입니다.
                    </p>

                    {/* 버튼 영역 */}
                    <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">

                        <Link to={"/projects"}>
                            <button
                                type="button"
                                className="rounded-lg bg-accent px-7 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
                            >
                                프로젝트 둘러보기
                            </button>
                        </Link>

                        <Link to={"/AboutPage"}>
                            <button
                                type="button"
                                className="rounded-lg border border-gray-200 bg-white px-7 py-3 text-sm font-semibold text-tcolor transition-colors hover:bg-gray-50"
                            >
                                FundChain 소개
                            </button>
                        </Link>

                    </div>

                </section>


                {/* 서비스 특징 */}
                <section className="mt-6 grid w-full max-w-[1080px] grid-cols-1 gap-6 md:grid-cols-3">

                    {/* 01 */}
                    <article className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-2 py-5 text-center shadow-sm">

                        <div className="flex h-8 w-12 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                            01
                        </div>

                        <h2 className="mt-2 text-xl font-bold text-tcolor">
                            신뢰할 수 있는 펀딩
                        </h2>

                        <p className="mt-1 text-sm leading-7 text-gray-500">
                            프로젝트 생성부터 후원까지
                            <br />
                            전체 과정을 관리합니다.
                        </p>

                    </article>


                    {/* 02 */}
                    <article className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-2 py-5 text-center shadow-sm">

                        <div className="flex h-8 w-12 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                            02
                        </div>

                        <h2 className="mt-2 text-xl font-bold text-tcolor">
                            투명한 거래 기록
                        </h2>

                        <p className="mt-1 text-sm leading-7 text-gray-500">
                            SHA-256 기반 검증 구조로
                            <br />
                            거래 데이터의 무결성을 관리합니다.
                        </p>

                    </article>


                    {/* 03 */}
                    <article className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-2 py-5 text-center shadow-sm">

                        <div className="flex h-8 w-12 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                            03
                        </div>

                        <h2 className="mt-2 text-xl font-bold text-tcolor">
                            함께 만드는 프로젝트
                        </h2>

                        <p className="mt-1 text-sm leading-7 text-gray-500">
                            창작자와 후원자를 연결하여
                            <br />
                            새로운 프로젝트를 만들어갑니다.
                        </p>

                    </article>

                </section>

            </main>

        </div>
    );
}

export default HomePage;