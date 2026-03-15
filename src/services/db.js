/**
 * services/db.js
 * Client-side storage simulating a SQL database using localStorage.
 *
 * SQL Schema (simulated):
 * ─────────────────────────────────────────────────────────────
 * CREATE TABLE analysis_history (
 *   id                  INTEGER PRIMARY KEY AUTOINCREMENT,
 *   website_url         VARCHAR(500) NOT NULL,
 *   performance_score   INTEGER,
 *   seo_score           INTEGER,
 *   accessibility_score INTEGER,
 *   best_practices_score INTEGER,
 *   strategy            VARCHAR(10) DEFAULT 'desktop',
 *   issue_count         INTEGER DEFAULT 0,
 *   analysis_date       DATETIME DEFAULT CURRENT_TIMESTAMP
 * );
 * ─────────────────────────────────────────────────────────────
 */

const TABLE_KEY = "sitescope_analysis_history";
const MAX_RECORDS = 20; // Keep last 20 analyses (SELECT TOP 20)

/**
 * INSERT INTO analysis_history (...) VALUES (...)
 */
export const insertAnalysis = (result) => {
  const records = getAllAnalyses();
  const newRecord = {
    id: Date.now(), // Auto-increment simulation
    website_url: result.url,
    performance_score: result.scores.performance,
    seo_score: result.scores.seo,
    accessibility_score: result.scores.accessibility,
    best_practices_score: result.scores.bestPractices,
    strategy: result.strategy,
    issue_count: result.issues.length,
    analysis_date: result.analyzedAt,
  };

  // Prepend new record (most recent first)
  const updated = [newRecord, ...records].slice(0, MAX_RECORDS);
  localStorage.setItem(TABLE_KEY, JSON.stringify(updated));
  return newRecord;
};

/**
 * SELECT * FROM analysis_history ORDER BY analysis_date DESC
 */
export const getAllAnalyses = () => {
  try {
    return JSON.parse(localStorage.getItem(TABLE_KEY)) || [];
  } catch {
    return [];
  }
};

/**
 * DELETE FROM analysis_history WHERE id = ?
 */
export const deleteAnalysis = (id) => {
  const records = getAllAnalyses().filter((r) => r.id !== id);
  localStorage.setItem(TABLE_KEY, JSON.stringify(records));
};

/**
 * DELETE FROM analysis_history
 */
export const clearAllAnalyses = () => {
  localStorage.removeItem(TABLE_KEY);
};

/**
 * SELECT COUNT(*) FROM analysis_history
 */
export const getAnalysisCount = () => getAllAnalyses().length;
