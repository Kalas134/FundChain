import React from "react";
import { useNavigate } from "react-router-dom";

function ProjectCard({ project }) {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/projects/${project.projectId}`);
    };

    return (
        <div
            onClick={handleClick}
            style={{
                cursor: "pointer",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px"
            }}
        >
            {
                project.thumbnailImage && (
                    <img
                        src={project.thumbnailImage}
                        alt={project.title}
                        style={{
                            width: "100%",
                            maxHeight: "200px",
                            objectFit: "cover"
                        }}
                    />
                )
            }

            <h2>{project.title}</h2>

            <p>
                목표 금액 :
                {" "}
                {Number(project.targetAmount).toLocaleString()}원
            </p>

            <p>
                상태 :
                {" "}
                {project.status}
            </p>
        </div>
    );
}

export default ProjectCard;