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

    /**
     * 수정 데이터 반영
     */
    useEffect(() => {
        if (initialData) {
            setFormData({
                title:
                    initialData.title || "",
                thumbnailImage:
                    initialData.thumbnailImage || "",
                targetAmount:
                    initialData.targetAmount || "",
                startDate:
                    formatDateTime(
                        initialData.startDate
                    ),
                endDate:
                    formatDateTime(
                        initialData.endDate
                    ),
                contentHtml:
                    removeHtmlTag(
                        initialData.contentHtml
                    )
            });
        }
    }, [initialData]);

    /**
     * 날짜 변환
     *
     * 2026-08-01T00:00:00Z
     *
     * ↓
     *
     * 2026-08-01T00:00
     */
    const formatDateTime = (date) => {
        if (!date) {
            return "";
        }
        return date.substring(0, 16);
    };

    /**
     * HTML 태그 제거
     *
     * <p>내용</p>
     *
     * ↓
     *
     * 내용
     */
    const removeHtmlTag = (html) => {
        if (!html) {
            return "";
        }
        return html.replace(
            /<[^>]*>/g,
            ""
        );
    };

    /**
     * 입력 변경
     */
    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * 제출
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({
                ...formData,
                // 백엔드 ISO 변환
                startDate:
                    new Date(
                        formData.startDate
                    ).toISOString(),
                endDate:
                    new Date(
                        formData.endDate
                    ).toISOString(),
                // HTML 저장 형태 유지
                contentHtml:
                    `<p>${formData.contentHtml}</p>`

            });
        }
    };

    return (
        <form
            className="project-form"
            onSubmit={handleSubmit}
        >
            <div className="project-form-group">
                <label>
                    프로젝트 제목
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="project-form-group">
                <label>
                    썸네일 이미지 URL
                </label>
                <input
                    type="text"
                    name="thumbnailImage"
                    value={formData.thumbnailImage}
                    onChange={handleChange}
                />
            </div>

            <div className="project-form-group">
                <label>
                    목표 금액
                </label>
                <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="project-form-date-group">
                <div className="project-form-group">
                    <label>
                        시작일
                    </label>
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="project-form-group">
                    <label>
                        종료일
                    </label>
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="project-form-group">
                <label>
                    프로젝트 내용
                </label>
                <textarea
                    name="contentHtml"
                    rows="10"
                    value={formData.contentHtml}
                    onChange={handleChange}
                    required
                />
            </div>

            <button
                className="project-submit-btn"
                type="submit"
            >
                {submitText}
            </button>
        </form>
    );
}

export default ProjectForm;