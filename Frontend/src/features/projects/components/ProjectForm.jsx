import { useEffect, useState } from "react";

function ProjectForm({
    initialData,
    onSubmit
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
     * 수정 페이지인 경우 기존 데이터 반영
     */
    useEffect(() => {

        if (initialData) {
            setFormData({
                title: initialData.title || "",
                thumbnailImage: initialData.thumbnailImage || "",
                targetAmount: initialData.targetAmount || "",
                startDate: initialData.startDate || "",
                endDate: initialData.endDate || "",
                contentHtml: initialData.contentHtml || ""
            });
        }
    }, [initialData]);

    /**
     * 입력값 변경
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
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>프로젝트 제목</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>썸네일 이미지 URL</label>
                <input
                    type="text"
                    name="thumbnailImage"
                    value={formData.thumbnailImage}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>목표 금액</label>

                <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>시작일</label>

                <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>종료일</label>

                <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>프로젝트 내용</label>
                <textarea
                    name="contentHtml"
                    rows="10"
                    value={formData.contentHtml}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">
                저장
            </button>
        </form>
    );
}

export default ProjectForm;