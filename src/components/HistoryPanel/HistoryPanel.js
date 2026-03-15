import React, { useState, useEffect } from "react";
import { getAllAnalyses, deleteAnalysis, clearAllAnalyses } from "../../services/db";
import { getScoreColor, getHostname, formatDate } from "../../utils/helpers";
import "./HistoryPanel.css";

const HistoryPanel = ({ onReAnalyze, loading }) => {
  const [history, setHistory] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const refresh = () => setHistory(getAllAnalyses());

  useEffect(() => { refresh(); }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteAnalysis(id);
    refresh();
  };

  const handleClearAll = () => {
    clearAllAnalyses();
    refresh();
    setConfirmClear(false);
  };

  const handleReAnalyze = (url) => {
    if (!loading) onReAnalyze(url);
  };

  if (!history.length) {
    return (
      <div className="history-empty">
        <i className="bi bi-clock-history" aria-hidden="true"></i>
        <p>No analysis history yet.</p>
        <span>Analyzed websites will appear here.</span>
      </div>
    );
  }

  return (
    <div className="history-panel" aria-label="Analysis history">
      {/* Header */}
      <div className="history-header">
        <span className="history-count">
          {history.length} record{history.length !== 1 ? "s" : ""}
        </span>
        {confirmClear ? (
          <div className="confirm-clear">
            <span>Clear all?</span>
            <button className="btn-confirm-yes" onClick={handleClearAll} aria-label="Confirm clear all history">Yes</button>
            <button className="btn-confirm-no" onClick={() => setConfirmClear(false)} aria-label="Cancel clear all">No</button>
          </div>
        ) : (
          <button
            className="btn-clear-all"
            onClick={() => setConfirmClear(true)}
            aria-label="Clear all history"
            title="Clear all history"
          >
            <i className="bi bi-trash3" aria-hidden="true"></i>
            Clear all
          </button>
        )}
      </div>

      {/* History list */}
      <ul className="history-list" role="list">
        {history.map((record) => {
          const perf = getScoreColor(record.performance_score);
          const seo  = getScoreColor(record.seo_score);
          const a11y = getScoreColor(record.accessibility_score);
          const hostname = getHostname(record.website_url);

          return (
            <li key={record.id} className="history-item">
              <button
                className="history-item-btn"
                onClick={() => handleReAnalyze(record.website_url)}
                disabled={loading}
                aria-label={`Re-analyze ${hostname}`}
              >
                {/* Site icon */}
                <div className="history-favicon" aria-hidden="true">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                    alt=""
                    width={20}
                    height={20}
                    loading="lazy"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <i className="bi bi-globe2 fallback-icon"></i>
                </div>

                {/* URL + date */}
                <div className="history-info">
                  <span className="history-url">{hostname}</span>
                  <span className="history-date">
                    <i className="bi bi-clock" aria-hidden="true"></i>
                    {formatDate(record.analysis_date)}
                  </span>
                  <span className="history-strategy">
                    <i className={`bi ${record.strategy === "mobile" ? "bi-phone" : "bi-display"}`} aria-hidden="true"></i>
                    {record.strategy}
                  </span>
                </div>

                {/* Mini scores */}
                <div className="history-scores" aria-label="Scores">
                  {[
                    { label: "P", score: record.performance_score, color: perf.hex, title: "Performance" },
                    { label: "S", score: record.seo_score, color: seo.hex, title: "SEO" },
                    { label: "A", score: record.accessibility_score, color: a11y.hex, title: "Accessibility" },
                  ].map(({ label, score, color, title }) => (
                    <div key={label} className="mini-score" title={`${title}: ${score}`} aria-label={`${title}: ${score}`}>
                      <span className="mini-label">{label}</span>
                      <span className="mini-value" style={{ color }}>{score}</span>
                    </div>
                  ))}
                </div>
              </button>

              {/* Delete */}
              <button
                className="history-delete"
                onClick={(e) => handleDelete(record.id, e)}
                aria-label={`Delete ${hostname} from history`}
                title="Remove from history"
              >
                <i className="bi bi-x" aria-hidden="true"></i>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HistoryPanel;
