import React, { useState, useMemo } from "react";

const FAQ_DATA = [
  {
    id: 1,
    category: "펀딩/결제",
    question: "펀딩 결제는 언제 진행되나요?",
    answer:
      "펀딩 프로젝트는 목표 달성 시 마감일 익일에 결제가 예약 진행됩니다. 프로젝트 마감 직전까지 언제든지 펀딩을 취소하거나 결제 수단을 변경할 수 있습니다."
  },
  {
    id: 2,
    category: "펀딩/결제",
    question: "펀딩 참여 후 취소 및 환불이 가능한가요?",
    answer:
      "프로젝트 마감 전까지는 [마이페이지 > 내 펀딩 내역]에서 직접 취소가 가능합니다. 프로젝트 마감 후에는 이미 제작 및 배송 준비 단계에 들어가므로 원칙적으로 취소가 불가능하며, 창작자의 환불 정책에 따릅니다."
  },
  {
    id: 3,
    category: "펀딩/결제",
    question: "리워드 배송 일정은 어떻게 확인하나요?",
    answer:
      "각 프로젝트 상세 페이지 하단 및 스토리 영역에서 창작자가 설정한 예상 배송 시작일을 확인할 수 있습니다. 배송이 시작되면 등록하신 이메일과 SMS로 운송장 번호가 안내됩니다."
  },
  {
    id: 4,
    category: "프로젝트 개설",
    question: "프로젝트는 누구나 개설할 수 있나요?",
    answer:
      "본인 인증을 완료한 회원은 누구나 프로젝트를 신청할 수 있습니다. 다만, 펀딩 진행을 위해 가이드라인 준수 여부 및 신원/사업자 검증 절차가 진행됩니다."
  },
  {
    id: 5,
    category: "프로젝트 개설",
    question: "목표 금액을 달성하지 못하면 어떻게 되나요?",
    answer:
      "FundChain은 All-or-Nothing 방식을 기본 적용하고 있습니다. 마감일까지 목표 금액에 달성하지 못할 경우, 예약된 펀딩 결제는 모두 취소되며 후원자에게 비용이 청구되지 않습니다."
  },
  {
    id: 6,
    category: "프로젝트 개설",
    question: "프로젝트 심사 기간은 얼마나 걸리나요?",
    answer:
      "프로젝트 제출 후 영업일 기준 3~5일 이내에 심사 결과가 등록된 이메일로 안내됩니다. 서류 보완이 필요한 경우 기간이 다소 연장될 수 있습니다."
  },
  {
    id: 7,
    category: "회원/인증",
    question: "회원 정보 변경 및 탈퇴는 어떻게 하나요?",
    answer:
      "로그인 후 [마이페이지 > 프로필 설정]에서 비밀번호 및 회원 정보를 수정할 수 있습니다. 진행 중인 펀딩이나 프로젝트가 없는 경우 마이페이지 하단에서 탈퇴 신청이 가능합니다."
  },
  {
    id: 8,
    category: "플랫폼/보안",
    question: "FundChain의 블록체인 검증 방식은 무엇인가요?",
    answer:
      "FundChain은 펀딩 참여 기록 및 거래 데이터의 무결성을 보장하기 위해 SHA-256 기반 이중 검증 블록 구조를 활용합니다. 이를 통해 후원 내역의 위변조를 방지하고 투명성을 제공합니다."
  },
  {
    id: 9,
    category: "플랫폼/보안",
    question: "후원금은 어떻게 보호되나요?",
    answer:
      "후원금은 프로젝트가 성공 후 최종 정산 단계 전까지 안전한 에스크로 계좌 시스템을 통해 보호되며, 무단 사용이 불가능하도록 체계적으로 관리됩니다."
  }
];

const CATEGORIES = ["전체", "펀딩/결제", "프로젝트 개설", "회원/인증", "플랫폼/보안"];

function CustomerSupportPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaqId((prevId) => (prevId === id ? null : id));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchCategory =
        selectedCategory === "전체" || faq.category === selectedCategory;
      const matchQuery =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-140px)] w-full bg-bg text-tcolor">
      {/* 고객센터 전체 컨테이너 */}
      <main className="container-custom flex flex-col items-center pt-12 pb-16 md:pt-16">
        
        {/* 상단 Hero 영역 */}
        <section className="flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 md:p-12 text-center shadow-sm">
          <span className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold tracking-widest text-accent uppercase">
            CUSTOMER CENTER
          </span>

          <h1 className="text-3xl font-bold text-thcolor sm:text-4xl my-2">
            자주 묻는 질문 (FAQ)
          </h1>

          <p className="mt-2 text-base md:text-lg font-medium text-slate-600">
            FundChain 서비스 이용에 도움이 필요하신가요?
          </p>

          <p className="mt-2 max-w-[650px] text-sm md:text-base text-slate-500">
            궁금한 항목을 키워드로 검색하시거나 카테고리별 질문을 확인해 보세요.
          </p>

          {/* 검색 바 */}
          <div className="relative mt-6 w-full max-w-[560px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="궁금하신 내용을 입력해 보세요 (예: 결제, 취소, 심사)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-5 pr-12 text-sm text-slate-800 outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* 카테고리 탭 영역 */}
        <section className="mt-8 flex w-full flex-wrap justify-center gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-accent text-white shadow-sm font-bold"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-accent/40 hover:text-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* FAQ 아코디언 리스트 영역 */}
        <section className="mt-8 flex w-full flex-col gap-3.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <article
                  key={faq.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between p-6 text-left transition hover:bg-slate-50/80"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-28 shrink-0 text-center rounded-lg bg-accent/10 py-1 text-xs font-bold text-accent">
                        {faq.category}
                      </span>
                      <h3 className="text-base md:text-lg font-bold text-thcolor mb-0">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-accent/10 text-accent" : "text-slate-400"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/60 p-6 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-slate-300 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-base font-semibold text-slate-600">
                검색 결과와 일치하는 자주 묻는 질문이 없습니다.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                다른 검색어나 카테고리를 선택해보세요.
              </p>
            </div>
          )}
        </section>

        {/* 하단 고객센터 안내 영역 */}
        <section className="mt-10 flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm md:flex-row md:justify-between md:p-10 md:text-left">
          <div>
            <h2 className="text-xl font-bold text-thcolor">
              원하는 답을 찾지 못하셨나요?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              고객센터 운영시간: 평일 10:00 ~ 18:00 (주말 및 공휴일 휴무)
            </p>
            <p className="mt-1 text-xs text-slate-400">
              * 본 페이지는 자주 묻는 질문(FAQ) 안내 전용 정적 페이지입니다.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <a
              href="mailto:support@fundchain.com"
              className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm font-bold shadow-md hover:bg-indigo-600"
            >
              이메일 문의: support@fundchain.com
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}

export default CustomerSupportPage;
