import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css"; // import CSS file

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="overlay"></div>
      <div className="landing-content">
        <h1>Welcome to ZAM-ZAM GENERAL STORE</h1>
        <p>Books, gifts and everyday essentials — curated for you</p>
        <Link to="/home">
          <button className="btn">Enter Store</button>
        </Link>
      </div>
    </div>
  );
}
