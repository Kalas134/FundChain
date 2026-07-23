import React from 'react';


function ProjectCard({ project }) {

    return (
        <div>
            {
                project.thumbnailImage && (
                    <img
                        src={project.thumbnailImage}
                        alt={project.title}
                    />
                )
            }

            <h2>
                {project.title}
            </h2>

            <p>
                목표 금액 :
                {project.targetAmount.toLocaleString()}원
            </p>

            <p>
                상태 :
                {project.status}
            </p>

        </div>
    );
}

export default ProjectCard;