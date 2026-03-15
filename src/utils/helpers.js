/**
 * utils/helpers.js
 * Shared utility functions used across components
 */

/**
 * Validate a URL string
 * Returns { valid: boolean, error: string | null }
 */
export const validateURL = (input) => {
  if (!input || !input.trim()) {
    return { valid: false, error: "Please enter a website URL." };
  }

  let url = input.trim();

  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, error: "URL must use http or https." };
    }
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return { valid: false, error: "Please enter a valid domain (e.g. example.com)." };
    }
    return { valid: true, error: null, normalizedURL: url };
  } catch {
    return { valid: false, error: "Invalid URL format. Try: https://example.com" };
  }
};

/**
 * Get score color class and hex based on score value
 */
export const getScoreColor = (score) => {
  if (score >= 90) return { cls: "score-good", hex: "#22c55e", label: "Good" };
  if (score >= 50) return { cls: "score-warning", hex: "#f59e0b", label: "Needs Improvement" };
  return { cls: "score-poor", hex: "#ef4444", label: "Poor" };
};

/**
 * Get severity badge color
 */
export const getSeverityColor = (severity) => {
  switch (severity) {
    case "High": return { bg: "#fef2f2", text: "#dc2626", border: "#fca5a5" };
    case "Medium": return { bg: "#fffbeb", text: "#d97706", border: "#fcd34d" };
    case "Low": return { bg: "#f0fdf4", text: "#16a34a", border: "#86efac" };
    default: return { bg: "#f1f5f9", text: "#64748b", border: "#cbd5e1" };
  }
};

/**
 * Format a date string for display
 */
export const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Extract clean hostname from URL for display
 */
export const getHostname = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/**
 * Truncate a string with ellipsis
 */
export const truncate = (str, maxLength = 40) => {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
};

/**
 * Calculate overall health score (weighted average)
 */
export const getOverallScore = (scores) => {
  return Math.round(
    scores.performance * 0.35 +
    scores.seo * 0.30 +
    scores.accessibility * 0.20 +
    scores.bestPractices * 0.15
  );
};

/**
 * Convert numeric value (ms) to clean label
 */
export const formatMs = (ms) => {
  if (ms >= 1000) return (ms / 1000).toFixed(1) + " s";
  return Math.round(ms) + " ms";
};
