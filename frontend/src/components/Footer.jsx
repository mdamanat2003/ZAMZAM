import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";



const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Zam-zam General Store</h4>
          <p>Books, gifts and everyday essentials — curated for you.</p>
          <p>
            Email:{" "}
            <a href="mailto:support@zamzamgeneralstore.com">
              support@zamzamgeneralstore.com
            </a>
          </p>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/help">Help</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/terms">Terms of Use</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
       <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="icon fb">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="icon insta">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="icon twitter">
            <FaTwitter />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="icon yt">
            <FaYoutube />
          </a>
        </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Zam-zam General Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
