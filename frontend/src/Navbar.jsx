import logo from "./assets/Images/ccicon.webp";
import "./Navbar.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, clearAuth } from "./utils/auth";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./context/ThemeContext";

const WorkingTitle = "Campus Connect";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="name_img">
          <img
            src={logo}
            alt="Logo_cc"
            width="64"
            height="64"
            fetchPriority="high"
          />

          <h1 className="title" onClick={() => navigate("/")}>
            {WorkingTitle}
          </h1>
        </div>

        <div className="nav-right">
          {isLoggedIn && (
            <div className="nav-lists">
              <ul>
                <li onClick={() => navigate("/search")}>Search</li>

                <li onClick={() => navigate("/dashboard")}>Dashboard</li>

                <li onClick={() => navigate("/posts")}>Posts</li>

                <li onClick={() => navigate("/team")}>Meet the Team</li>
              </ul>
            </div>
          )}
          
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun
              size={18}
              className={`theme-icon sun ${theme === "light" ? "active" : ""}`}
            />

            <Moon
              size={18}
              className={`theme-icon moon ${theme === "dark" ? "active" : ""}`}
            />
          </button>

          <div className="buttons">
            {!isLoggedIn ? (
              <>
                <button
                  className="login"
                  onClick={() =>
                    navigate("/auth", {
                      state: { isLogin: true },
                    })
                  }
                >
                  Login
                </button>

                <button
                  className="get-started"
                  onClick={() =>
                    navigate("/auth", {
                      state: { isLogin: false },
                    })
                  }
                >
                  Create Account
                </button>
              </>
            ) : (
              <div className="profile-dropdown-wrapper">
                <button
                  className="profile-btn"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  Profile
                </button>

                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <button onClick={() => navigate("/profile")}>
                      View Profile
                    </button>

                    <button onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </button>

                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {isLoggedIn && (
          <div
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ⋮
          </div>
        )}

        {menuOpen && isLoggedIn && (
          <div className="mobile-dropdown">
            <ul>
              <li
                onClick={() => {
                  navigate("/search");
                  setMenuOpen(false);
                }}
              >
                Search
              </li>

              <li
                onClick={() => {
                  navigate("/dashboard");
                  setMenuOpen(false);
                }}
              >
                Dashboard
              </li>

              <li
                onClick={() => {
                  navigate("/posts");
                  setMenuOpen(false);
                }}
              >
                Posts
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
