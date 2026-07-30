import React, { useState } from "react";
import { 
    LayoutGrid, 
    BookOpen, 
    Music, 
    Gamepad2, 
    Cpu, 
    Palette, 
    ThumbsUp, 
    MessageSquare, 
    PlusCircle, 
    Search,
    User,
    CheckCircle2,
    Clock,
    Sparkles,
    X
} from "lucide-react";

// 카테고리 정보 데이터
const CATEGORIES = [
    { id: "all", name: "전체", icon: LayoutGrid, count: 12 },
    { id: "novel", name: "소설/문학", icon: BookOpen, count: 3 },
    { id: "music", name: "음악/공연", icon: Music, count: 2 },
    { id: "game", name: "게임/웹툰", icon: Gamepad2, count: 3 },
    { id: "tech", name: "IT/테크", icon: Cpu, count: 2 },
    { id: "design", name: "디자인/아트", icon: Palette, count: 2 },
];

// 목업 프로젝트 제안 목록 데이터
const INITIAL_PROPOSALS = [
    {
        id: 1,
        category: "novel",
        categoryName: "소설/문학",
        title: "조선 오컬트 퇴마 판타지 웹소설 단행본 제작",
        description: "조선 시대를 배경으로 한 신비롭고 어두운 퇴마 오컬트 소설입니다. 소장 가치 높은 하드커버 양장본 패키지를 원합니다!",
        proposer: "글쟁이이씨",
        likes: 184,
        comments: 24,
        status: "창작자 검토 중",
        statusColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
        createdAt: "2일 전"
    },
    {
        id: 2,
        category: "game",
        categoryName: "게임/웹툰",
        title: "레트로 픽셀 도트 스타일 2D 덱빌딩 턴제 RPG",
        description: "고전 JRPG의 감성과 현대적인 카드 덱빌딩 시스템을 결합한 인디 게임 프로젝트를 창작자님들께서 만들어주셨으면 합니다.",
        proposer: "픽셀마스터",
        likes: 256,
        comments: 42,
        status: "펀딩 준비 중",
        statusColor: "bg-indigo-50 text-indigo-600 border-indigo-200",
        createdAt: "3일 전"
    },
    {
        id: 3,
        category: "tech",
        categoryName: "IT/테크",
        title: "개발자를 위한 초슬림 기계식 로우프로파일 키보드",
        description: "휴대성이 뛰어나면서도 기계식 키보드의 타건감을 살린 슬림 알루미늄 커스텀 키보드 펀딩을 제안합니다.",
        proposer: "코딩하는고양이",
        likes: 129,
        comments: 18,
        status: "모집 중",
        statusColor: "bg-amber-50 text-amber-600 border-amber-200",
        createdAt: "방금 전"
    },
    {
        id: 4,
        category: "music",
        categoryName: "음악/공연",
        title: "시티팝 밴드 초판 한정반 바이닐(LP) 음반 펀딩",
        description: "80년대 아날로그 레트로 감성을 담은 신진 인디 밴드의 시티팝 앨범 LP 리미티드 에디션 발매를 희망합니다.",
        proposer: "LP매니아",
        likes: 98,
        comments: 12,
        status: "모집 중",
        statusColor: "bg-amber-50 text-amber-600 border-amber-200",
        createdAt: "5일 전"
    },
    {
        id: 5,
        category: "design",
        categoryName: "디자인/아트",
        title: "한국 전통 단청 문양 현대적 디자인 굿즈 세트",
        description: "우리나라 단청의 아름다움을 현대적 감각으로 재해석한 스마트폰 케이스 및 데스크 테리어 굿즈 패키지 제안입니다.",
        proposer: "단청아티스트",
        likes: 145,
        comments: 29,
        status: "창작자 검토 중",
        statusColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
        createdAt: "1주일 전"
    },
    {
        id: 6,
        category: "novel",
        categoryName: "소설/문학",
        title: "SF 디스토피아 단편 문학 앤솔로지 펀딩",
        description: "독립 작가 5인이 모여 미래 AI 사회를 다룬 SF 단편 소설집 출간을 제안합니다. 일러스트레이터와의 협업 작품 포함.",
        proposer: "미래소설가",
        likes: 87,
        comments: 9,
        status: "모집 중",
        statusColor: "bg-amber-50 text-amber-600 border-amber-200",
        createdAt: "1주일 전"
    }
];

function ProjectProposalPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
    const [likedIds, setLikedIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    
    // 모달 폼 상태
    const [formData, setFormData] = useState({
        title: "",
        category: "novel",
        description: "",
        proposer: ""
    });

    // 카테고리 필터링
    const filteredProposals = proposals.filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const matchesSearch = item.title.includes(searchQuery) || item.description.includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    // 좋아요(공감) 클릭 핸들러
    const handleLike = (id) => {
        const isLiked = likedIds.includes(id);
        setLikedIds(isLiked ? likedIds.filter((item) => item !== id) : [...likedIds, id]);
        setProposals(proposals.map((item) => {
            if (item.id === id) {
                return { ...item, likes: isLiked ? item.likes - 1 : item.likes + 1 };
            }
            return item;
        }));
    };

    // 제안 등록 폼 제출
    const handleSubmitProposal = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            alert("제목과 내용을 입력해 주세요!");
            return;
        }

        const categoryObj = CATEGORIES.find(c => c.id === formData.category);

        const newProposal = {
            id: Date.now(),
            category: formData.category,
            categoryName: categoryObj ? categoryObj.name : "일반",
            title: formData.title,
            description: formData.description,
            proposer: formData.proposer || "익명 후원자",
            likes: 1,
            comments: 0,
            status: "모집 중",
            statusColor: "bg-amber-50 text-amber-600 border-amber-200",
            createdAt: "방금 전"
        };

        setProposals([newProposal, ...proposals]);
        setShowModal(false);
        setFormData({ title: "", category: "novel", description: "", proposer: "" });
        alert("🎉 프로젝트 제안이 등록되었습니다!");
    };

    return (
        <div className="min-h-[calc(100vh-140px)] w-full bg-bg text-tcolor py-10 md:py-14">
            <main className="container-custom flex flex-col items-center">
                {/* 히어로 영역 */}
                <section className="flex w-full max-w-[800px] flex-col items-center text-center mb-8">
                    <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold tracking-widest text-accent uppercase">
                        <Sparkles className="w-3.5 h-3.5" /> FUNDCHAIN PROPOSAL
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug text-thcolor tracking-tight my-1">
                        세상에 없던 아이디어, <span className="text-accent">프로젝트 제안</span>
                    </h1>
                    <p className="mt-2 max-w-[600px] text-sm md:text-base leading-relaxed text-slate-500">
                        보고 싶은 펀딩 아이디어를 직접 제안하고, 다른 후원자들과 공감을 나눠보세요. 
                        창작자가 여러분의 아이디어를 바탕으로 펀딩을 시작할 수 있습니다!
                    </p>

                    <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-400 hover:shadow hover:-translate-y-0.5"
                        >
                            <PlusCircle className="w-4 h-4" /> 새 프로젝트 제안하기
                        </button>
                    </div>
                </section>

                {/* 검색 및 카테고리 필터 섹션 */}
                <section className="w-full max-w-[1100px] mb-8">
                    {/* 카테고리 버튼 그룹 */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
                        {CATEGORIES.map((cat) => {
                            const IconComponent = cat.icon;
                            const isActive = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                        isActive
                                            ? "bg-accent text-white shadow-sm"
                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                                    }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span>{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* 검색 바 */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="관심 있는 아이디어나 키워드를 검색해 보세요..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                        />
                    </div>
                </section>

                {/* 제안 목록 카드 그리드 */}
                <section className="w-full max-w-[1100px]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-thcolor flex items-center gap-2">
                            제안 목록 <span className="text-sm font-semibold text-slate-400">({filteredProposals.length}건)</span>
                        </h2>
                    </div>

                    {filteredProposals.length === 0 ? (
                        <div className="w-full rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
                            <p className="text-base font-medium">검색된 프로젝트 제안이 없습니다.</p>
                            <p className="text-xs text-slate-400 mt-1">첫 번째 제안의 주인공이 되어보세요!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProposals.map((item) => {
                                const isLiked = likedIds.includes(item.id);
                                return (
                                    <article
                                        key={item.id}
                                        className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                    {item.categoryName}
                                                </span>
                                                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${item.statusColor}`}>
                                                    {item.status}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-thcolor leading-snug line-clamp-2 mb-2">
                                                {item.title}
                                            </h3>

                                            <p className="text-sm leading-relaxed text-slate-500 line-clamp-3 mb-4">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                            <div className="flex items-center gap-1 text-slate-600 font-medium">
                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{item.proposer}</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleLike(item.id)}
                                                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                                                        isLiked
                                                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                                                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                                                    }`}
                                                >
                                                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                                                    <span>{item.likes}</span>
                                                </button>

                                                <div className="inline-flex items-center gap-1 text-slate-500">
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    <span>{item.comments}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* 제안 등록 모달 팝업 */}
                {showModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn"
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 shadow-xl animate-popIn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                                <h3 className="text-xl font-bold text-thcolor flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-accent" /> 새 프로젝트 제안하기
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitProposal} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">카테고리</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-accent"
                                    >
                                        {CATEGORIES.filter(c => c.id !== "all").map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">제안 제목</label>
                                    <input
                                        type="text"
                                        placeholder="예: 조선 오컬트 퇴마 판타지 소설 출간 희망"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-accent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">작성자 닉네임</label>
                                    <input
                                        type="text"
                                        placeholder="닉네임 (미입력 시 익명 후원자)"
                                        value={formData.proposer}
                                        onChange={(e) => setFormData({ ...formData, proposer: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-accent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">제안 내용</label>
                                    <textarea
                                        rows={4}
                                        placeholder="원하는 프로젝트의 구체적인 아이디어나 펀딩 구성을 설명해 주세요."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-accent resize-none"
                                        required
                                    />
                                </div>

                                <div className="pt-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="w-1/3 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-2/3 rounded-xl bg-accent py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-400"
                                    >
                                        제안 등록
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ProjectProposalPage;
