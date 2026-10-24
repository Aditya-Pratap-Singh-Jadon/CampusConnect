import "./Profile.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../services/userService";
import { getMe } from "../../services/authService";
import ProjectCard from "./ProjectCard";
import { getGithubRepos } from "../../services/githubService";
import { getGithubUsername } from "../../utils/github";

import {
  Globe,
  GraduationCap,
  Settings,
  Zap,
  MessageSquare,
  Handshake,
  Star,
  Users,
  Trophy,
  Plus,
  ExternalLink,
  X,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repos, setRepos] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tags: "",
    link: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const data = id ? await getUserById(id) : await getMe();
        setUser(data);
      } catch (err) {
        console.error("CampusConnect Profile Error:", err);
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchGitHubData = async () => {
      if (!user || !user.github) {
        setRepos([]);
        return;
      }
      try {
        const username = getGithubUsername(user.github);
        if (username) {
          const githubRepos = await getGithubRepos(username);
          setRepos(githubRepos);
        } else {
          setRepos([]);
        }
      } catch (githubError) {
        console.error("Gracefully caught GitHub extraction error:", githubError);
        setRepos([]);
      }
    };
    fetchGitHubData();
  }, [user]);

  const handleAddProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.description.trim()) return;
    const processedTags = newProject.tags
      ? newProject.tags.split(",").map((t) => t.trim()).filter((t) => t !== "")
      : [];
    const projectPayload = {
      title: newProject.title,
      description: newProject.description,
      tags: processedTags,
      link: newProject.link,
    };
    try {
      // TODO: Replace with your backend service integration when ready:
      // const updatedUser = await userService.addProject(projectPayload);
      // setUser(updatedUser);
      
      const temporaryProjectList = user.projects ? [...user.projects] : [];
      temporaryProjectList.push({ ...projectPayload, _id: Date.now().toString() });
      setUser({ ...user, projects: temporaryProjectList });
      setNewProject({ title: "", description: "", tags: "", link: "" });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error creating project manually:", err);
      alert("Failed to save project. Check your connection.");
    }
  };
  if (loading) {
    return (
      <div className="profile-loading-error">
        <h2>Loading Profile...</h2>
      </div>
    );
  }
  if (error || !user) {
    return (
      <div className="profile-loading-error">
        <h2>{error || "Profile not found"}</h2>
      </div>
    );
  }
  const isOwnProfile = !id;
  return (
    <div className="profile-page">
      <div className="profile-banner">
        <div className="profile-banner-gradient" />
      </div>
      <div className="profile-section">
        <div className="profile-info">
          {user.profilePicture ? (
            <img
              className="profile-avatar"
              src={user.profilePicture}
              alt={user.name}
            />
          ) : (
            <div className="profile-avatar profile-avatar-placeholder">
              {user.name?.charAt(0)}
            </div>
          )}
          <div className="profile-identity-text">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-subtitle">
              <GraduationCap size={18} className="subtitle-icon" />
              <span>
                {user.branch || "Branch Not Added"}
                {user.year && `, Class of '${String(user.year).slice(-2)}`}
                {user.college && ` @ ${user.college}`}
              </span>
            </p>
          </div>
        </div>
        <div className="profile-actions">
          {isOwnProfile ? (
            <button
              className="profile-message-btn"
              onClick={() => navigate("/complete-profile")}
            >
              <Settings size={16} strokeWidth={2.5} /> Edit Profile
            </button>
          ) : (
            <>
              <button
                className="profile-mentor-btn"
                onClick={() => alert("Connection request sent!")}
              >
                <Zap size={16} strokeWidth={2.5} fill="currentColor" /> Connect
              </button>
              <button className="profile-message-btn">
                <MessageSquare size={16} strokeWidth={2.5} /> Direct Message
              </button>
              {user.role === "alumni" && (
                <button className="profile-mentor-btn">
                  <Handshake size={16} strokeWidth={2.5} /> Request Mentorship
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="profile-content">
        <aside className="profile-sidebar">
          <div className="profile-card">
            <h2>Bio</h2>
            <hr />
            <p>
              {user.bio || "No bio added yet. Click edit profile to add yours!"}
            </p>
          </div>
          {(user.github || user.linkedin || user.portfolio) && (
            <div className="profile-card">
              <h2>Links</h2>
              <hr />
              <div className="profile-social-icons">
                {user.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-social-link"
                    title="GitHub Profile"
                  >
                    <FaGithub />
                    <span>
                      {user.github
                        .replace("https://github.com/", "")
                        .replace("http://github.com/", "")
                        .replace(/\/$/, "")}
                    </span>
                  </a>
                )}
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-social-link"
                    title="LinkedIn Profile"
                  >
                    <FaLinkedin />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {user.portfolio && (
                  <a href={user.portfolio} className="profile-social-link">
                    <Globe size={18} />
                    <span>{user.portfolio}</span>
                  </a>
                )}
              </div>
            </div>
          )}
          <div className="profile-card">
            <h2>Reputation</h2>
            <hr />
            <div className="profile-stat-row">
              <span className="stat-label">
                <Star size={16} className="stat-icon" strokeWidth={2.5} />{" "}
                Mentorships Given
              </span>
              <strong>{user.role === "alumni" ? "12" : "0"}</strong>
            </div>
            <div className="profile-stat-row">
              <span className="stat-label">
                <Users size={16} className="stat-icon" strokeWidth={2.5} />{" "}
                Teams Led
              </span>
              <strong>5</strong>
            </div>
            <div className="profile-stat-row">
              <span className="stat-label">
                <Trophy size={16} className="stat-icon" strokeWidth={2.5} />{" "}
                Achievements Tracker
              </span>
              <strong>{user.achievements?.length || 0}</strong>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-skills-header">
              <h2>Skills</h2>
              {!isOwnProfile && <span className="endorse-link">Endorse</span>}
            </div>
            <hr />
            <div className="profile-skills">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill) => <span key={skill}>{skill}</span>)
              ) : (
                <p className="no-data-text">No technical skills added yet.</p>
              )}
            </div>
          </div>
        </aside>

        <main className="profile-projects-section">
          {repos.length > 0 && (
            <>
              <h2 className="profile-projects-title">GitHub Projects</h2>
              <div className="profile-projects-grid" style={{ marginBottom: "40px" }}>
                {repos.slice(0, 6).map((repo) => (
                  <div key={repo.id} className="profile-project-card">
                    <div className="profile-project-body">
                      <h3>{repo.name}</h3>
                      <p>{repo.description || "No description available"}</p>
                      
                      <div className="profile-tags">
                        {repo.language && <span>{repo.language}</span>}
                      </div>
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="project-view-action-btn">
                        <span>View Repository</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="profile-projects-header-row">
            <h2 className="profile-projects-title">Projects & Work</h2>
          </div>

          {showAddForm && (
            <div className="profile-card manual-project-form-card">
              <div className="form-title-bar">
                <h3>Add New Project</h3>
                <button className="close-form-btn" onClick={() => setShowAddForm(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddProjectSubmit} className="manual-project-form">
                <div className="form-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., CampusConnect Platform"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Brief description of what you built, your tech stack, and your role..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tech Stack / Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, MongoDB, WebSockets"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Project Link / Deployment URL</label>
                  <input
                    type="url"
                    placeholder="https://myproject.com or development landing url"
                    value={newProject.link}
                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                  />
                </div>
                <div className="form-actions-row">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          )}
          {user.projects && user.projects.length > 0 ? (
            <div className="profile-projects-grid">
              {user.projects.map((project, index) => (
                <ProjectCard
                  key={project._id || index}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  tags={project.tags || []}
                  badge={project.badge}
                  link={project.link}
                />
              ))}
              {isOwnProfile && !showAddForm && (
                <div 
                  className="profile-project-card add-more-projects-card"
                  onClick={() => setShowAddForm(true)}
                >
                  <div className="add-more-content">
                    <Plus size={32} className="add-more-icon" />
                    <span>Add More Projects</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            !showAddForm && (
              <div className="profile-card project-placeholder-card">
                <p>No projects linked to this profile yet.</p>
                {isOwnProfile && (
                  <button
                    className="profile-mentor-btn manual-add-trigger-btn"
                    style={{ marginTop: "15px", justifyContent: "center" }}
                    onClick={() => setShowAddForm(true)}
                  >
                    <Plus size={16} strokeWidth={2.5} /> Add More Project
                  </button>
                )}
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
