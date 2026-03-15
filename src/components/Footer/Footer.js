import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container-xl footer-inner">
        {/* Brand + description */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="SiteScope home">
            <span className="footer-logo-icon" aria-hidden="true">
              <i className="bi bi-activity"></i>
            </span>
            Site<span>Scope</span>
          </Link>
          <p className="footer-desc">
            Free website health analyzer powered by Google PageSpeed Insights.
            Check SEO, performance, accessibility, and best practices instantly.
          </p>
        </div>

        {/* Links */}
        <nav className="footer-links" aria-label="Footer navigation">
          <div className="footer-col">
            <h4 className="footer-heading">Tool</h4>
            <ul>
              <li><Link to="/">Analyzer</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Resources</h4>
            <ul>
              <li>
                <a href="https://developers.google.com/speed/docs/insights/v5/about" target="_blank" rel="noopener noreferrer">
                  PageSpeed API
                </a>
              </li>
              <li>
                <a href="https://web.dev/performance/" target="_blank" rel="noopener noreferrer">
                  Web Performance
                </a>
              </li>
              <li>
                <a href="https://web.dev/accessibility/" target="_blank" rel="noopener noreferrer">
                  Accessibility Guide
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Developer</h4>
            <ul>
              <li>
                <a href="https://github.com/EVinayKumar89" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-github" aria-hidden="true"></i> GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/edulakanti-vinay-kumar-45b78a310/" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-linkedin" aria-hidden="true"></i> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container-xl footer-bottom-inner">
          <p className="footer-copy">
            © {year} SiteScope · Built by{" "}
            <a href="https://github.com/EVinayKumar89" target="_blank" rel="noopener noreferrer">
              Edulakanti Vinay Kumar
            </a>{" "}
            with React, Bootstrap & Google PageSpeed Insights API
          </p>
          <div className="footer-badges">
            <span className="tech-badge"><i className="bi bi-lightning-charge-fill" aria-hidden="true"></i> React 18</span>
            <span className="tech-badge"><i className="bi bi-bootstrap-fill" aria-hidden="true"></i> Bootstrap 5</span>
            <span className="tech-badge"><i className="bi bi-google" aria-hidden="true"></i> PageSpeed API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
