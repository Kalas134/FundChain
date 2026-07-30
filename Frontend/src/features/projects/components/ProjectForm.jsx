import { useEffect, useState, useRef } from "react";
import { uploadProjectImage } from "../../../services/supabaseClient";

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

    // 지연 업로드를 위한 선택 파일 및 로컬 미리보기 상태
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [showUrlInput, setShowUrlInput] = useState(false);

    const fileInputRef = useRef(null);

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

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

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

    /**
     * 파일 선택 시 즉시 업로드하지 않고 로컬 미리보기만 할당 (지연 업로드)
     */
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const localUrl = URL.createObjectURL(file);
        setSelectedFile(file);
        setPreviewUrl(localUrl);
        setUploadError(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /**
     * 이미지 삭제 및 선택 해제
     */
    const handleRemoveImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setSelectedFile(null);
        setFormData((prev) => ({
            ...prev,
            thumbnailImage: ""
        }));
    };

    /**
     * 프로젝트 등록/수정 제출 시점에만 Supabase Storage 업로드 실행
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUploading) return;

        let finalThumbnailImage = formData.thumbnailImage;

        try {
            setIsUploading(true);
            setUploadError(null);

            // 선택된 새 이미지 파일이 있는 경우 최종 저장 버튼을 누를 때 업로드 진행
            if (selectedFile) {
                finalThumbnailImage = await uploadProjectImage(selectedFile);
            }

            if (!finalThumbnailImage) {
                alert("프로젝트 대표 이미지를 선택하거나 URL을 입력해 주세요.");
                setIsUploading(false);
                return;
            }

            if (onSubmit) {
                await onSubmit({
                    ...formData,
                    thumbnailImage: finalThumbnailImage,
                    startDate: new Date(formData.startDate).toISOString(),
                    endDate: new Date(formData.endDate).toISOString(),
                    contentHtml: `<p>${formData.contentHtml}</p>`
                });
            }
        } catch (err) {
            console.error("프로젝트 제출/이미지 업로드 실패:", err);
            setUploadError("프로젝트 저장 중 오류가 발생했습니다.");
            throw err;
        } finally {
            setIsUploading(false);
        }
    };

    const displayImage = previewUrl || formData.thumbnailImage;

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

            {/* 대표 프로젝트 이미지 업로드 & 목표 금액 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-semibold text-slate-700">
                            프로젝트 대표 이미지 <span className="text-rose-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline"
                        >
                            {showUrlInput ? "파일로 선택하기" : "URL 직접 입력하기"}
                        </button>
                    </div>

                    {/* hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {showUrlInput ? (
                        <input
                            type="text"
                            name="thumbnailImage"
                            value={formData.thumbnailImage}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-funding focus:outline-none focus:ring-2 focus:ring-funding/20 transition-all"
                        />
                    ) : (
                        <div className="space-y-3">
                            {displayImage ? (
                                <div className="relative rounded-xl border border-slate-200 overflow-hidden group bg-slate-50">
                                    <img
                                        src={displayImage}
                                        alt="프로젝트 썸네일 미리보기"
                                        className="w-full h-44 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold rounded-lg shadow cursor-pointer transition-all"
                                        >
                                            이미지 변경
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            disabled={isUploading}
                                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-all"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="w-full h-44 border-2 border-dashed border-slate-300 hover:border-funding rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer group"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-funding group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-slate-700 block">클릭하여 이미지 파일 선택</span>
                                            <span className="text-xs text-slate-400">등록 시점에 Supabase Storage에 자동 업로드됩니다</span>
                                        </div>
                                    </div>
                                </button>
                            )}

                            {uploadError && (
                                <p className="text-xs font-semibold text-rose-500">{uploadError}</p>
                            )}
                        </div>
                    )}
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
                disabled={isUploading}
                className="w-full mt-4 rounded-xl bg-funding py-3.5 text-base font-bold text-white shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all active:translate-y-0 disabled:opacity-50"
            >
                {isUploading ? "이미지 업로드 및 프로젝트 저장 중..." : submitText}
            </button>
        </form>
    );
}

export default ProjectForm;