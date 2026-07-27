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
    <div className="min-h-screen w-full bg-bg text-tcolor">
      {/* 고객센터 전체 컨테이너 */}
      <main className="flex w-full flex-col items-center px-6 py-16">
        
        {/* 상단 Hero 영역 */}
        <section className="flex w-full max-w-[1080px] flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-accent">
            CUSTOMER CENTER
          </p>

          <h1 className="text-4xl font-bold text-tcolor md:text-5xl">
            자주 묻는 질문 (FAQ)
          </h1>

          <p className="mt-5 text-lg text-gray-500">
            FundChain 서비스 이용에 도움이 필요하신가요?
          </p>

          <p className="mt-3 max-w-[650px] text-sm leading-7 text-gray-500">
            궁금한 항목을 키워드로 검색하시거나 카테고리별 질문을 확인해 보세요.
          </p>

          {/* 검색 바 */}
          <div className="relative mt-8 w-full max-w-[600px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="궁금하신 내용을 입력해 보세요 (예: 결제, 취소, 심사)"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-5 pr-12 text-sm text-tcolor outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
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
        <section className="mt-10 flex w-full max-w-[1080px] flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-accent text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-accent/40 hover:text-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* FAQ 아코디언 리스트 영역 */}
        <section className="mt-8 flex w-full max-w-[1080px] flex-col gap-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <article
                  key={faq.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-gray-50/80"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-accent-bg px-2.5 py-1 text-xs font-semibold text-accent">
                        {faq.category}
                      </span>
                      <h2 className="text-base font-semibold text-tcolor md:text-lg mb-0">
                        {faq.question}
                      </h2>
                    </div>
                    <div
                      className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-accent/10 text-accent" : "text-gray-400"
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
                    <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-5 text-sm leading-7 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-300 mb-3"
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
              <p className="text-base font-medium text-gray-500">
                검색 결과와 일치하는 자주 묻는 질문이 없습니다.
              </p>
              <p className="mt-1 text-xs text-gray-400">
                다른 검색어나 카테고리를 선택해보세요.
              </p>
            </div>
          )}
        </section>

        {/* 하단 고객센터 안내 영역 */}
        <section className="mt-12 flex w-full max-w-[1080px] flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm md:flex-row md:justify-between md:px-10 md:text-left">
          <div>
            <h2 className="text-xl font-bold text-tcolor">
              원하는 답을 찾지 못하셨나요?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              고객센터 운영시간: 평일 10:00 ~ 18:00 (주말 및 공휴일 휴무)
            </p>
            <p className="mt-1 text-xs text-gray-400">
              * 본 페이지는 자주 묻는 질문(FAQ) 안내 전용 정적 페이지입니다.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <a
              href="mailto:support@fundchain.com"
              className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold shadow"
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
