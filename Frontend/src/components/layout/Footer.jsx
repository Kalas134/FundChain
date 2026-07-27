import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-white">

            {/* Footer 전체 컨테이너 */}
            <div className="mx-auto flex w-full max-w-[1080px] flex-col px-6 py-10">

                {/* 상단 영역 */}
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

                    {/* 서비스 정보 */}
                    <div className="text-center md:text-left">

                        <h2 className="text-xl font-bold text-tcolor">
                            FundChain
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            투명하고 안전한 크라우드 펀딩 플랫폼
                        </p>

                    </div>


                    {/* 서비스 링크 */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm md:justify-end">

                        <Link
                            to="/projects"
                            className="text-gray-500 transition-colors hover:text-tcolor"
                        >
                            프로젝트
                        </Link>

                        <Link
                            to="/AboutPage"
                            className="text-gray-500 transition-colors hover:text-tcolor"
                        >
                            FundChain 소개
                        </Link>

                        <Link
                            to="/support"
                            className="text-gray-500 transition-colors hover:text-tcolor"
                        >
                            고객센터
                        </Link>

                    </div>

                </div>


                {/* 구분선 */}
                <div className="my-8 border-t border-gray-100" />


                {/* 하단 영역 */}
                <div className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-between">

                    <p className="text-xs text-gray-400">
                        © 2026 FundChain. All rights reserved.
                    </p>

                    <p className="text-xs text-gray-400">
                        Web Crowdfunding Platform
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;