import React, { useEffect, useState } from "react";
import { getScoreColor } from "../../utils/helpers";
import "./ScoreCard.css";

// SVG circle math: r=54, circumference = 2π×54 ≈ 339.3
const CIRCUMFERENCE = 2 * Math.PI * 54;

const ScoreCard = ({ label, score, icon, delay = 0 }) => {
  const [animated, setAnimated] = useState(false);
  const { hex, label: statusLabel } = getScoreColor(score);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const offset = animated
    ? CIRCUMFERENCE * (1 - score / 100)
    : CIRCUMFERENCE;

  return (
    <article
      className="score-card card-glass"
      aria-label={`${label}: ${score} out of 100 — ${statusLabel}`}
    >
      <div className="score-card-inner">
        {/* SVG Progress Ring */}
        <div className="score-ring-wrap" aria-hidden="true">
          <svg
            className="score-ring"
            viewBox="0 0 120 120"
            width="120"
            height="120"
          >
            {/* Background track */}
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              strokeWidth="8"
              stroke="var(--border)"
            />
            {/* Animated progress arc */}
            <circle
              className="score-arc"
              cx="60" cy="60" r="54"
              fill="none"
              strokeWidth="8"
              stroke={hex}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
            />
          </svg>

          {/* Score number inside ring */}
          <div className="score-center">
            <span className="score-number" style={{ color: hex }}>
              {score}
            </span>
            <span className="score-max">/100</span>
          </div>
        </div>

        {/* Label and status */}
        <div className="score-meta">
          <div className="score-icon" aria-hidden="true">{icon}</div>
          <h3 className="score-label">{label}</h3>
          <span
            className="score-status"
            style={{ color: hex }}
          >
            <i
              className={`bi ${
                score >= 90 ? "bi-check-circle-fill"
                : score >= 50 ? "bi-exclamation-circle-fill"
                : "bi-x-circle-fill"
              }`}
              aria-hidden="true"
            ></i>
            {statusLabel}
          </span>
        </div>
      </div>
    </article>
  );
};

/* Skeleton loader version */
export const ScoreCardSkeleton = () => (
  <div className="score-card card-glass">
    <div className="score-card-inner">
      <div className="skeleton" style={{ width: 120, height: 120, borderRadius: "50%" }}></div>
      <div className="score-meta">
        <div className="skeleton" style={{ width: 40, height: 24, borderRadius: 6, marginBottom: 8 }}></div>
        <div className="skeleton" style={{ width: 100, height: 16, borderRadius: 4, marginBottom: 6 }}></div>
        <div className="skeleton" style={{ width: 70, height: 14, borderRadius: 4 }}></div>
      </div>
    </div>
  </div>
);

export default ScoreCard;
