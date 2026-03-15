import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ theme, onToggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`} role="banner">
      <nav
        className="navbar navbar-expand-lg container-xl"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
          aria-label="SiteScope home"
        >
          <span className="brand-icon" aria-hidden="true">
            <i className="bi bi-activity"></i>
          </span>
          <span className="brand-text">
            Site<span className="brand-accent">Scope</span>
          </span>
        </Link>

        {/* Mobile controls */}
        <div className="d-flex align-items-center gap-2 d-lg-none">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title="Toggle theme"
          >
            <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}`}></i>
          </button>
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="main-nav-menu"
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Nav links */}
        <div
          id="main-nav-menu"
          className={`navbar-collapse-custom ${menuOpen ? "open" : ""}`}
        >
          <ul className="navbar-nav ms-auto align-items-center gap-1 list-unstyled mb-0">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link-custom ${location.pathname === "/" ? "active" : ""}`}
              >
                <i className="bi bi-house" aria-hidden="true"></i>
                <span>Analyzer</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/dashboard"
                className={`nav-link-custom ${location.pathname === "/dashboard" ? "active" : ""}`}
              >
                <i className="bi bi-bar-chart-line" aria-hidden="true"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item d-none d-lg-block">
              <a
                href="https://developers.google.com/speed/docs/insights/v5/about"
                className="nav-link-custom"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-info-circle" aria-hidden="true"></i>
                <span>About API</span>
              </a>
            </li>
            <li className="nav-item d-none d-lg-flex">
              <div className="nav-divider" aria-hidden="true"></div>
            </li>
            <li className="nav-item">
              <button
                className="theme-toggle"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                title={`${theme === "dark" ? "Light" : "Dark"} mode`}
              >
                <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}`}></i>
              </button>
            </li>
            <li className="nav-item">
              <a
                href="https://github.com/EVinayKumar89"
                className="github-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
              >
                <i className="bi bi-github" aria-hidden="true"></i>
                <span className="d-none d-lg-inline">GitHub</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
