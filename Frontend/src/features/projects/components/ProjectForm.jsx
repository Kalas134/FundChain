import { useEffect, useState } from "react";

function ProjectForm({
    initialData,
    onSubmit,
    submitText = "저장"
}) {

    const [formData, setFormData] = useState({
        title: "",
        thumbnailImage: "",
        targetAmount: "",
        startDate: "",
        endDate: "",
        contentHtml: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                thumbnailImage: initialData.thumbnailImage || "",
                targetAmount: initialData.targetAmount || "",
                startDate: formatDateTime(initialData.startDate),
                endDate: formatDateTime(initialData.endDate),
                contentHtml: removeHtmlTag(initialData.contentHtml)
            });
        }
    }, [initialData]);

    const formatDateTime = (date) => {
        if (!date) return "";
        return date.substring(0, 16);
    };

    const removeHtmlTag = (html) => {
        if (!html) return "";
        return html.replace(/<[^>]*>/g, "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                contentHtml: `<p>${formData.contentHtml}</p>`
            });
        }
    };

    return (
        <form
            className="w-full bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm text-left space-y-6"
            onSubmit={handleSubmit}
        >
            {/* 프로젝트 제목 */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    프로젝트 제목 <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="프로젝트의 인상적인 제목을 입력하세요"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-funding focus:outline-none focus:ring-2 focus:ring-funding/20 transition-all"
                />
            </div>

            {/* 썸네일 이미지 & 목표 금액 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        대표 이미지 URL
                    </label>
                    <input
                        type="text"
                        name="thumbnailImage"
                        value={formData.thumbnailImage}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-funding focus:outline-none focus:ring-2 focus:ring-funding/20 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        목표 펀딩 금액 (원) <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="targetAmount"
                        value={formData.targetAmount}
                        onChange={handleChange}
                        required
                        placeholder="예: 1000000"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-funding focus:outline-none focus:ring-2 focus:ring-funding/20 transition-all"
                    />
                </div>
            </div>

            {/* 시작일 & 종료일 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        펀딩 시작 일시 <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-funding focus:outline-none focus:ring-2 focus:ring-funding/20 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        펀딩 마감 일시 <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-funding focus:outline-none focus:ring-2 focus:ring-funding/20 transition-all"
                    />
                </div>
            </div>

            {/* 상세 스토리 및 설명 */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    프로젝트 상세 설명 <span className="text-rose-500">*</span>
                </label>
                <textarea
                    name="contentHtml"
                    rows="8"
                    value={formData.contentHtml}
                    onChange={handleChange}
                    required
                    placeholder="프로젝트의 배경, 목적, 리워드 세부 정보 등을 자유롭게 작성해주세요."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-funding focus:outline-none focus:ring-2 focus:ring-funding/20 transition-all resize-none"
                />
            </div>

            {/* 제출 버튼 */}
            <button
                type="submit"
                className="w-full mt-4 rounded-xl bg-funding py-3.5 text-base font-bold text-white shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all active:translate-y-0"
            >
                {submitText}
            </button>
        </form>
    );
}

export default ProjectForm;