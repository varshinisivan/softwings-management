import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="landing-title">
        SOFTWINGS TECHNOLOGIES
      </h1>

      <button
        className="login-btn-outline"
        onClick={() => navigate("/login")}
      >
        Login →
      </button>
    </div>
  );
}

export default Landing;
