import "./Search.css";
import { useEffect, useState } from "react";
import { searchUsers } from "../../services/userService";
import DiscoveryGrid from "./DiscoveryGrid";
import { FiSearch } from "react-icons/fi";

function SearchPage() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedRole !== "All") params.role = selectedRole;
        if (selectedDomain) params.domain = selectedDomain;
        const data = await searchUsers(params);
        setUsers(data);
      } catch (error) {
        console.error(error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [selectedRole, selectedDomain]);

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.skills?.some((skill) => skill.toLowerCase().includes(term)) ||
      user.domain?.toLowerCase().includes(term)
    );
  });

  const displayedUsers = filteredUsers.slice(0, visibleCount);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setVisibleCount(3);
  };

  const handleDomainChange = (domain) => {
    setSelectedDomain((current) => (current === domain ? "" : domain));
    setVisibleCount(3);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setVisibleCount(3);
  };

  const clearFilters = () => {
    setSelectedRole("All");
    setSelectedDomain("");
    setSearchTerm("");
    setVisibleCount(3);
  };

  return (
    <div className="search-page">
      <section className="search-hero">
        <h1>
          Discover <span className="first-span">Talent</span> on Campus.
        </h1>
        <p>
          Find alumni, project collaborators, and hackathon teammates based on
          verified skills and real experience.
        </p>

        <div className="search-box">
          <span className="search-icon">
            <FiSearch />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by skill, domain, or name..."
          />
          <button className="search-btn" type="button">
            Search
          </button>
        </div>
      </section>
      <section className="discovery-section">
        <div className="sidebar">
          <h3>Roles</h3>

          <div className="role-filters">
            <button
              className={selectedRole === "All" ? "active-role" : "nonactive-role"}
              onClick={() => handleRoleChange("All")}
            >
              All
            </button>

            <button
              className={selectedRole === "student" ? "active-role" : "nonactive-role"}
              onClick={() => handleRoleChange("student")}
            >
              Students
            </button>

            <button
              className={selectedRole === "alumni" ? "active-role" : "nonactive-role"}
              onClick={() => handleRoleChange("alumni")}
            >
              Alumni
            </button>
          </div>

          <h3>Domains</h3>
          <div className="domain-tags">
            <button
              className={selectedDomain === "Frontend" ? "active-domain" : ""}
              onClick={() => handleDomainChange("Frontend")}
            >
              Frontend
            </button>

            <button
              className={selectedDomain === "Backend" ? "active-domain" : ""}
              onClick={() => handleDomainChange("Backend")}
            >
              Backend
            </button>

            <button
              className={selectedDomain === "AI/ML" ? "active-domain" : ""}
              onClick={() => handleDomainChange("AI/ML")}
            >
              AI/ML
            </button>

            <button
              className={selectedDomain === "Design" ? "active-domain" : ""}
              onClick={() => handleDomainChange("Design")}
            >
              Design
            </button>
            <button className="clear-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <DiscoveryGrid
            filteredUsers={displayedUsers}
            totalUsers={filteredUsers.length}
            onLoadMore={() => setVisibleCount((prev) => prev + 6)}
            hasMore={visibleCount < filteredUsers.length}
          />
        )}
      </section>
    </div>
  );
}

export default SearchPage;
