import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function LoginForm({ setIsLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/manual-login",
        formData,
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/search");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/search";
    } catch (err) {
      console.error(err.response?.data?.message);
    }
  };

  return (
    <div>
      <h1 className="login-title">Sign In</h1>
      <p className="login-sub-title">Welcome back, Builder</p>

      <form onSubmit={handleSubmit}>
        <div className="inputgroup">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your VIT email"
            required
          />
        </div>
        <div className="inputgroup">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="loginbtn">
          Sign In
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", margin: "2rem 0" }}>
        <hr style={{ flex: 1, borderColor: "#eee", margin: 0 }} />
        <span style={{ margin: "0 10px", color: "#888", fontSize: "0.9rem" }}>
          OR
        </span>
        <hr style={{ flex: 1, borderColor: "#eee", margin: 0 }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.log("Login Failed");
            alert("Google Login Failed");
          }}
        />
      </div>

      <p className="auth-footer" style={{ marginTop: "2rem" }}>
        New here?{" "}
        <span onClick={() => setIsLogin(false)} className="auth-link">
          Create an Account
        </span>
      </p>
    </div>
  );
}
export default LoginForm;
