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
      if (window.innerWidth > 1000) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
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

          <button className="title" type="button" onClick={() => navigate("/")}>
            {WorkingTitle}
          </button>
        </div>

        <div className="nav-right">
          {isLoggedIn && (
            <div className="nav-lists">
              <ul>
                <li><button type="button" onClick={() => navigate("/search")}>Search</button></li>

                <li><button type="button" onClick={() => navigate("/dashboard")}>Dashboard</button></li>

                <li><button type="button" onClick={() => navigate("/posts")}>Posts</button></li>

                <li><button type="button" onClick={() => navigate("/team")}>Meet the Team</button></li>
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
                  aria-expanded={showProfileMenu}
                  aria-controls="profile-menu"
                >
                  Profile
                </button>

                {showProfileMenu && (
                  <div className="profile-dropdown" id="profile-menu">
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

        <button
          className="mobile-menu-btn"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          ☰
        </button>

        {menuOpen && (
          <div className="mobile-dropdown" id="mobile-navigation">
            <ul>
              {isLoggedIn ? <>
                <li><button onClick={() => { navigate("/search"); setMenuOpen(false); }}>Search</button></li>
                <li><button onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}>Dashboard</button></li>
                <li><button onClick={() => { navigate("/posts"); setMenuOpen(false); }}>Posts</button></li>
                <li><button onClick={() => { navigate("/team"); setMenuOpen(false); }}>Meet the Team</button></li>
                <li><button onClick={() => { navigate("/profile"); setMenuOpen(false); }}>View Profile</button></li>
                <li><button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button></li>
              </> : <>
                <li><button onClick={() => { navigate("/auth", { state: { isLogin: true } }); setMenuOpen(false); }}>Login</button></li>
                <li><button onClick={() => { navigate("/auth", { state: { isLogin: false } }); setMenuOpen(false); }}>Create Account</button></li>
              </>}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
