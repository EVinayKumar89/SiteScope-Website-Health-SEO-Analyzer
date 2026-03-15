import React from "react";
import { useNavigate } from "react-router-dom";
import ScoreCard, { ScoreCardSkeleton } from "../../components/ScoreCard/ScoreCard";
import PerformanceChart from "../../components/PerformanceChart/PerformanceChart";
import IssueTable from "../../components/IssueTable/IssueTable";
import {
  getHostname,
  getOverallScore,
  getScoreColor,
  formatDate,
} from "../../utils/helpers";
import "./Dashboard.css";

const Dashboard = ({ result, strategy, onReAnalyze, onReset, loading, progress }) => {
  const navigate = useNavigate();

  // No result: show empty state
  if (!result && !loading) {
    return (
      <div className="dashboard-empty">
        <div className="empty-card card-glass">
          <i className="bi bi-bar-chart-line" aria-hidden="true"></i>
          <h2>No Analysis Yet</h2>
          <p>Run an analysis first to see your website's health report.</p>
          <button
            className="btn-primary-custom"
            onClick={() => navigate("/")}
            aria-label="Go to analyzer"
          >
            <i className="bi bi-arrow-left" aria-hidden="true"></i>
            Go to Analyzer
          </button>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container-xl">
          <div className="dashboard-header skeleton-state">
            <div className="skeleton" style={{ width: 280, height: 28, borderRadius: 8 }}></div>
            <div className="skeleton" style={{ width: 160, height: 16, borderRadius: 6, marginTop: 8 }}></div>
          </div>
          <div className="progress-top" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Analysis: ${progress}%`}>
            <div className="pt-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="scores-grid">
            {[0, 1, 2, 3].map((i) => <ScoreCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const overall = getOverallScore(result.scores);
  const { hex: overallHex, label: overallLabel } = getScoreColor(overall);
  const hostname = getHostname(result.url);

  return (
    <div className="dashboard-page">
      <div className="container-xl">

        {/* Dashboard Header */}
        <header className="dashboard-header" aria-label="Analysis report header">
          <div className="dh-left">
            {/* Site info */}
            <div className="site-info">
              <img
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                alt=""
                className="site-favicon"
                aria-hidden="true"
                loading="lazy"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div>
                <h1 className="site-title">{hostname}</h1>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-url"
                  aria-label={`Visit ${result.url}`}
                >
                  {result.url.length > 60 ? result.url.slice(0, 60) + "…" : result.url}
                  <i className="bi bi-arrow-up-right-square" aria-hidden="true"></i>
                </a>
              </div>
            </div>

            {/* Meta tags */}
            <div className="dh-meta">
              <span className="meta-tag">
                <i className="bi bi-clock" aria-hidden="true"></i>
                {formatDate(result.analyzedAt)}
              </span>
              <span className="meta-tag">
                <i className={`bi ${strategy === "mobile" ? "bi-phone" : "bi-display"}`} aria-hidden="true"></i>
                {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
              </span>
              {result.pageSize && (
                <span className="meta-tag">
                  <i className="bi bi-hdd" aria-hidden="true"></i>
                  {result.pageSize}
                </span>
              )}
              {result.issues.length > 0 && (
                <span className="meta-tag warning">
                  <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
                  {result.issues.length} issue{result.issues.length !== 1 ? "s" : ""} found
                </span>
              )}
            </div>
          </div>

          {/* Overall score + actions */}
          <div className="dh-right">
            <div className="overall-score" aria-label={`Overall health score: ${overall}`}>
              <span className="overall-num" style={{ color: overallHex }}>{overall}</span>
              <div className="overall-meta">
                <span className="overall-label">Overall</span>
                <span className="overall-status" style={{ color: overallHex }}>{overallLabel}</span>
              </div>
            </div>

            <div className="dh-actions">
              <button
                className="btn-reanalyze"
                onClick={() => onReAnalyze(result.url)}
                disabled={loading}
                aria-label="Re-analyze this website"
                title="Re-run analysis"
              >
                <i className="bi bi-arrow-clockwise" aria-hidden="true"></i>
                Re-analyze
              </button>
              <button
                className="btn-new"
                onClick={() => { onReset(); navigate("/"); }}
                aria-label="Analyze a new URL"
              >
                <i className="bi bi-plus" aria-hidden="true"></i>
                New
              </button>
            </div>
          </div>
        </header>

        {/* Demo mode banner */}
        {result.isMockData && (
          <div className="demo-banner" role="alert">
            <i className="bi bi-info-circle-fill" aria-hidden="true"></i>
            <span>
              <strong>Demo Mode</strong> — Google PageSpeed API quota reached for today.
              Showing realistic demo data.{" "}
              <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
                Add a free API key
              </a>{" "}
              for 25,000 real requests/day.
            </span>
          </div>
        )}

        {/* ── Scores Grid ── */}
        <section aria-labelledby="scores-heading" className="dashboard-section">
          <h2 id="scores-heading" className="visually-hidden">Category Scores</h2>
          <div className="scores-grid">
            {[
              { label: "Performance", score: result.scores.performance, icon: "⚡", delay: 0 },
              { label: "SEO", score: result.scores.seo, icon: "🔍", delay: 100 },
              { label: "Accessibility", score: result.scores.accessibility, icon: "♿", delay: 200 },
              { label: "Best Practices", score: result.scores.bestPractices, icon: "🛡️", delay: 300 },
            ].map(({ label, score, icon, delay }) => (
              <ScoreCard key={label} label={label} score={score} icon={icon} delay={delay} />
            ))}
          </div>
        </section>

        {/* ── Performance Charts ── */}
        <section aria-labelledby="charts-heading" className="dashboard-section">
          <div className="section-hdr">
            <h2 id="charts-heading" className="sec-title">
              <i className="bi bi-graph-up" aria-hidden="true"></i>
              Core Web Vitals
            </h2>
            <a
              href="https://web.dev/vitals/"
              target="_blank"
              rel="noopener noreferrer"
              className="sec-learn"
              aria-label="Learn more about Core Web Vitals"
            >
              Learn about Web Vitals
              <i className="bi bi-arrow-up-right-square" aria-hidden="true"></i>
            </a>
          </div>
          <PerformanceChart vitals={result.vitals} />
        </section>

        {/* ── Issues Table ── */}
        <section aria-labelledby="issues-heading" className="dashboard-section">
          <div className="section-hdr">
            <h2 id="issues-heading" className="sec-title">
              <i className="bi bi-exclamation-triangle" aria-hidden="true"></i>
              Issues & Recommendations
            </h2>
            <span className="issues-count-badge">
              {result.issues.filter((i) => i.severity === "High").length} high priority
            </span>
          </div>
          <IssueTable issues={result.issues} />
        </section>

        {/* ── Share / Export Row ── */}
        <section className="share-row card-glass" aria-label="Share options">
          <div className="share-left">
            <h3 className="share-title">Share This Report</h3>
            <p className="share-sub">Copy the URL below to share these results</p>
          </div>
          <div className="share-right">
            <div className="share-url-display">
              <code>{result.url}</code>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(result.url);
                }}
                aria-label="Copy URL to clipboard"
              >
                <i className="bi bi-clipboard" aria-hidden="true"></i>
                Copy
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
