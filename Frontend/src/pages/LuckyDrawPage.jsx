import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/LuckyDrawPage.css";

const DUMMY_WINNERS = [
    { id: 1, user: "fund***77", prize: "1,000,000 P (1등 당첨!)", time: "방금 전" },
    { id: 2, user: "gold***99", prize: "100,000 P", time: "1분 전" },
    { id: 3, user: "crypto***12", prize: "10,000 P", time: "3분 전" },
    { id: 4, user: "block***55", prize: "50,000 P", time: "5분 전" },
    { id: 5, user: "star***00", prize: "10,000 P", time: "8분 전" },
];

const DISAPPOINTING_MESSAGES = [
    "😭 아쉽습니다! 다음 기회에...",
    "🍀 행운의 기운이 1% 부족했습니다! (다음 기회에...)",
    "🪙 펀딩의 신이 잠시 휴가 중입니다. (꽝)",
    "🎁 아쉬워요! 내일 다시 도전해 보세요!",
    "✨ 0.001% 차이로 다음 기회에... (꽝)"
];

function LuckyDrawPage() {
    const canvasRef = useRef(null);
    const [isScratched, setIsScratched] = useState(false);
    const [scratchPercent, setScratchPercent] = useState(0);
    const [chancesLeft, setChancesLeft] = useState(3);
    const [resultMessage, setResultMessage] = useState(DISAPPOINTING_MESSAGES[0]);
    const [showModal, setShowModal] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tickerIndex, setTickerIndex] = useState(0);

    // 티커 롤링 효과
    useEffect(() => {
        const interval = setInterval(() => {
            setTickerIndex((prev) => (prev + 1) % DUMMY_WINNERS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Canvas 황금 캔버스 렌더링
    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        ctx.globalCompositeOperation = "source-over";

        // 황금빛 메탈릭 그라데이션
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#F59E0B");
        grad.addColorStop(0.3, "#FEF08A");
        grad.addColorStop(0.6, "#D97706");
        grad.addColorStop(0.85, "#FDE047");
        grad.addColorStop(1, "#B45309");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // 반짝이 펄 입자 패턴
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        for (let i = 0; i < 120; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 2 + 1;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // 중앙 텍스트 안내
        ctx.fillStyle = "#451A03";
        ctx.font = "bold 18px Pretendard, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✨ 마우스나 손가락으로 긁어보세요 ✨", width / 2, height / 2 - 12);

        ctx.fillStyle = "#78350F";
        ctx.font = "13px Pretendard, sans-serif";
        ctx.fillText("(골드 카드를 긁어서 당첨 결과 확인)", width / 2, height / 2 + 16);

        setIsScratched(false);
        setScratchPercent(0);
    };

    useEffect(() => {
        initCanvas();
    }, []);

    // 긁은 픽셀 계산 (스크래치 펀치 비율 계산)
    const checkScratchPercentage = () => {
        const canvas = canvasRef.current;
        if (!canvas || isScratched) return;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                transparentPixels++;
            }
        }

        const percent = Math.round((transparentPixels / (pixels.length / 4)) * 100);
        setScratchPercent(percent);

        // 35% 이상 긁히면 자동 오픈 처리
        if (percent > 35 && !isScratched) {
            setIsScratched(true);
            setTimeout(() => {
                setShowModal(true);
            }, 500);
        }
    };

    // 마우스/터치 드래그 스크래치 처리
    const scratch = (x, y) => {
        const canvas = canvasRef.current;
        if (!canvas || isScratched) return;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();

        const canvasX = (x - rect.left) * (canvas.width / rect.width);
        const canvasY = (y - rect.top) * (canvas.height / rect.height);

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 28, 0, Math.PI * 2);
        ctx.fill();

        checkScratchPercentage();
    };

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        scratch(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        scratch(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const handleTouchStart = (e) => {
        setIsDrawing(true);
        const touch = e.touches[0];
        scratch(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
        if (!isDrawing) return;
        const touch = e.touches[0];
        scratch(touch.clientX, touch.clientY);
    };

    const handleReset = () => {
        if (chancesLeft <= 1) {
            alert("오늘의 럭키드롭 기회를 모두 사용하셨습니다! 내일 다시 도전해 주세요 🌟");
            return;
        }
        setChancesLeft((prev) => prev - 1);
        const randomIndex = Math.floor(Math.random() * DISAPPOINTING_MESSAGES.length);
        setResultMessage(DISAPPOINTING_MESSAGES[randomIndex]);
        setShowModal(false);
        initCanvas();
    };

    return (
        <div className="min-h-[calc(100vh-140px)] w-full bg-bg text-tcolor py-10 md:py-14">
            <main className="container-custom flex flex-col items-center">
                {/* 히어로 영역 */}
                <section className="flex w-full max-w-[800px] flex-col items-center text-center mb-10">
                    <span className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold tracking-widest text-accent uppercase">
                        ✨ FUNDCHAIN SPECIAL EVENT ✨
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-thcolor tracking-tight">
                        황금 럭키 스크래치 <span className="text-accent">EVENT</span>
                    </h1>
                    <p className="mt-3 max-w-[600px] text-base leading-relaxed text-slate-500 md:text-lg">
                        마우스나 손가락으로 골드 카드를 긁어 당첨 결과를 확인하세요! (최대 100만 펀딩 포인트)
                    </p>

                    {/* 실시간 당첨 전광판 Ticker */}
                    <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2.5 shadow-sm transition-all">
                        <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-extrabold text-white animate-pulse">
                            LIVE 🏆
                        </span>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-slate-700">{DUMMY_WINNERS[tickerIndex].user}</span>
                            <span className="font-bold text-accent">{DUMMY_WINNERS[tickerIndex].prize}</span>
                            <span className="text-xs text-slate-400">({DUMMY_WINNERS[tickerIndex].time})</span>
                        </div>
                    </div>
                </section>

                {/* 메인 스크래치 존 */}
                <section className="flex flex-col items-center w-full mb-14">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                        <span>남은 도전 기회:</span>
                        <span className="text-accent font-extrabold text-lg">{chancesLeft}회</span>
                    </div>

                    <div className="card-frame relative w-[460px] max-w-full h-[260px] rounded-2xl overflow-hidden bg-white border-2 border-amber-300 shadow-md">
                        {/* 스크래치 아래 드러나는 꽝/결과 레이어 */}
                        <div className={`result-underlay ${isScratched ? "revealed" : ""}`}>
                            <div className="result-icon-box text-4xl mb-1 animate-bounce">😭</div>
                            <div className="result-tag text-xs font-bold tracking-widest text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full mb-2">
                                NEXT TIME...
                            </div>
                            <div className="result-text text-lg font-bold text-slate-800 mb-1">{resultMessage}</div>
                            <div className="result-subtext text-xs text-slate-500 max-w-[320px] leading-relaxed mb-4">
                                아쉽게도 이번 도전은 꽝입니다! 행운의 펀딩 기운을 다 모아서 다시 도전해 보세요.
                            </div>

                            {chancesLeft > 1 ? (
                                <button
                                    className="retry-btn rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-400 hover:shadow hover:-translate-y-0.5 active:translate-y-0"
                                    onClick={handleReset}
                                >
                                    🔄 다시 긁기 ({chancesLeft - 1}회 남음)
                                </button>
                            ) : (
                                <button className="retry-btn disabled rounded-xl bg-slate-200 px-6 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed" disabled>
                                    🔒 오늘의 기회 소진 (내일 리셋)
                                </button>
                            )}
                        </div>

                        {/* 위에 덮인 황금 캔버스 레이어 */}
                        <canvas
                            ref={canvasRef}
                            width={460}
                            height={260}
                            className={`scratch-canvas ${isScratched ? "fade-out" : ""}`}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleMouseUp}
                        />
                    </div>

                    <div className="w-[460px] max-w-full mt-4">
                        <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-medium">
                            <span>스크래치 진행률</span>
                            <span>{scratchPercent}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent transition-all duration-200 rounded-full"
                                style={{ width: `${scratchPercent}%` }}
                            ></div>
                        </div>
                    </div>
                </section>

                {/* 이벤트 럭키 경품 안내 */}
                <section className="flex flex-col items-center w-full max-w-[900px]">
                    <h2 className="text-2xl font-bold text-thcolor text-center mb-6">🎁 이벤트 럭키 경품 안내</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                        {/* 1등 */}
                        <article className="flex flex-col items-center rounded-2xl border-2 border-amber-300 bg-white p-7 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative">
                            <div className="mb-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                                1등 (1명)
                            </div>
                            <div className="text-4xl my-2">👑</div>
                            <div className="text-2xl font-extrabold text-amber-600 my-1">1,000,000 P</div>
                            <p className="text-xs text-slate-500">FundChain 전용 펀딩 포인트</p>
                        </article>

                        {/* 2등 */}
                        <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                            <div className="mb-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                2등 (5명)
                            </div>
                            <div className="text-4xl my-2">🥈</div>
                            <div className="text-2xl font-extrabold text-slate-700 my-1">100,000 P</div>
                            <p className="text-xs text-slate-500">모든 프로젝트 자유 후원 가능</p>
                        </article>

                        {/* 3등 */}
                        <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                            <div className="mb-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                                3등 (20명)
                            </div>
                            <div className="text-4xl my-2">🥉</div>
                            <div className="text-2xl font-extrabold text-amber-700 my-1">10,000 P</div>
                            <p className="text-xs text-slate-500">즉시 사용 가능 포인트</p>
                        </article>
                    </div>
                </section>

                {/* 꽝 팝업 모달 */}
                {showModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn"
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl animate-popIn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-5xl mb-3">💣</div>
                            <h3 className="text-xl font-bold text-rose-600 mb-2">아쉽습니다! (꽝)</h3>
                            <p className="text-base font-semibold text-slate-700 mb-3">{resultMessage}</p>
                            <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 p-3 rounded-xl mb-6">
                                💡 팁: 마이페이지에서 후원 내역을 등록하면 추가 럭키 턴이 주어집니다!
                            </p>

                            <div className="flex flex-col gap-2.5">
                                {chancesLeft > 1 ? (
                                    <button
                                        className="w-full rounded-xl bg-accent py-3 font-bold text-white shadow-sm transition-all hover:bg-emerald-400 hover:-translate-y-0.5"
                                        onClick={handleReset}
                                    >
                                        한 번 더 긁어보기!
                                    </button>
                                ) : (
                                    <Link
                                        to="/projects"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:-translate-y-0.5 text-center"
                                    >
                                        프로젝트 둘러보기
                                    </Link>
                                )}
                                <button
                                    className="w-full rounded-xl bg-transparent py-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
                                    onClick={() => setShowModal(false)}
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default LuckyDrawPage;

