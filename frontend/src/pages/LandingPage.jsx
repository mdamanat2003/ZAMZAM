import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css"; // import CSS file

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="overlay"></div>
      <div className="landing-content">
        <h1>Welcome to E-COMMERCE</h1>
        <p>Books, gifts and everyday essentials — curated for you</p>
        <Link to="/home">
          <button className="btn" style={{ padding: "14px 28px", fontSize: "16px" }}>
            Enter Store & Browse Demo Products
          </button>
        </Link>
      </div>
    </div>
  );
}
