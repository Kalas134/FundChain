import React from 'react';

function ProjectForm() {
    return (
        <div>
            <form className="projectCreateForm">
                <input type="text" className="projectTitle" placeholder="프로젝트 제목 입력"/>
                <input type="text" className="projectSummary" placeholder="프로젝트 한 줄 소개" />
                <input type="text" className="projectDescription" placeholder="프로젝트 상세 설명" />
                <input type="file" className="projectThumbnail" />
                <input type="text" className="projectTargetAmount" placeholder="프로젝트 목표 금액"/>
                {/* 여기에 프로젝트 종료일 입력 */}

            {/* 프로젝트 제목, 프로젝트 한 줄 소개, 프로젝트 상세 설명, 프로젝트 대표 이미지, 프로젝트 목표 금액, 프로젝트 종료일, 프로젝트 카테고리(?), 자동(프로젝트 작성자, 프로젝트 생성일, [계산]프로젝트 상태) */}
            </form>
        </div>
    );
}

export default ProjectForm;