// // 예시: 후원 금액 입력 화면 등에서 사용할 때
// // 아래는 tailwind css + 커스텀 css
// export default function DonateSection() {
//     return (
//         <div className="p-6">
//             <h2>후원 금액 설정</h2> {/* 소제목: SemiBold (600), 본문색 적용 */}
//             <p>원하는 만큼 펀딩에 참여하여 메이커를 응원해 주세요.</p> {/* 본문: Regular (400) */}

//             {/* 경고 텍스트: SemiBold (600), 경고 컬러 적용 */}
//             <span className="text-warning block my-2">⚠️ 남은 시간 3시간! 곧 마감됩니다!</span>

//             {/* 펀딩 버튼: Bold (700), 인디고 배경, 글자색 #F8FAFC 적용 */}
//             <button className="btn-primary px-6 py-3 w-full">
//                 펀딩하기
//             </button>
//         </div>
//     );
// }

// // 아래는 tailwind CSS만 사용(추천)

// export default function DonateSection() {
//     return (
//         <div className="p-6">
//             <h2>후원 금액 설정</h2>
//             <p>원하는 만큼 펀딩에 참여하여 메이커를 응원해 주세요.</p>

//             {/* 테일윈드에 등록한 'text-warning'과 'font-semibold(600)' 조합 */}
//             <span className="text-warning font-semibold block my-2">
//                 ⚠️ 남은 시간 3시간! 곧 마감됩니다!
//             </span>

//             {/* 테일윈드에 등록한 'bg-funding', '#F8FAFC'를 뜻하는 'text-slate-50', 'font-bold(700)' 조합 */}
//             <button className="bg-funding text-slate-50 font-bold px-6 py-3 w-full rounded-md transition-opacity hover:opacity-90">
//                 펀딩하기
//             </button>
//         </div>
//     );
// }