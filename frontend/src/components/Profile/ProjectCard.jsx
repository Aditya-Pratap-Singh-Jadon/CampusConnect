import { ExternalLink } from "lucide-react";
import "./ProjectCard.css";

export default function ProjectCard({ title, description, image, tags, badge, link }) {
  return (
    <div className="profile-project-card manual-work-card">
      {image && (
        <div className="project-card-image-wrapper">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="profile-project-body">
        <div className="project-card-header">
          <h3>{title}</h3>
          {badge && <span className="project-badge">{badge}</span>}
        </div>
        
        <p>{description}</p>
        
        <div className="profile-tags">
          {tags && tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noreferrer" 
            className="project-view-action-btn"
          >
            <span>View Project</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
