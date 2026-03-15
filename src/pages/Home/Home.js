import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import URLInput from "../../components/URLInput/URLInput";
import HistoryPanel from "../../components/HistoryPanel/HistoryPanel";
import "./Home.css";

const FEATURES = [
  { icon: "bi-speedometer2", label: "Performance", desc: "Core Web Vitals & load time metrics", color: "#3b82f6" },
  { icon: "bi-search-heart", label: "SEO", desc: "Meta tags, crawlability & structure", color: "#8b5cf6" },
  { icon: "bi-universal-access", label: "Accessibility", desc: "WCAG compliance & ARIA checks", color: "#22c55e" },
  { icon: "bi-shield-check", label: "Best Practices", desc: "HTTPS, vulnerabilities & security", color: "#f59e0b" },
];

const Home = ({
  onAnalyze, loading, error, progress, strategy,
  onStrategyChange, onClearError, result
}) => {
  const navigate = useNavigate();

  // Auto-navigate to dashboard once result is ready
  useEffect(() => {
    if (result) navigate("/dashboard");
  }, [result, navigate]);

  const handleAnalyze = async (url) => {
    await onAnalyze(url);
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section" aria-labelledby="hero-heading">
        <div className="container-xl">
          <div className="hero-content">
            {/* Badge */}
            <div className="hero-badge" aria-label="Powered by Google PageSpeed Insights">
              <i className="bi bi-google" aria-hidden="true"></i>
              Powered by Google PageSpeed Insights API
            </div>

            {/* Heading */}
            <h1 id="hero-heading" className="hero-heading">
              Analyze Any Website's
              <span className="gradient-text"> Health & SEO</span>
            </h1>

            <p className="hero-sub">
              Get instant performance, SEO, accessibility, and best-practice scores.
              Identify issues and fix them — free, no sign-up required.
            </p>

            {/* Input */}
            <div className="hero-input-wrap">
              <URLInput
                onSubmit={handleAnalyze}
                loading={loading}
                strategy={strategy}
                onStrategyChange={onStrategyChange}
                error={error}
                onClearError={onClearError}
              />
            </div>

            {/* Progress bar */}
            {loading && (
              <div
                className="analysis-progress"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Analysis progress: ${progress}%`}
              >
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="progress-steps">
                  {[
                    { at: 15, label: "Fetching page…" },
                    { at: 35, label: "Running Lighthouse audits…" },
                    { at: 55, label: "Checking SEO signals…" },
                    { at: 72, label: "Analyzing accessibility…" },
                    { at: 85, label: "Building report…" },
                  ].map(({ at, label }) => (
                    <span
                      key={at}
                      className={`progress-step ${progress >= at ? "active" : ""}`}
                    >
                      {progress >= at && <i className="bi bi-check-circle-fill" aria-hidden="true"></i>}
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Feature cards */}
          <div className="feature-grid" role="list" aria-label="Analysis categories">
            {FEATURES.map(({ icon, label, desc, color }) => (
              <div key={label} className="feature-card card-glass" role="listitem">
                <div className="feature-icon" style={{ background: `${color}18`, color }}>
                  <i className={`bi ${icon}`} aria-hidden="true"></i>
                </div>
                <h3 className="feature-label">{label}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History section */}
      <section className="history-section" aria-labelledby="history-heading">
        <div className="container-xl">
          <div className="section-header">
            <div>
              <h2 id="history-heading" className="section-title">
                <i className="bi bi-clock-history" aria-hidden="true"></i>
                Recent Analyses
              </h2>
              <p className="section-sub">
                Click any entry to re-run the analysis
              </p>
            </div>
          </div>
          <div className="history-wrap card-glass">
            <HistoryPanel onReAnalyze={handleAnalyze} loading={loading} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section" aria-labelledby="how-heading">
        <div className="container-xl">
          <h2 id="how-heading" className="section-title text-center mb-4">
            How It Works
          </h2>
          <div className="how-grid">
            {[
              { num: "01", icon: "bi-link-45deg", title: "Enter URL", desc: "Paste any public website URL into the analyzer." },
              { num: "02", icon: "bi-cpu", title: "API Runs", desc: "Google PageSpeed Insights runs a full Lighthouse audit." },
              { num: "03", icon: "bi-bar-chart-steps", title: "Get Scores", desc: "Receive performance, SEO, and accessibility scores." },
              { num: "04", icon: "bi-patch-check", title: "Fix Issues", desc: "Review prioritized issues with actionable fix guidance." },
            ].map(({ num, icon, title, desc }) => (
              <div key={num} className="how-card card-glass">
                <div className="how-num">{num}</div>
                <div className="how-icon">
                  <i className={`bi ${icon}`} aria-hidden="true"></i>
                </div>
                <h3 className="how-title">{title}</h3>
                <p className="how-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
