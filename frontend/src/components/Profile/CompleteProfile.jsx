import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../services/authService"; 
import { updateProfile } from "../../services/userService"; 
import "./CompleteProfile.css";

export default function CompleteProfile() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    profilePicture: "",
    college: "",
    branch: "",
    year: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    portfolio: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing profile attributes on mount to ensure zero data-loss/overwrites
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const currentUser = await getMe();
        if (currentUser) {
          setFormData({
            name: currentUser.name || "",
            profilePicture: currentUser.profilePicture || "",
            college: currentUser.college || "",
            branch: currentUser.branch || "",
            year: currentUser.year || "",
            bio: currentUser.bio || "",
            skills: currentUser.skills && Array.isArray(currentUser.skills) 
              ? currentUser.skills.join(", ") 
              : "",
            github: currentUser.github || "",
            linkedin: currentUser.linkedin || "",
            portfolio: currentUser.portfolio || ""
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const processedData = {
        ...formData,
        skills: formData.skills 
          ? formData.skills.split(",").map(skill => skill.trim()).filter(Boolean) 
          : []
      };

      await updateProfile(processedData); 
      navigate("/profile"); 
    } catch (err) {
      console.error(err);
      alert("Error updating profile changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-error">
        <h2>Loading your profile configuration...</h2>
      </div>
    );
  }

  return (
    <div className="complete-profile-container">
      <form onSubmit={handleSubmit} className="complete-profile-card">
        <header className="form-header">
          <h2>Edit Profile Details</h2>
          <p>Modify your credentials below. Empty fields will not overwrite data if pre-loaded safely.</p>
        </header>
        <hr />

        <fieldset className="form-section">
          <legend>Personal Information</legend>
          
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name"
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              placeholder="e.g., Alex Mercer"
            />
          </div>

          <div className="input-group">
            <label htmlFor="profilePicture">Profile Picture URL</label>
            <input 
              type="url" 
              id="profilePicture"
              name="profilePicture" 
              value={formData.profilePicture} 
              onChange={handleChange} 
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Academic Credentials</legend>

          <div className="input-group">
            <label htmlFor="college">College / University</label>
            <input 
              type="text" 
              id="college"
              name="college" 
              value={formData.college} 
              onChange={handleChange} 
              placeholder="e.g., Tech University"
            />
          </div>

          <div className="form-row-grid">
            <div className="input-group">
              <label htmlFor="branch">Branch / Major</label>
              <input 
                type="text" 
                id="branch"
                name="branch" 
                value={formData.branch} 
                onChange={handleChange} 
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="input-group">
              <label htmlFor="year">Graduation Year</label>
              <input 
                type="number" 
                id="year"
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
                placeholder="e.g., 2025"
                min="2000"
                max="2040"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Professional Details</legend>

          <div className="input-group">
            <label htmlFor="bio">Bio</label>
            <textarea 
              id="bio"
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              rows="4"
              placeholder="Write a brief introduction about yourself, your passions, and your work..."
            />
          </div>

          <div className="input-group">
            <label htmlFor="skills">Skills (Comma-Separated)</label>
            <input 
              type="text" 
              id="skills"
              name="skills" 
              value={formData.skills} 
              onChange={handleChange} 
              placeholder="React, Node.js, Python, UI/UX"
            />
            <small className="input-help-text">Separate tags with commas (e.g. React, AWS, CSS)</small>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Social Profiles & Links</legend>

          <div className="input-group">
            <label htmlFor="github">GitHub URL</label>
            <input 
              type="url" 
              name="github" 
              id="github"
              value={formData.github} 
              onChange={handleChange} 
              placeholder="https://github.com/username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="linkedin">LinkedIn URL</label>
            <input 
              type="url" 
              name="linkedin" 
              id="linkedin"
              value={formData.linkedin} 
              onChange={handleChange} 
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="portfolio">Personal Portfolio URL</label>
            <input 
              type="url" 
              name="portfolio" 
              id="portfolio"
              value={formData.portfolio} 
              onChange={handleChange} 
              placeholder="https://yourportfolio.com"
            />
          </div>
        </fieldset>

        <div className="form-action-buttons">
          <button 
            type="button" 
            className="profile-message-btn cancel-btn"
            onClick={() => navigate("/profile")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            className="profile-mentor-btn save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving Changes..." : "Save Profile Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
